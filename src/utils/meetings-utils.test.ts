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

  test("Second selection of B should return just A", () => {
    expect(toggleArrayElement(["A", "B"], "B")).toEqual(["A"])
  })
})

describe("shuffleMeetings", () => {
  test("returns empty array for empty input", () => {
    expect(shuffleMeetings([])).toEqual([])
  })

  test("returns single meeting unchanged", () => {
    const meetings = [{ timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" }]
    expect(shuffleMeetings(meetings)).toEqual(meetings)
  })

  test("maintains chronological order when all meetings have different times", () => {
    const meetings = [
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" },
      { timeUTC: "2025-01-01T11:00:00Z", slug: "meeting-2" },
      { timeUTC: "2025-01-01T12:00:00Z", slug: "meeting-3" },
    ]
    const result = shuffleMeetings(meetings)
    expect(result[0].timeUTC).toBe("2025-01-01T10:00:00Z")
    expect(result[1].timeUTC).toBe("2025-01-01T11:00:00Z")
    expect(result[2].timeUTC).toBe("2025-01-01T12:00:00Z")
  })

  test("shuffles meetings with same start time while keeping chronological order", () => {
    const meetings = [
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" },
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-2" },
      { timeUTC: "2025-01-01T11:00:00Z", slug: "meeting-3" },
    ]
    
    // Run shuffle multiple times to verify we get different orders
    const results = new Set<string>()
    for (let i = 0; i < 10; i++) {
      const result = shuffleMeetings(meetings)
      
      // All meetings should still be at their correct time slots
      expect(result[0].timeUTC).toBe("2025-01-01T10:00:00Z")
      expect(result[1].timeUTC).toBe("2025-01-01T10:00:00Z")
      expect(result[2].timeUTC).toBe("2025-01-01T11:00:00Z")
      
      // Track the order of 10:00 meetings
      const order = `${result[0].slug},${result[1].slug}`
      results.add(order)
    }
    
    // Should get at least 2 different orderings (statistically very likely with 10 runs)
    expect(results.size).toBeGreaterThan(1)
  })

  test("shuffles multiple time slots independently", () => {
    const meetings = [
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" },
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-2" },
      { timeUTC: "2025-01-01T11:00:00Z", slug: "meeting-3" },
      { timeUTC: "2025-01-01T11:00:00Z", slug: "meeting-4" },
      { timeUTC: "2025-01-01T12:00:00Z", slug: "meeting-5" },
    ]
    
    // Run shuffle multiple times to verify we get different orders
    const results = new Set<string>()
    for (let i = 0; i < 10; i++) {
      const result = shuffleMeetings(meetings)
      
      // Verify chronological order maintained
      expect(result[0].timeUTC).toBe("2025-01-01T10:00:00Z")
      expect(result[1].timeUTC).toBe("2025-01-01T10:00:00Z")
      expect(result[2].timeUTC).toBe("2025-01-01T11:00:00Z")
      expect(result[3].timeUTC).toBe("2025-01-01T11:00:00Z")
      expect(result[4].timeUTC).toBe("2025-01-01T12:00:00Z")
      
      // Track the full slug order
      const slugOrder = result.map(m => m.slug).join(",")
      results.add(slugOrder)
    }
    
    // Should get at least 2 different orderings (statistically very likely with 10 runs)
    expect(results.size).toBeGreaterThan(1)
  })

  test("does not mutate original array", () => {
    const meetings = [
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" },
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-2" },
    ]
    const original = [...meetings]
    
    shuffleMeetings(meetings)
    
    expect(meetings).toEqual(original)
  })

  test("handles three meetings at same time", () => {
    const meetings = [
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" },
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-2" },
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-3" },
    ]
    
    const result = shuffleMeetings(meetings)
    
    // All should have same time
    expect(result.every(m => m.timeUTC === "2025-01-01T10:00:00Z")).toBe(true)
    // Should contain all original slugs
    const resultSlugs = result.map(m => m.slug).sort()
    expect(resultSlugs).toEqual(["meeting-1", "meeting-2", "meeting-3"])
  })

  test("warns when input is not sorted", () => {
    const originalWarn = console.warn
    const warnings: string[] = []
    console.warn = (msg: string) => warnings.push(msg)
    
    const meetings = [
      { timeUTC: "2025-01-01T11:00:00Z", slug: "meeting-2" },
      { timeUTC: "2025-01-01T10:00:00Z", slug: "meeting-1" },
    ]
    
    shuffleMeetings(meetings)
    
    expect(warnings).toContain(
      "shuffleMeetings: initial meetings array is not sorted by timeUTC"
    )
    
    console.warn = originalWarn
  })
})
