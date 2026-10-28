# Skill Switch context-warning hook (UserPromptSubmit). Windows PowerShell 5.1
# compatible (no ternary, no ??). Always exits 0 and prints nothing on errors.
# {"systemMessage": "..."} on stdout warns the user without touching the context.
try {
    $stdin = [Console]::In.ReadToEnd()
    $payload = $stdin | ConvertFrom-Json
    $transcriptPath = $payload.transcript_path
    $sessionId = $payload.session_id
    if (-not $transcriptPath -or -not (Test-Path -LiteralPath $transcriptPath)) { exit 0 }

    # Read only the tail; the context size comes from the last assistant line.
    $fs = [System.IO.File]::Open($transcriptPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
    $len = $fs.Length
    $start = [Math]::Max(0, $len - 524288)
    $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
    $buf = New-Object byte[] ($len - $start)
    $fs.Read($buf, 0, $buf.Length) | Out-Null
    $fs.Close()
    $tail = [System.Text.Encoding]::UTF8.GetString($buf)

    # Take the last assistant line rather than the last "usage":{ match, since a
    # tool_result can contain that text as well.
    $lines = $tail -split "`n"
    $assistantLine = $null
    for ($i = $lines.Length - 1; $i -ge 0; $i--) {
        if ($lines[$i].Contains('"type":"assistant"')) { $assistantLine = $lines[$i]; break }
    }
    if (-not $assistantLine) { exit 0 }

    # Read the fields by name. usage contains a nested "cache_creation" object, so
    # matching up to the first } would cut it off.
    function Get-UsageField($text, $name) {
        $m = [regex]::Match($text, '"' + $name + '":(\d+)')
        if ($m.Success) { return [int64]$m.Groups[1].Value }
        return 0
    }

    $inputTok = Get-UsageField $assistantLine 'input_tokens'
    $cacheRead = Get-UsageField $assistantLine 'cache_read_input_tokens'
    $cacheCreate = Get-UsageField $assistantLine 'cache_creation_input_tokens'
    $context = $inputTok + $cacheRead + $cacheCreate

    # Auto-compact starts at ~970k, so warn from 850k.
    if ($context -lt 850000) { exit 0 }

    # Warn again only after another 100k tokens in the same session.
    $appDataDir = Join-Path $env:LOCALAPPDATA 'com.skillswitch.app'
    New-Item -ItemType Directory -Path $appDataDir -Force | Out-Null
    $statePath = Join-Path $appDataDir 'context-hook-state.json'

    # Named mutex so concurrent sessions don't overwrite each other's state.
    # On timeout, skip the state update but still warn.
    $mutex = New-Object System.Threading.Mutex($false, 'Global\SkillSwitchContextHook')
    $gotLock = $mutex.WaitOne(2000)
    try {
        if ($gotLock) {
            $state = @{}
            if (Test-Path -LiteralPath $statePath) {
                $raw = Get-Content -LiteralPath $statePath -Raw -ErrorAction SilentlyContinue | ConvertFrom-Json -ErrorAction SilentlyContinue
                if ($raw) { $raw.PSObject.Properties | ForEach-Object { $state[$_.Name] = [int64]$_.Value } }
            }

            $lastWarned = 0
            if ($state.ContainsKey($sessionId)) { $lastWarned = $state[$sessionId] }
            if ($lastWarned -gt 0 -and ($context - $lastWarned) -lt 100000) { exit 0 }

            # Crude size cap: start over once more than 200 sessions are stored.
            if ($state.Count -gt 200) { $state = @{} }
            $state[$sessionId] = $context
            ($state | ConvertTo-Json -Compress) | Set-Content -LiteralPath $statePath -Encoding UTF8
        }
    } finally {
        if ($gotLock) { $mutex.ReleaseMutex() }
        $mutex.Dispose()
    }

    $k = [Math]::Round($context / 1000)
    $msg = "Skill Switch: Kontext ≈ ${k}k Tokens — Auto-Compact ab ~970k; bei Bedarf /compact mit Fokus."
    @{ systemMessage = $msg } | ConvertTo-Json -Compress
} catch {
}
exit 0
