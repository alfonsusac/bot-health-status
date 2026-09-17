export type HealthStatus = "online" | "offline" | "stale" | "unknown"

export type HealthCheckResult = {
  status: HealthStatus
  last_seen: string | null
  latency_ms: number | null
  error: string | null
  timestamp: string
  method: "presence"
}

export type HourlyBucket = {
  hour: string
  total: number
  online: number
  offline: number
  unknown: number
  uptime_pct: number
  had_offline: boolean
}

export type HealthResponse = {
  ok: boolean
  uptime_s: number
}

export type BotsResponse = {
  bots: Array<{
    id: string
    display_name: string | null
    username: string
    tag: string
    icon: string | null
    author: string
    support_server: string
    error?: string
  }>
};

export type AllBotsStatusResponse = {
  days: number
  bots: Record<string, {
    latest: HealthCheckResult | null
    hourly: HourlyBucket[]
  }>
}

export type BotStatusResponse = {
  bot_id: string
  days: number
  latest: HealthCheckResult | null
  count: number
  hourly: HourlyBucket[]
}

export type StatusPageResponse = {
  bot_id: string
  page: number
  date: string
  count: number
  results: HealthCheckResult[]
}

export type ApiError = {
  error: string
}



export async function get_bot_status() {
  if (process.env.DATA_URL === undefined) throw new Error("DATA_URL procee env is required!") 
  const res = await fetch(new URL('/status', process.env.DATA_URL).toString())
  const data = await res.json() as AllBotsStatusResponse
  return data
}

export async function get_bot_list() {
  const res = await fetch(new URL('/bots', process.env.DATA_URL).toString())
  const data = await res.json() as BotsResponse
  return data
}