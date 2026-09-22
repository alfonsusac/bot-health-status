import { get_bot, get_bots } from "@/lib/bot-health-check"
import { BotHeader } from "@/lib/ui-bot-header"
import { cacheLife } from "next/cache"

export async function generateStaticParams() {
  const bots = await get_bots()
  const botids: string[] = []
  bots.bots.map(bot => { botids.push(bot.id) })
  for (const { id } of bots.bots) {
    const bot = await get_bot(id)
    Array.from({ length: bot.total_pages }, (_, i) => {
      const page = bot.first_page_index + i
      if (page === bot.first_page_index)
        return
      botids.push(`${ id }_${ page }`)
    })
  }
  return botids.map(botid => ({ botid: botid }))
}


export default async function BotPageLayout(props: LayoutProps<"/[botid]">) {
  const [ botid, page_raw ] = (await props.params).botid.split('_')
  return <>
    <BotPageLayoutAsync botid={botid} />
    {props.children}
  </>
}

async function BotPageLayoutAsync(props: {
  botid: string
}) {
  "use cache"
  cacheLife("max")
  console.log("------ <BotPageLayoutAsync /> ------")
  const bot = await get_bot(props.botid)
  return <>
    <header className="flex flex-col gap-4">
      <BotHeader bot={bot} />
    </header >
  </>

}