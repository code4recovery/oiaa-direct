import type { WeekdayNumbers } from "luxon"

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

type Filter = Record<string, string[]>

export async function getMeetings(
  filter?: Filter | null
): Promise<Meeting[] | null> {
  if (!import.meta.env.VITE_CQ_URL) throw Error("App not configured correctly")
  const url = import.meta.env.VITE_CQ_URL as string
  const meetings = (await (await fetch(url)).json()) as Meeting[]
  console.log("Filter: ", filter)
  // if (filter) {
  //   console.log(filter)
  //   meetings = meetings.filter((meeting) => meeting.types.includes(filter))
  // }
  return meetings
}
