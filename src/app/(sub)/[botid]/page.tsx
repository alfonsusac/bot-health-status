
import { BotPageAsync, BotPageStaticSuspenseShell } from "./ui-botid-page"

export default function BotPage(props: PageProps<"/[botid]">) {
  return (
    <BotPageStaticSuspenseShell>
      <BotPageAsync {...props} />
    </BotPageStaticSuspenseShell>
  )
}
