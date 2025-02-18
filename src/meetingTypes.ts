export interface MeetingType {
  code: string
  name: string
  description?: string
}

export const TYPE = { O: "Open", C: "Closed" } as const

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
} as const

export const FEATURES = {
  "AL-AN": "Concurrent with Al-Anon",
  AL: "Concurrent with Alateen",
  ASL: "American Sign Language",
  BA: "Babysitting Available",
  BRK: "Breakfast",
  CAN: "Candlelight",
  CF: "Child-Friendly",
  DB: "Deaf/Blind",
  FF: "Fragrance Free",
  OUT: "Outdoor Meeting",
  POA: "Proof of Attendance",
  RSL: "Russian Sign Language",
  SM: "Smoking Permitted",
  TC: "Temporary Closure",
  X: "Wheelchair Access",
  XB: "Wheelchair-Accessible Bathroom",
  XT: "Cross Talk Permitted",
} as const

export const COMMUNITIES = {
  M: "Men",
  W: "Women",
  DD: "Dual Diagnosis",
  LGBTQ: "LGBTQ+",
  BI: "Bisexual",
  G: "Gay",
  L: "Lesbian",
  T: "Transgender",
  SEN: "Seniors",
  Y: "Young People",
  "POC": "People of Color",
  N: "Native American",
  NDG: "Indigenous",
  "BV-I": "Blind / Visually Impaired",
  "D-HOH": "Deaf / Hard of Hearing",
  "LO-I": "Loners / Isolationists",
  P: "Professionals",
} as const

export type Community = keyof typeof COMMUNITIES
export type Feature = keyof typeof FEATURES
export type Format = keyof typeof FORMATS
export type Type = keyof typeof TYPE

export type Category = Community | Feature | Format | Type

// Category type mapping
export type CategoryMap = {
  type: Type[]
  formats: Format[]
  features: Feature[]
  communities: Community[]
  languages: string[] // Keep as string[] since languages are dynamic
}

// Category color mapping
export const CATEGORY_COLORS = {
  features: "purple",
  formats: "blue",
  languages: "green",
  communities: "orange",
  type: "cyan",
} as const
export type CategoryColor = typeof CATEGORY_COLORS[keyof typeof CATEGORY_COLORS]
