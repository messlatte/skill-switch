// Sample data for previewing the UI in a plain browser (npm run dev without Tauri).
// api.ts imports this module only in dev builds, so it is not part of the production bundle.
import type {
  ConnectionTestResult,
  EnvInfo,
  GlobalRouteWarning,
  HookStatus,
  LiveSession,
  OmniState,
  Profile,
  Skill,
  Tokens,
  UsageReport,
} from "./api"

const skills: Skill[] = [
  {
    name: "pdf",
    description: "Extract text and tables from PDF files, fill in forms, merge and split documents.",
    skillMdPath: "C:\\Users\\you\\.claude\\skills\\pdf\\SKILL.md",
    enabled: true,
    manualOnly: false,
    linked: true,
    source: "anthropics/skills",
    sourceUrl: "https://github.com/anthropics/skills",
  },
  {
    name: "xlsx",
    description: "Create and edit spreadsheets with formulas, formatting and charts.",
    skillMdPath: "C:\\Users\\you\\.claude\\skills\\xlsx\\SKILL.md",
    enabled: true,
    manualOnly: false,
    linked: true,
    source: "anthropics/skills",
    sourceUrl: "https://github.com/anthropics/skills",
  },
  {
    name: "webapp-testing",
    description: "Test local web apps with Playwright: screenshots, console logs and UI checks.",
    skillMdPath: "C:\\Users\\you\\.claude\\skills\\webapp-testing\\SKILL.md",
    enabled: false,
    manualOnly: false,
    linked: true,
    source: "anthropics/skills",
    sourceUrl: "https://github.com/anthropics/skills",
  },
  {
    name: "git-commit-helper",
    description: "Write a commit message from the staged diff.",
    skillMdPath: "C:\\Users\\you\\.claude\\skills\\git-commit-helper\\SKILL.md",
    enabled: true,
    manualOnly: true,
    linked: false,
    source: null,
    sourceUrl: null,
  },
]

let profiles: Profile[] = [
  {
    name: "Dokumente",
    skills: { pdf: "active", xlsx: "active", "webapp-testing": "disabled", "git-commit-helper": "manual" },
  },
  {
    name: "Minimal",
    skills: { pdf: "disabled", xlsx: "disabled", "webapp-testing": "disabled", "git-commit-helper": "manual" },
  },
]

const env: EnvInfo = {
  mcpServers: [
    { name: "github", scope: "Global" },
    { name: "postgres", scope: "C:\\Users\\you\\data-pipeline" },
  ],
  plugins: [
    { id: "code-review@team-plugins", version: "1.2.0", enabled: true },
    { id: "release-notes@team-plugins", version: "0.4.1", enabled: false },
  ],
}

const omniState: OmniState = {
  baseUrl: "http://localhost:20128/v1",
  apiKeySet: true,
  projects: [
    {
      path: "C:\\Users\\you\\prototype",
      exists: true,
      active: true,
      baseUrl: "http://localhost:20128/v1",
      hasToken: true,
      gitignoreOk: true,
      gatewayDiscovery: false,
      error: null,
    },
    {
      path: "C:\\Users\\you\\data-pipeline",
      exists: true,
      active: false,
      baseUrl: null,
      hasToken: false,
      gitignoreOk: false,
      gatewayDiscovery: false,
      error: null,
    },
  ],
}

let serviceRunning = false

