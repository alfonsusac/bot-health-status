import { get_bot, get_bots } from "@/lib/bot-health-check"
import { BotHeader } from "@/lib/ui-bot-header"
import { cacheLife } from "next/cache"

export async function generateStaticParams() {
  const bots = await get_bots()
  const botids: string[] = []
  bots.bots.map(bot => { botids.push(bot.id) })
  return botids.map(botid => ({ botid: botid }))
}


export default function BotPageLayout(props: LayoutProps<"/[botid]">) {
  return <>
    <BotPageLayoutAsync {...props} />
    {props.children}
  </>
}

async function BotPageLayoutAsync(props: LayoutProps<"/[botid]">) {
  "use cache"
  cacheLife("max")
  console.log("------ <BotPageLayoutAsync /> ------")
  const param = await props.params
  const botid = param.botid
  const bot = await get_bot(botid)

  return <>
    <header className="flex flex-col gap-4">
      <BotHeader bot={bot} />
    </header >
  </>

}