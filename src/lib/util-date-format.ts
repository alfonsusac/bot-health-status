import { formatDistanceToNow } from "date-fns"

export function formatRelative(date: Date | string) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    includeSeconds: true,
  })
}