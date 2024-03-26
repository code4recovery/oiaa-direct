import { WeekdayNumbers } from "luxon"

export type Group = {
  id: string
  name?: string
  notes?: string[]
  email?: string
  phone?: string
  website?: string
  venmo?: string
  paypal?: string
  square?: string
  meetings: Meeting[]
}

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

export type MeetingLink = {
  icon: "link" | "email" | "phone" | "video"
  onClick: () => void
  value: string
}
