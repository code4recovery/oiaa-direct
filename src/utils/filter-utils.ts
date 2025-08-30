import type { WeekdayNumbers } from "luxon"
import { DateTime } from "luxon"

export const TIME_FRAMES = {
  morning: { start: "04:00", end: "10:59", hours: 7 },
  midday: { start: "11:00", end: "12:59", hours: 2 },
  afternoon: { start: "13:00", end: "16:59", hours: 4 },
  evening: { start: "17:00", end: "20:59", hours: 4 },
  night: { start: "21:00", end: "03:59", hours: 7 },
} as const

export type TimeFrame = keyof typeof TIME_FRAMES

export const WEEKDAY_MAP: Record<string, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
}


export function getCurrentTimeFrame(): TimeFrame {
  const currentHour = DateTime.local().hour
  
  if (currentHour >= 4 && currentHour < 11) return "morning"
  if (currentHour >= 11 && currentHour < 13) return "midday"
  if (currentHour >= 13 && currentHour < 17) return "afternoon"
  if (currentHour >= 17 && currentHour < 21) return "evening"
  return "night"
}

export function getCurrentDay(): string {
  return DateTime.local().toFormat("cccc").toLowerCase()
}


export function calculateTargetDate(day: string, timeFrame: string): DateTime {
  const targetWeekday = WEEKDAY_MAP[day.toLowerCase()]
  const now = DateTime.local()

  let selectedHour = 0
  let selectedMinute = 0

  if (timeFrame in TIME_FRAMES) {
    const { start } = TIME_FRAMES[timeFrame as TimeFrame]
    selectedHour = parseInt(start.split(":")[0], 10)
    selectedMinute = parseInt(start.split(":")[1], 10)
  } else {

    const [hour, minute] = timeFrame.split(":").map(Number)
    selectedHour = hour
    selectedMinute = minute
  }

  let targetDate = now.set({
    weekday: targetWeekday as WeekdayNumbers,
    hour: selectedHour,
    minute: selectedMinute,
    second: 0,
    millisecond: 0,
  })

  if (
    now.weekday === targetWeekday &&
    (now.hour > selectedHour || (now.hour === selectedHour && now.minute >= selectedMinute))
  ) {
    targetDate = targetDate.plus({ weeks: 1 })
  } else if (now.weekday > targetWeekday) {
    targetDate = targetDate.plus({ weeks: 1 })
  }

  return targetDate
}

export function createTimeFilterParams(day: string, timeFrame: string): { start?: string; hours: string } {
  const targetDate = calculateTargetDate(day, timeFrame)
  
  if (timeFrame in TIME_FRAMES) {
    const { hours } = TIME_FRAMES[timeFrame as TimeFrame]
    const utcStart = targetDate.toUTC().toISO()
    return {
      start: utcStart ?? undefined,
      hours: hours.toString(),
    }
  } else {

    const utcStart = targetDate.toUTC().toISO()
    return {
      start: utcStart ?? undefined,
      hours: "1",
    }
  }
}


export function updateQueryParams(
  params: URLSearchParams,
  query: string
): URLSearchParams {
  const next = new URLSearchParams(params)
  
  if (query.length > 2) {
    next.set("nameQuery", query)
  } else if (query.length === 0) {
    next.delete("nameQuery")
  }
  
  return next
}

export function updateTimeParams(
  params: URLSearchParams,
  day: string,
  timeFrame: string
): URLSearchParams {
  const next = new URLSearchParams(params)
  const timeParams = createTimeFilterParams(day, timeFrame)
  
  if (timeParams.start) {
    next.set("start", timeParams.start)
  }
  next.set("hours", timeParams.hours)
  
  return next
}
