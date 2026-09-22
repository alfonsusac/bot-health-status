import { cn } from "cn"
import type { BotStatus } from "./bot-health-check"
import { appFormatRelative } from "./util-date-format"
import { LocaleTime, RelativeTime } from "@/app/page-client"

export function BotTimeline(props: {
  bot: BotStatus
}) {
  const { bot } = props
  return (
    <div className={cn(
      "flex flex-col py-4 bg-fg/5 rounded-sm *:grid *:grid-cols-[18rem_15rem_auto] *:px-4 *:w-fit",
      "font-mono text-sm",
      "text-nowrap overflow-auto"
    )}>
      {bot.timeline.map((mark, id) => {
        const status = mark.status
        const date = new Date(mark.time)
        return (<div
          key={id}
          className={' ' + (status.includes(' ') ? "opacity-50" : "")}
        >
          <div className="truncate">
            <LocaleTime time={mark.time} />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-green-500 size-2 rounded-full"
              style={{
                background: mark.status === "offline" ? "var(--color-zinc-700)" :
                  mark.status.includes(' ') ? "var(--color-zinc-800)" :
                    "var(--color-green-500)"
              }}
            >
            </div>
            <div className="capitalize">
              {mark.status
                .replaceAll('shard', 'watchdog shard')
                .replaceAll('instance', 'watchdog instance')
              }
            </div>
          </div>
          <div className="text-fg/25">
            <RelativeTime time={mark.time} serverDisplay={appFormatRelative(mark.time)} />
          </div>
        </div>)
      })}
    </div>
  )
}