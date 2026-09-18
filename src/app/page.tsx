import { get_bot_list, get_bot_status } from "@/lib/bot-health-check"
import { cn } from "cn"
import { Suspense } from "react"
import { interpolate, formatCss } from 'culori'
import Link from "next/link"
import { LucideArrowUpRight } from "@/lib/icons"
import { RelativeTime } from "./page-client"



export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight">Discord Bot Health Status</h1>
        <p className="">Monitor the health and status of various Discord bots.</p>
      </header>

      <Suspense fallback={<p>Loading bot statuses...</p>}>
        <BotStatuses />
      </Suspense>
    </div>
  )
}


async function BotStatuses() {

  const status = await get_bot_status()
  const bots = await get_bot_list()


  const color = interpolate([
    '#dc2626',
    '#ea580c',
    '#d97706',
    '#d97706',
    '#ca8a04',
    '#65a30d',
    '#22c55e',
  ])

  return <div className="flex flex-col gap-18">
    {Object.entries(status.bots).map(([ botId, botStatus ]) => {
      const bot = bots.bots.find(b => b.id === botId)
      return <div key={botId} className="flex flex-col gap-4">
        <div className="flex gap-2">
          <img className="size-12 rounded-md" width={48} height={48} src={bot?.icon ?? ""} />
          <div className="flex flex-col mt-1">
            <h2 className="text-2xl font-semibold tracking-tight leading-6">{bot?.display_name ?? bot?.username ?? botId}</h2>
            <div className="flex items-center gap-2">
              <p className="text-fg/50" >{bot?.tag} by {bot?.author}</p>
              <div className="border-l border-l-fg/50 w-px h-5 mx-2" />
              <Link href={bot?.support_server ?? "#"}
                className="text-fg/50 hover:text-fg/100 -m-2 p-2"
                target="_blank"
              >
                Support Server <LucideArrowUpRight className="inline mb-1" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className={cn("size-2.5 bg-red-400 rounded-full",
              botStatus.latest?.status === "offline" ? "bg-red-500"
                : botStatus.latest?.status === "online" ? "bg-green-500"
                  : botStatus.latest?.status === "stale" ? "bg-orange-500" :
                    botStatus.latest?.status === "unknown" ? "bg-fg/50" : "bg-fg/10"
            )} />
            <div>
              {botStatus.latest?.status === "offline" ? "Offline"
                : botStatus.latest?.status === "online" ? "Online"
                  : botStatus.latest?.status === "stale" ? "Stale" :
                    botStatus.latest?.status === "unknown" ? "Unknown" : "??"
              }
            </div>
            <div className="border-l border-l-fg/50 w-px h-5 mx-2" />
            <div>
              Last seen: {botStatus.latest?.last_seen ? <RelativeTime time={new Date(botStatus.latest?.last_seen).toISOString()} /> : "Unknown"}
            </div>
          </div>
          <div className="text-fg/50">{'<-'} Now</div>
          <div className="flex flex-wrap gap-2">
            {botStatus.hourly.toReversed().map((hour, hour_id) => {
              return (
                <div key={hour_id} className="size-12 rounded-sm bg-fg/5 relative group"
                  style={{
                    background: formatCss(color(hour.uptime_pct / 100))
                  }}
                >
                  <div className={cn(
                    "absolute bottom-0 translate-y-full left-1/2 -translate-x-1/2",
                    // "bg-bg border border-fg/30 rounded-md p-1 px-2",
                    // "text-sm w-max max-w-60",
                    "transition-all duration-150",
                    "opacity-0 group-hover:opacity-100",
                    "scale-90 group-hover:scale-100",
                    "origin-top",
                    "pointer-events-none group-hover:pointer-events-auto",
                    "pt-2",
                    "z-50",
                  )}>
                    <div className={cn(
                      "bg-bg border border-fg/30 rounded-md p-1 px-2",
                      "text-sm w-max max-w-60",
                    )}>
                      <div className="">
                        {new Date(hour.hour).toLocaleString('en-US', {
                          timeStyle: "short",
                          dateStyle: "medium",
                        })}
                      </div>
                      <div className="">
                        {hour.uptime_pct}% uptime
                      </div>
                      <div className="">
                        {hour.online} online pings
                      </div>
                      <div className="">
                        {hour.offline} offline pings
                      </div>
                      <div className="">
                        {hour.total} total pings
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    })}
    Updated at: <RelativeTime time={new Date().toISOString()} />
  </div>
}