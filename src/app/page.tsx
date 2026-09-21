import { get_bots } from "@/lib/bot-health-check"
import { Suspense } from "react"
import Link from "next/link"
import { LucideArrowUpRight } from "@/lib/icons"
import { RelativeTime } from "./page-client"
import { formatRelative } from "@/lib/util-date-format"
import { BotHeader } from "@/lib/ui-bot-header"
import { BotCurrent } from "@/lib/ui-bot-current"
import { BotTimeline } from "@/lib/ui-bot-timeline"



export default function Home() {
  return (
    <div className="flex flex-col gap-20 h-full">

      <header className="pt-10 flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tight">Discord Bot Health Status</h1>
        <p className="max-w-100">Monitor the health and status of various Discord bot by checking their presence.</p>
      </header>




      <Suspense fallback={<div className="grow">Loading bot statuses...</div>}>
        <BotStatuses />
      </Suspense>

      <section className="flex flex-col **:leading-7 *:my-3">
        <p>
          This site works by checking the presence of the registered bots every 60 seconds. It is then aggregate to hourly buckets which is shown avove. You can deploy your own bot health checker using the source code below. The bot also pings everyone whenever if one of the bot is offline or is back online again.
        </p>
        <div className="flex flex-col">
          <Link
            href="https://github.com/alfonsusac/bot-health-status">
            Web Source Code <LucideArrowUpRight className="inline mb-0.5" />
          </Link>
          <Link
            href="https://github.com/alfonsusac/honeypot-health-check">Bot
            Checker Source Code <LucideArrowUpRight className="inline mb-0.5" />
          </Link>
        </div>
        <div>
          Made by alfonsusac
        </div>
        <div className="text-sm pt-8 opacity-50 flex gap-4">
          <Link href="https://vercel.com/alfonsusacs-projects/bot-health-status">
            Vercel <LucideArrowUpRight className="inline mb-0.5" />
          </Link>

          <Link href="https://discord.gg/c8MYbXtfvG">
            Alfon's Server  <LucideArrowUpRight className="inline mb-0.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}


async function BotStatuses() {

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
                Showing 10 Results | From now - {formatRelative(endTimeLabel)}
              </div>
              <Link href={`/${ bot.id }`} className="button">
                See More {'->'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    })}
    Site updated at: <RelativeTime time={new Date().toISOString()} />
  </div>
}



async function WatchdogStatus() {
  return <>
    <div></div>

  </>
}