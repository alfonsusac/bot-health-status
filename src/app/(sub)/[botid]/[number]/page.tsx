import { get_bot } from "@/lib/bot-health-check"
import { BotPageAsync, BotPageStaticSuspenseShell } from "../ui-botid-page"


export async function generateStaticParams(props: {
  params: Awaited<PageProps<'/[botid]/[number]'>[ 'params' ]>
}) {
  console.log(`------ generateStaticParams ------`)
  console.log(props)
  const bot = await get_bot(props.params.botid)
  const params: { number: string }[] = []
  Array.from({ length: bot.total_pages }, (_, i) => {
    const page = bot.first_page_index + i
    if (page === bot.first_page_index)
      return
    params.push({ number: String(page) })
  })
  return params
}

export default function BotNumberPage(props: PageProps<"/[botid]/[number]">) {
  return <BotPageStaticSuspenseShell >
    <BotPageAsync {...props} />
  </BotPageStaticSuspenseShell>
}