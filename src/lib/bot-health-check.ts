import { cacheLife, unstable_cache } from "next/cache"
import { notFound } from "next/navigation"

/**
 * Client-side types + usage for the honeypot-health-check HTTP API.
 *
 * These TypeScript types match the API's JSON responses and can be copied
 * into (or imported by) a client that consumes the API.
 */

// The bot's real Discord presence, as reported by the gateway — never assigned by us.
export type PresenceStatus = "online" | "idle" | "dnd" | "offline"
// PresenceStatus, plus "unknown" for when a check itself failed (bot not found, fetch error).
export type HealthStatus = PresenceStatus | "unknown"

export type HealthCheckResult = {
  status: HealthStatus
  last_seen: string | null
  latency_ms: number | null
  error: string | null
  timestamp: string
  method: "presence"
  // True when this check was reconciled from a gateway replay after a shard reconnect
  // (Discord sends no timestamps for replayed events, so the post is arrival-stamped).
  replayed?: boolean
}

export type HealthResponse = {
  ok: boolean
  uptime_s: number
}

// A single merged timeline mark: a real presence post, or a synthetic watchdog boundary.
export type MergedStatus =
  | PresenceStatus
  | "instance offline"
  | "instance online"
  | "shard offline"
  | "shard online"

export type StatusMark = {
  status: MergedStatus
  time: string
  // True when this post came from a gateway replay after a shard reconnect (arrival-stamped).
  replayed?: boolean
}

// Fields shared by both bot endpoints: profile metadata + latest + uptime + timeline.
export type BotStatus = {
  id: string
  display_name: string | null
  username: string
  tag: string
  icon: string | null
  author: string
  support_server: string
  should_ping: boolean
  error?: string
  latest: HealthCheckResult | null
  uptime_pct: number
  timeline: StatusMark[]
}

export type BotsResponse = {
  bots: Array<BotStatus>
}

export type WatchdogResponse = {
  current: "online" | "offline"
  last_seen: string | null
  offlines: Array<{
    from: string
    to: string
    // "instance" = process (re)started; "shard" = gateway reconnected after a drop.
    cause: "instance" | "shard"
  }>
  // Times the gateway shard reconnected after a drop (purely informational, not
  // reconciled with bot uptime; replayed events carry no timestamps).
  shardResumed: string[]
}

export type BotStatusResponse = BotStatus & {
  page: number
  page_size: number
  // The base page number: 1, since pages are 1-indexed → (page - 1) * page_size
  // positions the page's first item in the newest-first timeline.
  first_page_index: 1
  // Convenience: Math.ceil(total / page_size); 0 when total is 0.
  total_pages: number
  total: number
}

export type ApiError = {
  error: string
}




// export const get_bots = unstable_cache(async function () {
//   if (process.env.DATA_URL === undefined) throw new Error("DATA_URL process env is required!")
//   const res = await fetch(new URL('/bots', process.env.DATA_URL).toString())
//   const data = await res.json() as BotsResponse
//   return data
// }, [], {
//   revalidate: 60 * 10 // every 10 mins
// })

// export const get_bot = unstable_cache(async function (id: string, page?: number) {
//   if (process.env.DATA_URL === undefined) throw new Error("DATA_URL process env is required!")
//   const url = new URL(`/bot/${ id }`, process.env.DATA_URL)
//   page && url.searchParams.set('page', String(page))
//   const res = await fetch(url.toString())
//   const data = await res.json() as BotStatusResponse
//   if (data.error === "not found") notFound()
//   if (data.error) throw new Error(`API Error: ${ data.error }`)
//   return data
// })


export const get_bots = async function () {
  "use cache"

  console.log("------ await get_bots() ------")

  if (process.env.DATA_URL === undefined) throw new Error("DATA_URL process env is required!")
  const res = await fetch(new URL('/bots', process.env.DATA_URL).toString())
  const data = await res.json() as BotsResponse
  return data
}

export const get_bot = async function (id: string, page?: number) {
  "use cache"

  console.log("------ await get_bot(id, page) ------")

  if (process.env.DATA_URL === undefined) throw new Error("DATA_URL process env is required!")
  const url = new URL(`/bot/${ id }`, process.env.DATA_URL)
  page && url.searchParams.set('page', String(page))
  const res = await fetch(url.toString())
  const data = await res.json() as BotStatusResponse
  if (data.error === "not found") notFound()
  if (data.error) throw new Error(`API Error: ${ data.error }`)
  return data
}