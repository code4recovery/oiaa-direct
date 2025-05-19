import {
  DateTime,
  type WeekdayNumbers,
} from "luxon"

interface SelectedDayTime {
  localWeekday: WeekdayNumbers
  localHour: number
  localMinute: number
}

export function targetTimestamp({
  localWeekday,
  localHour,
  localMinute,
}: SelectedDayTime): DateTime {
  const now = DateTime.local()
  let targetDate = now.set({
    weekday: localWeekday,
    hour: localHour,
    minute: localMinute,
    second: 0,
    millisecond: 0,
  })
  if (targetDate <= now) {
    targetDate = targetDate.plus({ weeks: 1 })
  }

  return targetDate.toUTC()
}
