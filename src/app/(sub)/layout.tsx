import Link from "next/link"

export default function SubPageLayout(props: LayoutProps<'/'>) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <Link href={`/`} className="button self-start">
        {'<-'} Home
      </Link>

      {props.children}
    </div>
  )
}