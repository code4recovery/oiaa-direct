import { DateTime } from "luxon"
import {
  expect,
  test,
  vi,
} from "vitest"

import { targetTimestamp } from "./date-and-time-utils"

test("targetTimestamp with timezone", () => {
  // Create a mocked time in a specific timezone (e.g., "America/New_York")
  const mockedTime = DateTime.fromObject(
    { year: 2025, month: 5, day: 4, hour: 14, minute: 0 },
    { zone: "America/Los_Angeles" }
  ).toJSDate()

  vi.useFakeTimers()
  vi.setSystemTime(mockedTime)

  expect(
    targetTimestamp({ localWeekday: 1, localHour: 7, localMinute: 15 })
  ).toEqual(
    DateTime.fromObject(
      {
        year: 2025,
        month: 5,
        day: 5,
        hour: 14,
        minute: 15,
        second: 0,
        millisecond: 0,
      },
      { zone: "utc" }
    )
  )

  expect(
    targetTimestamp({ localWeekday: 1, localHour: 22, localMinute: 0 })
  ).toEqual(
    DateTime.fromObject(
      {
        year: 2025,
        month: 5,
        day: 6,
        hour: 5,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
      { zone: "utc" }
    )
  )

  expect(
    targetTimestamp({ localWeekday: 7, localHour: 15, localMinute: 0 })
  ).toEqual(
    DateTime.fromObject(
      {
        year: 2025,
        month: 5,
        day: 4,
        hour: 22,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
      { zone: "utc" }
    )
  )
  // Restore the real timers after the test
  vi.useRealTimers()
})
