import { get_bot, get_bots } from "@/lib/bot-health-check"
import { BotHeader } from "@/lib/ui-bot-header"
import { BotTimeline } from "@/lib/ui-bot-timeline"
import { formatRelative } from "@/lib/util-date-format"
import { toNonNaNNumber } from "@/lib/util-number"
import { cn } from "cn"
import Link from "next/link"
import { Suspense } from "react"

export async function generateStaticParams() {
  const bots = await get_bots()
  return bots.bots.map(bot => ({ botid: bot.id }))
}


export default function BotPage(props: PageProps<"/[botid]">) {
  return (
    <div className="flex flex-col gap-20 h-full">
      <Suspense fallback={<p className="italic">Loading bot information...</p>}>
        <BotPageAsync
          {...props}
        />
      </Suspense>
    </div>
  )
}


async function BotPageAsync(props: PageProps<"/[botid]">) {

  const param = await props.params
  const sp = await props.searchParams
  const page_sp = toNonNaNNumber(sp.page, undefined)

  const bot = await get_bot(param.botid, page_sp)

  const hasPrev = bot.page > bot.first_page_index
  const hasNext = bot.page < bot.total_pages

  const page_num = bot.page

  const endTimelineDate = bot.timeline.at(-1)
  const endTimeLabel = endTimelineDate
    ? new Date(endTimelineDate.time)
    : "unknown"

  const disabledCn = cn("opacity-25 pointer-events-none")

  return <>
    <header className="flex flex-col gap-4">
      <BotHeader bot={bot} />
      <div className="flex flex-col gap-2">
        <BotTimeline bot={bot} />
        <div className="flex items-center justify-between flex-wrap  sticky bottom-0 bg-black pb-8 pt-4">
          <div className="opacity-25 flex flex-col">
            <div>
              Showing {bot.timeline.length} out of {bot.total} results
            </div>
            <div>
              From now - {formatRelative(endTimeLabel)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`?page=${ page_num - 1 }`}
              className={cn(
                "button", !hasPrev && disabledCn
              )}>
              {'<-'}
            </Link>
            <div className="w-4 text-center">{bot.page}</div>
            <Link
              href={`?page=${ page_num + 1 }`}
              className={cn(
                "button", !hasNext && disabledCn
              )}>
              {'->'}
            </Link>
          </div>
        </div>
      </div>
    </header >
  </>
}