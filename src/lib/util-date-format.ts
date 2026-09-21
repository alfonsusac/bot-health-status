import { formatDistanceToNowStrict, intervalToDuration } from "date-fns"

export function appFormatRelative(date: Date | string) {
  // return formatDistanceToNowStrict(date, {
  //   addSuffix: true,
  // })

  const duration = intervalToDuration({
    start: date,
    end: new Date(),
  });

  const parts = [
    duration.hours && `${ duration.hours }h`,
    duration.minutes && `${ duration.minutes }m`,
    duration.seconds && `${ duration.seconds }s`,
  ].filter(Boolean)

  const joined_parts = parts.join(" ")

  return joined_parts ? `${ parts.join(" ") } ago` : 'just now'
  // "5m 2s ago"
}