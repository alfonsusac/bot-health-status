import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Analytics } from '@vercel/analytics/next'
import { LucideArrowUpRight } from "@/lib/icons"
import Link from "next/link"
import { SetTimeFormat, TimeFormatProvider } from "./page-client"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: [ "latin" ],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: [ "latin" ],
})

export const metadata: Metadata = {
  title: "Discord Bot Health Status",
  description: "Monitor the health and status of various Discord bot by checking their presence.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ geistSans.variable } ${ geistMono.variable } h-full antialiased`}
    >
      <body className="min-h-full p-12 flex flex-col min-h-screen">
        <div className="flex flex-col max-w-180 mx-auto grow w-full">
          <TimeFormatProvider>
            {children}
            <SetTimeFormat />
          </TimeFormatProvider>
          <section className="flex flex-col **:leading-7 *:my-3 pt-4">
            <p>
              This app works by listening to /revalidate calls from the backend of this app that listens to the presence event change of registered bots in my server. You can deploy your own bot health checker using the source code below. The bot also pings everyone whenever if one of the bot is offline or is back online again.
            </p>
            <div className="flex flex-col">
              <Link target="_blank"
                href="https://github.com/alfonsusac/bot-health-status">
                Web Source Code <LucideArrowUpRight className="inline mb-0.5" />
              </Link>
              <Link target="_blank"
                href="https://github.com/alfonsusac/honeypot-health-check">Bot
                Checker Source Code <LucideArrowUpRight className="inline mb-0.5" />
              </Link>
            </div>
            <div>
              Made by alfonsusac
            </div>
            <div className="text-sm pt-8 opacity-50 flex gap-4">
              <Link target="_blank" href="https://vercel.com/alfonsusacs-projects/bot-health-status">
                Vercel <LucideArrowUpRight className="inline mb-0.5" />
              </Link>

              <Link target="_blank" href="https://discord.gg/c8MYbXtfvG">
                Alfon's Server  <LucideArrowUpRight className="inline mb-0.5" />
              </Link>
            </div>
          </section>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
