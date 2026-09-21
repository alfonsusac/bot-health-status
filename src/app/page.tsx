import { get_bots } from "@/lib/bot-health-check"
import { Suspense } from "react"
import Link from "next/link"
import { LucideArrowUpRight } from "@/lib/icons"
import { RelativeTime } from "./page-client"
import { appFormatRelative } from "@/lib/util-date-format"
import { BotHeader } from "@/lib/ui-bot-header"
import { BotCurrent } from "@/lib/ui-bot-current"
import { BotTimeline } from "@/lib/ui-bot-timeline"
import { cacheLife } from "next/cache"
// import { cacheLife } from "next/cache"



export default function Home() {

  console.log("------ <Home /> ------")

  return (
    <div className="flex flex-col gap-20 h-full">

      <header className="pt-10 flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tight">Discord Bot Health Status</h1>
        <p className="max-w-100">Monitor the health and status of various Discord bot by checking their presence.</p>
      </header>

      <Suspense fallback={<div className="grow">Loading bot statuses...</div>}>
        <BotStatuses />
      </Suspense>


    </div>
  )
}


async function BotStatuses() {
  "use cache"
  cacheLife({
    // stale: 60,
    // revalidate: 60,
    // expire: 5 * 60,
    expire: 60 * 5,
  })

  console.log("------ <BotStatuses /> ------")


  const status = await get_bots()

  return <div className="flex flex-col gap-18">

    {status.bots.map((bot) => {
      const endTimelineDate = bot.timeline.at(-1)
      const endTimeLabel = endTimelineDate
        ? new Date(endTimelineDate.time)
        : "unknown"

      return <div key={bot.id} className="flex flex-col gap-4">

        <BotHeader bot={bot} />
        <div className="flex flex-col gap-2">
          <BotCurrent bot={bot} />
          <div className="flex flex-col gap-2">
            <BotTimeline bot={bot} />
            <div className="flex items-center justify-between">
              <div className="opacity-25">
                Showing 10 Results | From now - {appFormatRelative(endTimeLabel)}
              </div>
              <Link href={`/${ bot.id }`} className="button">
                See More {'->'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    })}
    Site updated at: <RelativeTime time={new Date().toISOString()} serverDisplay={appFormatRelative(new Date().toISOString())} />
  </div>
}



async function WatchdogStatus() {
  return <>
    <div></div>

  </>
}