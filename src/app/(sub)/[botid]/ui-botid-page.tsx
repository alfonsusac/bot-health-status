import { RelativeTime } from "@/app/page-client"
import { get_bot } from "@/lib/bot-health-check"
import { BotTimeline } from "@/lib/ui-bot-timeline"
import { appFormatRelative } from "@/lib/util-date-format"
import { toNonNaNNumber } from "@/lib/util-number"
import { cn } from "cn"
import { cacheLife } from "next/cache"
import Link from "next/link"
import { Suspense, type ReactNode } from "react"

export function BotPageStaticSuspenseShell(props: {
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <Suspense fallback={<p className="italic">Loading bot information...</p>}>
        {props.children}
      </Suspense>
    </div>
  )
}



export async function BotPageAsync(props: PageProps<"/[botid]"> | PageProps<"/[botid]/[number]">) {
  "use cache"
  cacheLife("max")

  console.log("------ <BotPageAsync /> ------")

  const param = await props.params
  const botid = param.botid
  const page_raw = 'number' in param ? toNonNaNNumber(param.number, undefined) : undefined
  const bot = await get_bot(botid, page_raw)

  const hasPrev = bot.page > bot.first_page_index
  const hasNext = bot.page < bot.total_pages

  const prevLink = hasPrev ? bot.page === 1 ? `/${ botid }` : `/${ botid }/${ bot.page - 1 }` : '#'
  const nextLink = hasNext ? `/${ botid }/${ bot.page + 1 }` : '#'

  const endTimelineDate = bot.timeline.at(-1)
  const endTimeLabel = endTimelineDate
    ? new Date(endTimelineDate.time)
    : "unknown"

  const disabledCn = cn("opacity-25 pointer-events-none")

  return <>
    <div className="flex flex-col gap-2">
      <BotTimeline bot={bot} />
      <div className="flex items-center justify-between flex-wrap  sticky bottom-0 bg-black pb-8 pt-4">
        <div className="opacity-25 flex flex-col">
          <div>
            Showing {bot.timeline.length} out of {bot.total} results
          </div>
          <div>
            From now - {appFormatRelative(endTimeLabel)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={prevLink}
            className={cn("button", !hasPrev && disabledCn)}>
            {'<-'}
          </Link>
          <div className="w-4 text-center">{bot.page}</div>
          <Link
            href={nextLink}
            className={cn("button", !hasNext && disabledCn)}>
            {'->'}
          </Link>
        </div>
      </div>
    </div>
    Site updated at: <RelativeTime time={new Date().toISOString()} serverDisplay={appFormatRelative(new Date().toISOString())} />
  </>
}