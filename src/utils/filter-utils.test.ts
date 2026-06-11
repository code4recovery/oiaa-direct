import {
  DEFAULT_HOURS_WINDOW,
  createTimeFilterParams,
  updateTimeParams,
} from "./filter-utils"
import {
  afterEach,
  describe,
  expect,
  test,
  vi,
} from "vitest"

import { DateTime } from "luxon"

afterEach(() => {
  vi.useRealTimers()
})

// Pin time to a known Monday at 09:00 local (morning time frame)
function pinToMondayMorning() {
  const mockedTime = DateTime.fromObject(
    { year: 2025, month: 5, day: 5, hour: 9, minute: 0 },
    { zone: "America/New_York" }
  ).toJSDate()
  vi.useFakeTimers()
  vi.setSystemTime(mockedTime)
}

// Pin time to a known Monday at 22:00 local.
// night spans 21:00–03:59, crossing midnight — a fresh day pin avoids
// ambiguity about which week calculateTargetDate resolves to.
function pinToMondayNight() {
  const mockedTime = DateTime.fromObject(
    { year: 2025, month: 5, day: 5, hour: 22, minute: 0 },
    { zone: "America/New_York" }
  ).toJSDate()
  vi.useFakeTimers()
  vi.setSystemTime(mockedTime)
}

describe("createTimeFilterParams", () => {
  describe("with a known TimeFrame key", () => {
    test("returns hours as a number, not a string", () => {
      pinToMondayMorning()
      const result = createTimeFilterParams("tuesday", "morning")
      expect(typeof result.hours).toBe("number")
    })

    test("returns the correct hours for morning (7)", () => {
      pinToMondayMorning()
      const result = createTimeFilterParams("tuesday", "morning")
      expect(result.hours).toBe(7)
    })

    test("returns the correct hours for midday (2)", () => {
      pinToMondayMorning()
      const result = createTimeFilterParams("tuesday", "midday")
      expect(result.hours).toBe(2)
    })

    test("returns the correct hours for afternoon (4)", () => {
      pinToMondayMorning()
      const result = createTimeFilterParams("tuesday", "afternoon")
      expect(result.hours).toBe(4)
    })

    test("returns the correct hours for evening (4)", () => {
      pinToMondayMorning()
      const result = createTimeFilterParams("tuesday", "evening")
      expect(result.hours).toBe(4)
    })

    test("returns the correct hours for night (7)", () => {
      pinToMondayNight()
      const result = createTimeFilterParams("tuesday", "night")
      expect(result.hours).toBe(7)
    })

    test("returns a UTC ISO start string", () => {
      pinToMondayMorning()
      const result = createTimeFilterParams("tuesday", "morning")
      expect(result.start).toBeDefined()
      expect(result.start).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })
  })

  describe("with a custom timeFrame string (HH:MM)", () => {
    test("returns hours as DEFAULT_HOURS_WINDOW (number)", () => {
      pinToMondayMorning()
      const result = createTimeFilterParams("tuesday", "10:00")
      expect(result.hours).toBe(DEFAULT_HOURS_WINDOW)
      expect(typeof result.hours).toBe("number")
    })

    test("DEFAULT_HOURS_WINDOW is 1", () => {
      expect(DEFAULT_HOURS_WINDOW).toBe(1)
    })

    test("returns a UTC ISO start string", () => {
      pinToMondayMorning()
      const result = createTimeFilterParams("tuesday", "10:00")
      expect(result.start).toBeDefined()
      expect(result.start).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })
  })
})

describe("updateTimeParams — hours at URLSearchParams boundary", () => {
  test("hours is stored as a numeric string in URLSearchParams", () => {
    pinToMondayMorning()
    const params = updateTimeParams(new URLSearchParams(), "tuesday", "morning")
    expect(params.get("hours")).toBe("7")
  })

  test("hours value round-trips correctly for all time frames", () => {
    pinToMondayMorning()
    const cases: [string, string][] = [
      ["morning", "7"],
      ["midday", "2"],
      ["afternoon", "4"],
      ["evening", "4"],
      ["night", "7"],
    ]
    for (const [timeFrame, expected] of cases) {
      const params = updateTimeParams(new URLSearchParams(), "tuesday", timeFrame)
      expect(params.get("hours"), `hours for ${timeFrame}`).toBe(expected)
    }
  })

  test("hours is a valid numeric string (parseable by parseInt)", () => {
    pinToMondayMorning()
    const params = updateTimeParams(new URLSearchParams(), "tuesday", "evening")
    const hoursStr = params.get("hours")
    expect(hoursStr).not.toBeNull()
    expect(Number.isNaN(parseInt(hoursStr ?? "", 10))).toBe(false)
  })
})