const live: LiveSession[] = [
  {
    id: "a3f9c210",
    title: "Refactor settings page",
    project: "my-website",
    cwd: "C:\\Users\\you\\my-website",
    entrypoint: "Desktop",
    active: true,
    secondsSinceActivity: 12,
    ageSecs: 3 * 86_400,
    turns: 48,
    requests: 520,
    turnRequests: 9,
    turnErrors: 0,
    compactions: 1,
    model: "claude-opus-5-5",
    effort: "xhigh",
    context: 412_000,
    limitResetInSecs: null,
    agentsActive: 1,
    advice: [
      { level: "high", text: "Kontext 412k — jetzt kompaktieren oder die nächste Aufgabe in einer neuen Session starten.", command: "/compact focus on " },
      { level: "medium", text: "Session ist 3 Tage alt (48 Turns). Neue Session pro Aufgabe.", command: null },
      { level: "info", text: "Effort xhigh aktiv — für Implementierung reicht meist high.", command: null },
      { level: "info", text: "1 Agent(s) schreiben gerade — jeder mit eigenem Kontext.", command: null },
    ],
  },
  {
    id: "7b2e4d91",
    title: null,
    project: "data-pipeline",
    cwd: null,
    entrypoint: "Terminal",
    active: false,
    secondsSinceActivity: 4_100,
    ageSecs: 9 * 86_400,
    turns: 140,
    requests: 1_520,
    turnRequests: 18,
    turnErrors: 4,
    compactions: 5,
    model: "claude-sonnet-5-5",
    effort: "xhigh",
    context: 130_000,
    limitResetInSecs: 1_800,
    agentsActive: 0,
    advice: [
      { level: "ok", text: "Kontext 130k — unkritisch. Bei Themenwechsel trotzdem /clear.", command: "/clear" },
      { level: "info", text: "5h-Limit erreicht — Reset in 30 min.", command: null },
      { level: "medium", text: "Aktueller Turn: 18 Requests, 4 fehlgeschlagene Tool-Aufrufe — sieht nach einer Schleife aus.", command: null },
    ],
  },
]

const tokens = (requests: number, ctx: number, output: number): Tokens => ({
  requests,
  input: Math.round(ctx * 0.02),
  cacheWrite: Math.round(ctx * 0.04),
  cacheRead: Math.round(ctx * 0.94),
  output,
})

