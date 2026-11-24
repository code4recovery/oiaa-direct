/** ToDo: Fix error handling */

import type { TFunction } from "i18next"
import { DateTime } from "luxon"

import { DEFAULT_HOURS_WINDOW } from "@/utils/filter-utils"
import { logError } from "@/utils/logger"

export const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }
    return (await response.json()) as T
  } catch (error) {
    logError(error, url)
    return [] as T
  }
}

export const toggleArrayElement = <T>(array: T[], value: T): T[] => {
  const newArray = array.filter((x) => x !== value)
  return newArray.length === array.length ? [...newArray, value] : newArray
}

interface TimeSlotted {
  timeUTC: string
}

const fisherYatesShuffle = <T>(array: T[]): T[] => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}


const assertSortedByTimeUTC = <T extends TimeSlotted>(items: T[]): void => {
  for (let i = 1; i < items.length; i++) {
    if (items[i].timeUTC < items[i - 1].timeUTC) {
      throw new Error(
        "Array must be sorted by timeUTC"
      )
    }
  }
}

const groupByTimeSlot = <T extends TimeSlotted>(items: T[]): T[][] => {
  return items.reduce<T[][]>((acc, item) => {
    const lastGroup = acc.at(-1)
    
    if (lastGroup && lastGroup[0]?.timeUTC === item.timeUTC) {
      lastGroup.push(item)
    } else {
      acc.push([item])
    }
    
    return acc
  }, [])
}

export const shuffleWithinTimeSlots = <T extends Partial<TimeSlotted>>(
  items: T[]
): T[] => {
  const scheduled = items.filter((item): item is T & TimeSlotted => Boolean(item.timeUTC))
  const unscheduled = items.filter(item => !item.timeUTC)
  
  const shuffledUnscheduled = fisherYatesShuffle(unscheduled)
  
  let shuffledScheduled: T[] = []
  if (scheduled.length > 0) {
    assertSortedByTimeUTC(scheduled)
    const timeSlotGroups = groupByTimeSlot(scheduled)
    shuffledScheduled = timeSlotGroups.flatMap(fisherYatesShuffle)
  }
  
  return [...shuffledUnscheduled, ...shuffledScheduled]
}

/** Most meetings the list asks the API for. If this many come back, there may be more. */
export const MEETINGS_LIMIT = 1000

export const buildMeetingsQueryString = (searchParams: URLSearchParams): string => {
  const params = new URLSearchParams(searchParams)
  // A limit turns off the API's next-hour default when there are no filters, so send start (and hours) here.
  if (!params.has("start")) {
    params.set("start", DateTime.now().toUTC().toISO())
  }
  if (!searchParams.toString()) {
    params.set("hours", String(DEFAULT_HOURS_WINDOW))
  }
  params.set("limit", String(MEETINGS_LIMIT))
  return `?${params.toString()}`
}

export const getMeetingsSummary = (t: TFunction, total: number, shown: number): string =>
  total >= MEETINGS_LIMIT
    ? t("meetings_summary_at_limit", { limit: MEETINGS_LIMIT, shown })
    : t("meetings_summary", { total, shown })

export const isScheduledMeeting = <T extends { timeUTC?: string; timezone?: string }>(
  meeting: T
): meeting is T & { timeUTC: string; timezone: string } => {
  return Boolean(meeting.timeUTC && meeting.timezone)
}

export interface MeetingTimeInfo {
  timeUTC: string
  timezone: string
  originalTime: string
  userTime: string
  originalTimezone: string
  userTimezone: string
  duration?: number
}

export const formatMeetingTimeInfo = (
  meeting: { timeUTC: string; timezone: string; duration?: number }
): MeetingTimeInfo => {
  const date = new Date(meeting.timeUTC)
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const originalTimeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZone: meeting.timezone,
    hour12: true,
  })

  const userTimeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZone: userTimezone,
    hour12: true,
  })

  const originalTime = originalTimeFormatter.format(date)
  const userTime = userTimeFormatter.format(date)

  return {
    timeUTC: meeting.timeUTC,
    timezone: meeting.timezone,
    originalTime,
    userTime,
    originalTimezone: meeting.timezone,
    userTimezone,
    duration: meeting.duration,
  }
}
