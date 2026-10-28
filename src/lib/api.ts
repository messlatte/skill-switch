import { invoke } from "@tauri-apps/api/core"
import { open } from "@tauri-apps/plugin-shell"

export type Skill = {
  name: string
  description: string
  skillMdPath: string | null
  enabled: boolean
  /** skillOverrides[name] === "user-invocable-only". Only meaningful while enabled. */
  manualOnly: boolean
  linked: boolean
  /** "owner/repo" from ~/.agents/.skill-lock.json, if this skill is tracked there. */
  source: string | null
  sourceUrl: string | null
}

export type McpServerInfo = {
  name: string
  scope: string
}

export type PluginInfo = {
  id: string
  version: string | null
  enabled: boolean
}

export type EnvInfo = {
  mcpServers: McpServerInfo[]
  plugins: PluginInfo[]
}

export type ProjectRoute = {
  path: string
  exists: boolean
  /** env.ANTHROPIC_BASE_URL is set in the project's settings.local.json. */
  active: boolean
  baseUrl: string | null
  hasToken: boolean
  gitignoreOk: boolean
  /** Gateway model discovery is on. Only meaningful while active. */
  gatewayDiscovery: boolean
  error: string | null
}

export type OmniState = {
  baseUrl: string
  apiKeySet: boolean
  projects: ProjectRoute[]
}

export type GlobalRouteWarning = {
  settingsJson: string | null
  userEnv: string | null
  machineEnv: string | null
}

export type ConnectionTestResult = {
  model: string
  latencyMs: number
}

// --- Context-Hook (UserPromptSubmit hook that warns in the chat) -------------

export type HookStatus = {
  installed: boolean
  scriptPath: string
  settingsPath: string
}

// --- Usage (metadata-only analysis of ~/.claude/projects transcripts) ---------

export type Tokens = {
  requests: number
  input: number
  cacheWrite: number
  cacheRead: number
  output: number
}

export type Named = { name: string; tokens: Tokens; sharePct: number }
export type Bucket = { label: string; requests: number; requestsPct: number; volume: number; volumePct: number }
export type ToolCount = { name: string; count: number }

export type SessionRow = {
  id: string
  project: string
  startDay: string
  durationMin: number
  turns: number
  requests: number
  requestsPerTurn: number
  maxContext: number
  subagents: number
  workflowAgents: number
  compactions: number
  errors: number
  agentSharePct: number
  sharePct: number
  models: string
}

export type Finding = {
  severity: "high" | "medium" | "info"
  title: string
  evidence: string
  recommendation: string
  basis: "gemessen" | "berechnet" | "heuristik"
}

export type DayRow = { day: string; requests: number; avgContext: number; turns: number; weighted: number }

export type PeriodStats = {
  daysActive: number
  requests: number
  avgContext: number
  requestsPerTurn: number
  xhighPct: number
  workflowPct: number
  fiveHourHits: number
  weighted: number
}

export type Trend = { current: PeriodStats; previous: PeriodStats }

/** Skill or MCP server seen in a message. Correlation only, not cost. */
export type AttributionUsage = { name: string; messages: number; sessions: number; lastDay: string | null }

export type UsageReport = {
  files: number
  unreadableLines: number
  firstDay: string | null
  lastDay: string | null
  total: Tokens
  byKind: Named[]
  byModel: Named[]
  byEffort: Named[]
  contextBuckets: Bucket[]
  avgContext: number
  cacheReadPct: number
  largeContextVolumePct: number
  apiErrors: number
  toolErrors: number
  compactions: number
  fiveHourHits: number
  lastFiveHourReset: number | null
  mainSessions: number
  totalTurns: number
  avgRequestsPerTurn: number
  sessionsOver150k: number
  sessionsCompacted: number
  longSessions: number
  longestSessionDays: number
  longestSessionTurns: number
  workflowSharePct: number
  workflowAgents: number
  sessionsWithManyWorkflowAgents: number
  maxWorkflowAgentsInSession: number
  xhighSharePct: number
  topToolsMain: ToolCount[]
  topToolsAgents: ToolCount[]
  sessions: SessionRow[]
  findings: Finding[]
  days: DayRow[]
  trend: Trend
  skillUsage: AttributionUsage[]
  mcpUsage: AttributionUsage[]
}

// Backend structs are #[serde(rename_all = "camelCase")], so field names line up as-is.
export const isTauri = "__TAURI_INTERNALS__" in window

// In a plain browser (npm run dev without Tauri) the calls below go to sample data.
// import.meta.env.DEV is false in production builds, so the bundler drops this import
// and mock.ts never ships.
const mock = import.meta.env.DEV && !isTauri ? await import("./mock") : null

export async function listSkills(): Promise<Skill[]> {
  if (mock) return mock.listSkills()
  return invoke<Skill[]>("list_skills")
}

export async function setSkillEnabled(name: string, enabled: boolean): Promise<void> {
  if (mock) return mock.setSkillEnabled(name, enabled)
  await invoke("set_skill_enabled", { name, enabled })
}

export async function setSkillManualOnly(name: string, manualOnly: boolean): Promise<void> {
  if (mock) return mock.setSkillManualOnly(name, manualOnly)
  await invoke("set_skill_manual_only", { name, manualOnly })
}

export async function readEnv(): Promise<EnvInfo> {
  if (mock) return mock.readEnv()
  return invoke<EnvInfo>("read_env")
}

