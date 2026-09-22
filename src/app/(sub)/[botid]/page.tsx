
import { BotPageAsync, BotPageStaticSuspenseShell } from "./ui-botid-page"

export default async function BotPage(props: PageProps<"/[botid]">) {
  const [ botid, page_raw ] = (await props.params).botid.split('_')
  return (
    <BotPageStaticSuspenseShell>
      <BotPageAsync botid={botid} page_raw={page_raw} />
    </BotPageStaticSuspenseShell>
  )
}
