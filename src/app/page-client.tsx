"use client"

import { formatRelative } from "@/lib/util-date-format"
import { formatDistanceToNow } from "date-fns"


export function RelativeTime(props: {
  time: string,
}) {
  const formatted = formatRelative(props.time)
  return <>{formatted}</>
}