// Tauri blocks webview navigation to external sites, so links open via the shell plugin.
export async function openExternal(url: string): Promise<void> {
  if (!isTauri) {
    window.open(url, "_blank", "noopener,noreferrer")
    return
  }
  await open(url)
}

// --- OmniRoute -------------------------------------------------------------
// CLI only: Claude Desktop uses one global gateway config, not settings.json.

export async function readOmniroute(): Promise<OmniState> {
  if (mock) return mock.readOmniroute()
  return invoke<OmniState>("read_omniroute")
}

export async function setOmnirouteConfig(baseUrl: string, apiKey?: string): Promise<void> {
  if (mock) return mock.setOmnirouteConfig(baseUrl, apiKey)
  await invoke("set_omniroute_config", { baseUrl, apiKey: apiKey ?? null })
}

export async function addOmnirouteProject(path: string): Promise<void> {
  if (mock) return mock.addOmnirouteProject(path)
  await invoke("add_omniroute_project", { path })
}

export async function removeOmnirouteProject(path: string): Promise<void> {
  if (mock) return mock.removeOmnirouteProject(path)
  await invoke("remove_omniroute_project", { path })
}

/** Returns a warning string if the route was applied but something needs attention. */
export async function setProjectRoute(path: string, active: boolean): Promise<string | null> {
  if (mock) return mock.setProjectRoute(path, active)
  return invoke<string | null>("set_project_route", { path, active })
}

/** Returns a warning string if the change was applied but something needs attention. */
export async function setGatewayDiscovery(path: string, enabled: boolean): Promise<string | null> {
  if (mock) return mock.setGatewayDiscovery(path, enabled)
  return invoke<string | null>("set_gateway_discovery", { path, enabled })
}

export async function addGitignoreEntry(path: string): Promise<void> {
  if (mock) return mock.addGitignoreEntry(path)
  await invoke("add_gitignore_entry", { path })
}

export async function omnirouteStatus(): Promise<boolean> {
  if (mock) return mock.omnirouteStatus()
  return invoke<boolean>("omniroute_status")
}

export async function startOmniroute(): Promise<void> {
  if (mock) return mock.startOmniroute()
  await invoke("start_omniroute")
}

export async function stopOmniroute(): Promise<void> {
  if (mock) return mock.stopOmniroute()
  await invoke("stop_omniroute")
}

export async function openOmnirouteTerminal(path: string): Promise<void> {
  if (mock) return mock.openOmnirouteTerminal(path)
  await invoke("open_omniroute_terminal", { path })
}

export async function checkGlobalRoute(): Promise<GlobalRouteWarning> {
  if (mock) return mock.checkGlobalRoute()
  return invoke<GlobalRouteWarning>("check_global_route")
}

export async function contextHookStatus(): Promise<HookStatus> {
  if (mock) return mock.contextHookStatus()
  return invoke<HookStatus>("context_hook_status")
}

export async function installContextHook(): Promise<void> {
  if (mock) return mock.installContextHook()
  await invoke("install_context_hook")
}

export async function uninstallContextHook(): Promise<void> {
  if (mock) return mock.uninstallContextHook()
  await invoke("uninstall_context_hook")
}

// --- Profiles (named skill-state snapshots) -----------------------------------

export type Profile = {
  name: string
  /** skill folder name -> "active" | "manual" | "disabled" (see SkillState). */
  skills: Record<string, string>
}

export async function listProfiles(): Promise<Profile[]> {
  if (mock) return mock.listProfiles()
  return invoke<Profile[]>("list_profiles")
}

/** Adds the profile or overwrites one with the same name (case-insensitive). Returns the new list. */
export async function saveProfile(name: string, skills: Record<string, string>): Promise<Profile[]> {
  if (mock) return mock.saveProfile(name, skills)
  return invoke<Profile[]>("save_profile", { name, skills })
}

export async function deleteProfile(name: string): Promise<Profile[]> {
  if (mock) return mock.deleteProfile(name)
  return invoke<Profile[]>("delete_profile", { name })
}

// --- Live (sessions currently writing transcripts) ---------------------------

export type Advice = {
  level: "high" | "medium" | "ok" | "info"
  text: string
  command: string | null
}

export type LiveSession = {
  id: string
  title: string | null
  project: string
  cwd: string | null
  entrypoint: string
  active: boolean
  secondsSinceActivity: number
  ageSecs: number
  turns: number
  requests: number
  turnRequests: number
  turnErrors: number
  compactions: number
  model: string | null
  effort: string | null
  context: number
  limitResetInSecs: number | null
  agentsActive: number
  advice: Advice[]
}

/** Cheap to poll: the backend keeps a per-file cursor and only reads appended bytes. */
export async function listLiveSessions(): Promise<LiveSession[]> {
  if (mock) return mock.listLiveSessions()
  return invoke<LiveSession[]>("list_live_sessions")
}

/** Reads metadata from all transcripts in ~/.claude/projects. Slow (hundreds of MB),
 *  so callers cache the result. */
export async function analyzeUsage(): Promise<UsageReport> {
  if (mock) return mock.analyzeUsage()
  return invoke<UsageReport>("analyze_usage")
}

/** Sends one small request through the configured route and reports which model answered. */
export async function testOmnirouteConnection(): Promise<ConnectionTestResult> {
  if (mock) return mock.testOmnirouteConnection()
  return invoke<ConnectionTestResult>("test_omniroute_connection")
}
