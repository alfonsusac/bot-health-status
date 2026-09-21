import { RelativeTime } from "@/app/page-client"
import { cn } from "cn"
import type { BotStatus } from "./bot-health-check"
import { appFormatRelative } from "./util-date-format"

export function BotCurrent(props: {
  bot: BotStatus
}) {
  const { bot } = props
  return (
    <div className="flex items-center gap-2">
      <div className={cn("size-2.5 bg-red-400 rounded-full",
        bot.latest?.status === "offline" ? "bg-red-500"
          : bot.latest?.status === "online" ? "bg-green-500"
            : bot.latest?.status === "idle" ? "bg-green-500"
              : bot.latest?.status === "dnd" ? "bg-green-500"
                : bot.latest?.status === "unknown" ? "bg-fg/50" : "bg-fg/10"
      )} />
      <div>
        {bot.latest?.status === "offline" ? "Offline"
          : bot.latest?.status === "online" ? "Online"
            : bot.latest?.status === "idle" ? "Online (Idle)"
              : bot.latest?.status === "dnd" ? "Online (DnD)"
                : bot.latest?.status === "unknown" ? "Unknown" : "??"
        }
      </div>
      <div className="border-l border-l-fg/50 w-px h-5 mx-2" />
      <div>
        Last update: {bot.latest?.last_seen ? <RelativeTime time={bot.latest?.last_seen} serverDisplay={appFormatRelative(bot.latest?.last_seen)} /> : "Unknown"}
      </div>
    </div>
  )
}