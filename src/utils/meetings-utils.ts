/**
 * A failed call to Central-Query. `status` is the HTTP status, or undefined when no answer came back
 * (network error, CORS, server down).
 */
export class ApiError extends Error {
  readonly url: string
  readonly status?: number

  constructor(message: string, url: string, status?: number) {
    super(message)
    this.name = "ApiError"
    this.url = url
    this.status = status
  }
}

export const isNotFound = (error: unknown): boolean =>
  error instanceof ApiError && error.status === 404

/**
 * Fetches JSON from Central-Query. Throws an ApiError on an HTTP error, a network error or a body that
 * isn't JSON. The caller decides what the visitor sees and logs the error (a 404 for an unknown meeting
 * is an answer, not a fault, so it isn't logged).
 */
export const fetchData = async <T>(url: string): Promise<T> => {
  // The message leaves out the query string (search text, a timestamp), so Sentry groups the errors
  const path = url.split("?")[0]
  let response: Response
  try {
    response = await fetch(url)
  } catch (error) {
    throw new ApiError(`Request failed: ${String(error)} (${path})`, url)
  }
  if (!response.ok) {
    throw new ApiError(
      `Central-Query answered ${String(response.status)} ${response.statusText} (${path})`,
      url,
      response.status
    )
  }
  try {
    return (await response.json()) as T
  } catch (error) {
    throw new ApiError(`Answer is not JSON: ${String(error)} (${path})`, url, response.status)
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
