/** ToDo: Fix error handling */
export const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }
    return (await response.json()) as T
  } catch (error) {
    console.error(error)
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

export const shuffleWithinTimeSlots = <T extends TimeSlotted>(
  items: T[]
): T[] => {

  assertSortedByTimeUTC(items)

  const timeSlotGroups = groupByTimeSlot(items)
  return timeSlotGroups.flatMap(fisherYatesShuffle)
}

/**
 * Determines if a meeting has scheduled time information
 * Type guard that narrows the meeting type to guarantee timeUTC and timezone are defined
 */
export const isScheduledMeeting = <T extends { timeUTC?: string; timezone?: string }>(
  meeting: T
): meeting is T & { timeUTC: string; timezone: string } => {
  return Boolean(meeting.timeUTC && meeting.timezone)
}

/**
 * Gets formatted time information from a meeting if it has scheduled time
 * Returns undefined for unscheduled meetings
 */
export const getTimeInfoFromMeeting = (
  meeting: { timeUTC?: string; timezone?: string; duration: number }
) => {
  if (!isScheduledMeeting(meeting)) {
    return undefined
  }

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
