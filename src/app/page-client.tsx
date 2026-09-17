"use client"

import { formatDistanceToNow } from "date-fns"


export function RelativeTime(props: {
  time: string,
}) {
  const formatted = formatDistanceToNow(props.time, {
    addSuffix: true,
    includeSeconds: true,
  })
  return <>{formatted}</>
}