export interface Meeting {
  slug: string
  name: string
  startDateUTC: string
  conference_url?: string
  conference_url_notes?: string
  types: string[]
  languages: string[]
  notes?: string | null
  timezone: string
  day: number
  time: string
}

export interface MeetingCardProps {
  meeting: Meeting
}
