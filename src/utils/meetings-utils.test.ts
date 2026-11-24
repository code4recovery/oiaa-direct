import {
  describe,
  expect,
  test,
} from "vitest"

import i18n from "@/i18n"

import {
  buildMeetingsQueryString,
  getMeetingsSummary,
  shuffleWithinTimeSlots,
  toggleArrayElement,
} from "./meetings-utils"

describe("toggleArrayElement", () => {
  test("First filter selection adds to params correctly", () => {
    const array1: string[] = []
    expect(toggleArrayElement(array1, "A")).toEqual(["A"])
  })

  test("Second selection of A should return an empty array", () => {
    const testArray: string[] = ["A"]
    expect(toggleArrayElement(testArray, "A")).toEqual([])
  })
  test("Second selection of A should return an empty array", () => {
    const testArray: string[] = ["A"]
    expect(toggleArrayElement(testArray, "A")).toEqual([])
  })

  test("Second selection of B should return just A", () => {
    expect(toggleArrayElement(["A", "B"], "B")).toEqual(["A"])
  })
})

describe("shuffleWithinTimeSlots", () => {
  const testMeetings = [
    { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" },
    { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-2" },
    { timeUTC: "2025-01-01T11:00:00Z", slug: "meeting-3" },
    { timeUTC: "2025-01-01T11:00:00Z", slug: "meeting-4" },
    { timeUTC: "2025-01-01T12:00:00Z", slug: "meeting-5" },
  ]

  test("returns empty array for empty input", () => {
    expect(shuffleWithinTimeSlots([])).toEqual([])
  })

  test("returns single meeting unchanged", () => {
    const meetings = [{ timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" }]
    expect(shuffleWithinTimeSlots(meetings)).toEqual(meetings)
  })

  test("maintains chronological order", () => {
    const result = shuffleWithinTimeSlots(testMeetings)
    for (let i = 1; i < result.length; i++) {
      expect(result[i].timeUTC >= result[i - 1].timeUTC).toBe(true)
    }
  })

  test("shuffles meetings within same time slots", () => {
    const results = new Set<string>()
    
    for (let i = 0; i < 10; i++) {
      const result = shuffleWithinTimeSlots(testMeetings)
      
      // Verify chronological order maintained
      for (let j = 1; j < result.length; j++) {
        expect(result[j].timeUTC >= result[j - 1].timeUTC).toBe(true)
      }
      
      // Track the full slug order
      const slugOrder = result.map(m => m.slug).join(",")
      results.add(slugOrder)
    }
    
    // Should get at least 2 different orderings (statistically very likely with 10 runs)
    expect(results.size).toBeGreaterThan(1)
  })

  test("contains all original meetings", () => {
    const result = shuffleWithinTimeSlots(testMeetings)
    
    const originalSlugs = testMeetings.map(m => m.slug).sort()
    const resultSlugs = result.map(m => m.slug).sort()
    expect(resultSlugs).toEqual(originalSlugs)
  })

  test("does not mutate original array", () => {
    const meetings = [...testMeetings] 
    shuffleWithinTimeSlots(meetings)
    expect(meetings).toEqual(testMeetings)
  })

  test("throws error when input is not sorted", () => {
    const unsortedMeetings = [
      { timeUTC: "2025-01-01T11:00:00Z", slug: "meeting-2" },
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" },
    ]
    
    expect(() => shuffleWithinTimeSlots(unsortedMeetings)).toThrow(
      "Array must be sorted by timeUTC"
    )
  })
})

describe("buildMeetingsQueryString", () => {
  const build = (qs: string) =>
    new URLSearchParams(buildMeetingsQueryString(new URLSearchParams(qs)))

  test("keeps the page's filters and adds the limit", () => {
    const params = build("formats=B&start=2025-01-01T10:00:00Z&hours=7")
    expect(params.get("formats")).toBe("B")
    expect(params.get("start")).toBe("2025-01-01T10:00:00Z")
    expect(params.get("hours")).toBe("7")
    expect(params.get("limit")).toBe("1000")
  })

  test("asks for the next hour when the page has no filters", () => {
    expect(build("").has("start")).toBe(true)
    expect(build("").get("hours")).toBe("1")
    expect(build("utm_source=newsletter").has("start")).toBe(true)
  })
})

describe("getMeetingsSummary", () => {
  const t = i18n.getFixedT("en")

  test("shows the total below the limit", () => {
    expect(getMeetingsSummary(t, 999, 25)).toBe("(999 total results; 25 loaded.)")
  })

  test("says it shows the first ones at the limit", () => {
    expect(getMeetingsSummary(t, 1000, 25)).toBe(
      "(Showing the first 1,000; 25 loaded. Narrow your filters to see more.)"
    )
  })
})
