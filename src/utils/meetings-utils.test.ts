import {
  describe,
  expect,
  test,
} from "vitest"

import {
  shuffleMeetings,
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

describe("shuffleMeetings", () => {
  const testMeetings = [
    { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" },
    { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-2" },
    { timeUTC: "2025-01-01T11:00:00Z", slug: "meeting-3" },
    { timeUTC: "2025-01-01T11:00:00Z", slug: "meeting-4" },
    { timeUTC: "2025-01-01T12:00:00Z", slug: "meeting-5" },
  ]

  test("returns empty array for empty input", () => {
    expect(shuffleMeetings([])).toEqual([])
  })

  test("returns single meeting unchanged", () => {
    const meetings = [{ timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" }]
    expect(shuffleMeetings(meetings)).toEqual(meetings)
  })

  test("maintains chronological order", () => {
    const result = shuffleMeetings(testMeetings)
    for (let i = 1; i < result.length; i++) {
      expect(result[i].timeUTC >= result[i - 1].timeUTC).toBe(true)
    }
  })

  test("shuffles meetings within same time slots", () => {
    const results = new Set<string>()
    
    for (let i = 0; i < 10; i++) {
      const result = shuffleMeetings(testMeetings)
      
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
    const result = shuffleMeetings(testMeetings)
    
    const originalSlugs = testMeetings.map(m => m.slug).sort()
    const resultSlugs = result.map(m => m.slug).sort()
    expect(resultSlugs).toEqual(originalSlugs)
  })

  test("does not mutate original array", () => {
    const meetings = [...testMeetings] 
    shuffleMeetings(meetings)
    expect(meetings).toEqual(testMeetings)
  })

  test("throws error when input is not sorted", () => {
    const unsortedMeetings = [
      { timeUTC: "2025-01-01T11:00:00Z", slug: "meeting-2" },
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" },
    ]
    
    expect(() => shuffleMeetings(unsortedMeetings)).toThrow(
      "shuffleMeetings requires meetings to be sorted by timeUTC"
    )
  })
})