const usage: UsageReport = {
  files: 240,
  unreadableLines: 2,
  firstDay: "2026-08-01",
  lastDay: "2026-08-28",
  total: tokens(12_000, 2_400_000_000, 15_000_000),
  byKind: [
    { name: "Hauptsession", tokens: tokens(6_000, 1_500_000_000, 8_000_000), sharePct: 62 },
    { name: "Subagent (Agent-Tool)", tokens: tokens(1_500, 150_000_000, 1_200_000), sharePct: 6 },
    { name: "Workflow-Agent", tokens: tokens(4_500, 750_000_000, 5_800_000), sharePct: 32 },
  ],
  byModel: [
    { name: "claude-opus-5-5", tokens: tokens(7_000, 1_600_000_000, 9_000_000), sharePct: 64 },
    { name: "claude-sonnet-5-5", tokens: tokens(4_000, 650_000_000, 5_000_000), sharePct: 28 },
    { name: "claude-haiku-4-5", tokens: tokens(1_000, 150_000_000, 1_000_000), sharePct: 8 },
  ],
  byEffort: [
    { name: "high", tokens: tokens(6_000, 1_200_000_000, 7_500_000), sharePct: 50 },
    { name: "xhigh", tokens: tokens(4_000, 960_000_000, 6_000_000), sharePct: 40 },
    { name: "unbekannt", tokens: tokens(2_000, 240_000_000, 1_500_000), sharePct: 10 },
  ],
  contextBuckets: [
    { label: "<50k", requests: 3_000, requestsPct: 25, volume: 75_000_000, volumePct: 3 },
    { label: "50–100k", requests: 3_600, requestsPct: 30, volume: 270_000_000, volumePct: 11 },
    { label: "100–150k", requests: 2_000, requestsPct: 17, volume: 250_000_000, volumePct: 10 },
    { label: "150–200k", requests: 1_000, requestsPct: 8, volume: 175_000_000, volumePct: 7 },
    { label: ">200k", requests: 2_400, requestsPct: 20, volume: 1_630_000_000, volumePct: 68 },
  ],
  avgContext: 200_000,
  cacheReadPct: 94,
  largeContextVolumePct: 68,
  apiErrors: 40,
  toolErrors: 310,
  compactions: 12,
  fiveHourHits: 9,
  lastFiveHourReset: null,
  mainSessions: 18,
  totalTurns: 600,
  avgRequestsPerTurn: 10,
  sessionsOver150k: 11,
  sessionsCompacted: 4,
  longSessions: 5,
  longestSessionDays: 12.5,
  longestSessionTurns: 140,
  workflowSharePct: 32,
  workflowAgents: 220,
  sessionsWithManyWorkflowAgents: 2,
  maxWorkflowAgentsInSession: 90,
  xhighSharePct: 40,
  topToolsMain: [
    { name: "Bash", count: 1200 },
    { name: "Edit", count: 900 },
    { name: "Read", count: 400 },
    { name: "Grep", count: 250 },
  ],
  topToolsAgents: [
    { name: "Read", count: 2100 },
    { name: "Bash", count: 1800 },
    { name: "WebSearch", count: 900 },
    { name: "WebFetch", count: 700 },
  ],
  sessions: [
    { id: "a3f9c210", project: "my-website", startDay: "2026-08-04", durationMin: 18_000, turns: 140, requests: 2_100, requestsPerTurn: 10, maxContext: 640_000, subagents: 3, workflowAgents: 40, compactions: 3, errors: 45, agentSharePct: 20, sharePct: 22, models: "opus-5-5:1800 sonnet-5-5:300" },
    { id: "7b2e4d91", project: "data-pipeline", startDay: "2026-08-12", durationMin: 4_300, turns: 45, requests: 1_300, requestsPerTurn: 12, maxContext: 410_000, subagents: 2, workflowAgents: 90, compactions: 1, errors: 30, agentSharePct: 55, sharePct: 14, models: "opus-5-5:1100 sonnet-5-5:200" },
  ],
  findings: [
    { severity: "high", title: "Kontextgröße ist der größte Treiber", evidence: "68% des Kontextvolumens stammen aus Requests mit >200k Kontext. Ø 200k Tokens pro Request. 11 von 18 Sessions über 150k, nur 4 haben je kompaktiert.", recommendation: "Pro Aufgabe eine neue Session starten. Bei Themenwechsel /clear, bei langen Aufgaben früher /compact.", basis: "gemessen" },
    { severity: "high", title: "Workflows / Multi-Agent-Runden", evidence: "220 Workflow-Agents, 32% der gewichteten Nutzung.", recommendation: "Workflows als Ausnahme, nicht als Standard.", basis: "berechnet" },
    { severity: "medium", title: "Effort xhigh ist der Standard", evidence: "40% der gewichteten Nutzung liefen mit effort xhigh.", recommendation: "Effort high als Standard; xhigh gezielt.", basis: "berechnet" },
    { severity: "info", title: "5h-Limit erreicht", evidence: "9 Mal laut Transcript-Marker.", recommendation: "Eine Live-Prozentanzeige gibt es lokal nicht.", basis: "gemessen" },
  ],
  days: [
    "2026-08-15", "2026-08-16", "2026-08-17", "2026-08-18", "2026-08-19", "2026-08-20", "2026-08-21",
    "2026-08-22", "2026-08-23", "2026-08-24", "2026-08-25", "2026-08-26", "2026-08-27", "2026-08-28",
  ].map((day, i) => {
    const inCurrentWeek = i >= 7
    const requests = inCurrentWeek ? 180 + i * 5 : 430 - i * 10
    return {
      day,
      requests,
      avgContext: inCurrentWeek ? 340_000 : 255_000,
      turns: Math.round(requests / (inCurrentWeek ? 6 : 18)),
      weighted: requests * (inCurrentWeek ? 900_000 : 1_400_000),
    }
  }),
  trend: {
    current: { daysActive: 5, requests: 1_400, avgContext: 230_000, requestsPerTurn: 7.5, xhighPct: 35, workflowPct: 20, fiveHourHits: 3, weighted: 1.0e12 },
    previous: { daysActive: 6, requests: 2_200, avgContext: 260_000, requestsPerTurn: 11, xhighPct: 45, workflowPct: 30, fiveHourHits: 4, weighted: 1.8e12 },
  },
  skillUsage: [
    { name: "pdf", messages: 24, sessions: 4, lastDay: "2026-08-27" },
    { name: "git-commit-helper", messages: 9, sessions: 6, lastDay: "2026-08-28" },
  ],
  mcpUsage: [
    { name: "github", messages: 120, sessions: 7, lastDay: "2026-08-28" },
    { name: "postgres", messages: 45, sessions: 2, lastDay: "2026-08-21" },
  ],
}

const globalRoute: GlobalRouteWarning = {
  settingsJson: null,
  userEnv: null,
  machineEnv: null,
}

