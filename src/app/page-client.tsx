"use client"

import { LucideArrowUpRight } from "@/lib/icons"
import { appFormatRelative } from "@/lib/util-date-format"
import { format } from "date-fns"
import Link from "next/link"
import { createContext, use, useEffect, useState, type ReactNode } from "react"


export function RelativeTime(props: {
  time: string,
  serverDisplay?: string,
}) {

  const [ display, setDisplay ] = useState('-')
  useEffect(() => {
    setDisplay(appFormatRelative(props.time))
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



export function LocaleTime(props: {
  time: string,
}) {
  const date = new Date(props.time)
  const { formatSchema } = useTimeFormat()

  return <>{format(date, formatSchema)}</>
}

export function SetTimeFormat() {
  const { formatSchema, setFormatSchema, formatSchema_reset, reset } = useTimeFormat()

  useEffect(() => {
    setText(formatSchema)
  }, [ formatSchema_reset ])

  const [ text, setText ] = useState(formatSchema)
  const [ error, setError ] = useState("")

  return <section className="my-8 flex flex-col h-full">
    <label>Local Time Format | <Link href="https://date-fns.org/v4.4.0/docs/format" target="_blank">Reference <LucideArrowUpRight className="inline" /></Link></label>
    <div className="flex gap-1">
      <input
        className="input max-w-80 grow"
        value={text}
        onChange={e => {
          setError("")
          const val = e.currentTarget.value
          setText(val)
          try {
            const formatted = format(new Date(), val)
            setFormatSchema(val)
          } catch (error) {
            console.log(error)
            setError("Invalid format")
          }
        }} />
      <button className="button" onClick={reset}>
        Reset
      </button>
    </div>
    {error &&
      <p className="text-red-500">{error}</p>
    }
  </section>
}


const default_format_schema = "eee, MMM d y 'at' h:mm:ss aaa"

const TimeFormat = createContext({
  formatSchema: default_format_schema,
  formatSchema_reset: '',
  setFormatSchema: (newVal: string) => { },
  reset: () => { },
})

export function TimeFormatProvider(props: {
  children?: ReactNode
}) {
  const [ timeFormat, setTimeFormatState ] = useState(default_format_schema)
  const [ timeFormat_reset, set_timeFormat_reset ] = useState('')

  const setTimeFormat = (newVal: string) => {
    localStorage.setItem('timeFormat', newVal)
    setTimeFormatState(newVal)
  }

  const reset = () => {
    localStorage.removeItem('timeFormat')
    setTimeFormat(default_format_schema)
    set_timeFormat_reset(Math.random().toString(36))
  }

  useEffect(() => {
    const ls_timeFormat = localStorage.getItem('timeFormat')
    if (ls_timeFormat) {
      setTimeFormatState(ls_timeFormat)
      set_timeFormat_reset(Math.random().toString(36))
    }
    return () => { }
  }, [])

  return (
    <TimeFormat value={{
      formatSchema: timeFormat,
      formatSchema_reset: timeFormat_reset,
      setFormatSchema: setTimeFormat,
      reset
    }}>
      {props.children}
    </TimeFormat>
  )
}

const useTimeFormat = () => {
  return use(TimeFormat)
}