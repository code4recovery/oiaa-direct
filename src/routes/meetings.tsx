import type { WeekdayNumbers } from "luxon"

import type { Route } from "./+types/meetings"

export interface Meeting {
  slug: string
  name: string
  timezone: string
  day: WeekdayNumbers
  time: string
  duration: number
  conference_url?: string
  conference_url_notes?: string
  conference_phone?: string
  conference_phone_notes?: string
  groupID: unknown
  languages: string[]
  adjustedUTC: string
  notes?: string | null
  rtc: string
  sortRTCDay: number
  sortRTCTime: string
  startDateUTC: string
  types: string[]
}

async function getMeetings(): Promise<Meeting[] | null> {
  console.log("Pre-fetch...")
  if (!import.meta.env.VITE_CQ_URL) throw Error("App not configured correctly")
  const url = import.meta.env.VITE_CQ_URL as string
  const meetings = (await (await fetch(url)).json()) as Meeting[]
  console.log("Fetched, supposedly...")
  return meetings
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const meetings = (await getMeetings("Men")) ?? [] // q === null ? "Men" : q)
  console.log("In Client Loader", meetings)
  return meetings
}

export default function Meetings({ loaderData }: Route.ComponentProps) {
  const meetings = loaderData as Meeting[]
  console.log(meetings)
  return (
    <div>
      <h1>Loaded. Check console for details</h1>
    </div>
  )
}
