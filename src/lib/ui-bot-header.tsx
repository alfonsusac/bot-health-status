import Link from "next/link"
import { DividerInline } from "./ui-divider"
import { LucideArrowUpRight } from "./icons"
import type { BotStatus } from "./bot-health-check"

export function BotHeader(props: {
  bot: BotStatus
}) {
  const { bot } = props

  return (
    <div className="flex gap-2">
      <img className="size-12 rounded-md" width={48} height={48} src={bot.icon ?? ""} />
      <div className="flex flex-col mt-1">
        <h2 className="text-2xl font-semibold tracking-tight leading-6">{bot.display_name ?? bot.username ?? bot.tag ?? bot.id}</h2>
        <div className="flex items-center gap-x-2 gap-y-0 flex-wrap">
          <p className="text-fg/50" >{bot.tag} by {bot.author}</p>
          <DividerInline />
          <Link href={bot.support_server ?? "#"}
            className="text-fg/50 hover:text-fg/100 -m-2 p-2"
            target="_blank"
          >
            Support Server <LucideArrowUpRight className="inline mb-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}