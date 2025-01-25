export interface MeetingType {
  code: string
  name: string
  description?: string
}

export const MEETING_TYPES: MeetingType[] = [
  { code: "O", name: "Open" },
  { code: "B", name: "Big Book" },
  { code: "D", name: "Discussion" },
  { code: "SP", name: "Speaker" },
  { code: "Y", name: "Young People" },
  { code: "LGBTQ", name: "LGBTQ" },
  { code: "BE", name: "Beginner" },
  { code: "D-HOH", name: "Deaf/Hard of Hearing" },
  // Add more as needed
]
