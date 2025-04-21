import type { WeekdayNumbers } from "luxon"

type Minutes = number
export interface MeetingType {
  code: string
  name: string
  description?: string
}

export const TYPE = { O: "Open", C: "Closed" } as const // 2

export const FORMATS = {
  "11": "11th Step Meditation",
  "12x12": "12 Steps & 12 Traditions",
  A: "Secular",
  ABSI: "As Bill Sees It",
  B: "Big Book",
  BE: "Newcomer",
  D: "Discussion",
  DR: "Daily Reflections",
  GR: "Grapevine",
  H: "Birthday",
  LIT: "Literature",
  LS: "Living Sober",
  MED: "Meditation",
  SP: "Speaker",
  ST: "Step Study",
  TR: "Tradition Study",
} as const // 16

export const FEATURES = {
  "AL-AN": "Concurrent with Al-Anon",
  AL: "Concurrent with Alateen",
  ASL: "American Sign Language",
  BA: "Babysitting Available",
  BRK: "Breakfast",
  CAN: "Candlelight",
  CF: "Child-Friendly",
  DB: "Digital Basket",
  FF: "Fragrance Free",
  OUT: "Outdoor",
  POA: "Proof of Attendance",
  RSL: "Russian Sign Language",
  SM: "Smoking Permitted",
  TC: "Location Temporarily Closed",
  X: "Wheelchair Access",
  XB: "Wheelchair-Accessible Bathroom",
  XT: "Cross Talk Permitted",
} as const // 17

export const COMMUNITIES = {
  M: "Men",
  W: "Women",
  DD: "Dual Diagnosis",
  LGBTQ: "LGBTQIAA+",
  BI: "Bisexual",
  G: "Gay",
  L: "Lesbian",
  T: "Transgender",
  SEN: "Seniors",
  Y: "Young People",
  POC: "People of Color",
  N: "Native American",
  NDG: "Indigenous",
  "BV-I": "Blind / Visually Impaired",
  "D-HOH": "Deaf / Hard of Hearing",
  "LO-I": "Loners / Isolationists",
  P: "Professionals",
} as const // 17

export type Community = keyof typeof COMMUNITIES
export type Feature = keyof typeof FEATURES
export type Format = keyof typeof FORMATS
export type Type = keyof typeof TYPE

export type Category = Community | Feature | Format | Type

export interface CategoryMap {
  type: Type
  formats: Format[]
  features: Feature[]
  communities: Community[]
  languages: string[] // TODO: Implement object with set of languages.
}

export interface Meeting extends CategoryMap {
  slug: string
  name: string
  timezone: string
  day: WeekdayNumbers
  timeUTC: string
  duration: Minutes
  conference_provider?: string
  conference_url?: string
  conference_url_notes?: string
  conference_phone?: string
  conference_phone_notes?: string
  group_id?: string
  notes?: string[]
  groupEmail?: string
  groupWebsite?: string
}
