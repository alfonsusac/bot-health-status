"use client"

import { appFormatRelative } from "@/lib/util-date-format"
import { useEffect, useState } from "react"


export function RelativeTime(props: {
  time: string,
  serverDisplay?: string,
}) {

  const [ display, setDisplay ] = useState('-')
  useEffect(() => {
    const loop = () => {
      setDisplay(appFormatRelative(props.time))
    }
    const interval = setInterval(loop, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return <>{display}</>
}