const hookStatus: HookStatus = {
  installed: false,
  scriptPath: "C:\\Users\\you\\AppData\\Local\\com.skillswitch.app\\context-hook.ps1",
  settingsPath: "C:\\Users\\you\\.claude\\settings.json",
}

// Same names and signatures as the functions in api.ts that fall back to them.
// Reads return copies, so React sees a new object after every change.

export async function listSkills(): Promise<Skill[]> {
  return structuredClone(skills)
}

export async function setSkillEnabled(name: string, enabled: boolean): Promise<void> {
  const skill = skills.find((s) => s.name === name)
  if (skill) {
    skill.enabled = enabled
    if (!enabled) skill.manualOnly = false
  }
}

export async function setSkillManualOnly(name: string, manualOnly: boolean): Promise<void> {
  const skill = skills.find((s) => s.name === name)
  if (skill) skill.manualOnly = manualOnly
}

export async function readEnv(): Promise<EnvInfo> {
  return structuredClone(env)
}

export async function readOmniroute(): Promise<OmniState> {
  return structuredClone(omniState)
}

export async function setOmnirouteConfig(baseUrl: string, apiKey?: string): Promise<void> {
  omniState.baseUrl = baseUrl
  if (apiKey) omniState.apiKeySet = true
}

export async function addOmnirouteProject(path: string): Promise<void> {
  omniState.projects.push({
    path,
    exists: true,
    active: false,
    baseUrl: null,
    hasToken: false,
    gitignoreOk: false,
    gatewayDiscovery: false,
    error: null,
  })
}

export async function removeOmnirouteProject(path: string): Promise<void> {
  omniState.projects = omniState.projects.filter((p) => p.path !== path)
}

export async function setProjectRoute(path: string, active: boolean): Promise<string | null> {
  const project = omniState.projects.find((p) => p.path === path)
  if (project) {
    project.active = active
    project.baseUrl = active ? omniState.baseUrl : null
    project.hasToken = active
    if (!active) project.gatewayDiscovery = false
  }
  return null
}

export async function setGatewayDiscovery(path: string, enabled: boolean): Promise<string | null> {
  const project = omniState.projects.find((p) => p.path === path)
  if (project) project.gatewayDiscovery = enabled
  return null
}

export async function addGitignoreEntry(path: string): Promise<void> {
  const project = omniState.projects.find((p) => p.path === path)
  if (project) project.gitignoreOk = true
}

export async function omnirouteStatus(): Promise<boolean> {
  return serviceRunning
}

export async function startOmniroute(): Promise<void> {
  serviceRunning = true
}

export async function stopOmniroute(): Promise<void> {
  serviceRunning = false
}

export async function openOmnirouteTerminal(path: string): Promise<void> {
  window.alert(`(Vorschau) Würde ein Terminal in ${path} mit OmniRoute-Routing öffnen.`)
}

export async function checkGlobalRoute(): Promise<GlobalRouteWarning> {
  return structuredClone(globalRoute)
}

export async function contextHookStatus(): Promise<HookStatus> {
  return structuredClone(hookStatus)
}

export async function installContextHook(): Promise<void> {
  hookStatus.installed = true
}

export async function uninstallContextHook(): Promise<void> {
  hookStatus.installed = false
}

export async function listProfiles(): Promise<Profile[]> {
  return structuredClone(profiles)
}

export async function saveProfile(name: string, states: Record<string, string>): Promise<Profile[]> {
  const trimmed = name.trim()
  const idx = profiles.findIndex((p) => p.name.toLowerCase() === trimmed.toLowerCase())
  const profile = { name: trimmed, skills: states }
  if (idx >= 0) profiles[idx] = profile
  else profiles.push(profile)
  return structuredClone(profiles)
}

export async function deleteProfile(name: string): Promise<Profile[]> {
  profiles = profiles.filter((p) => p.name.toLowerCase() !== name.trim().toLowerCase())
  return structuredClone(profiles)
}

export async function listLiveSessions(): Promise<LiveSession[]> {
  return structuredClone(live)
}

export async function analyzeUsage(): Promise<UsageReport> {
  return structuredClone(usage)
}

export async function testOmnirouteConnection(): Promise<ConnectionTestResult> {
  return { model: "auto/best-fast → gpt-5.5 (Vorschau)", latencyMs: 420 }
}
