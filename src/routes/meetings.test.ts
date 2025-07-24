import { expect, test } from "vitest"

import { getMeetings } from "@/getData"
import type { Format } from "@/meetingTypes"

test("Retrieves an array of meetings", async () => {
  const result = await getMeetings()
  expect(result).toHaveLength(3)
})

test("Retrieves meetings with specific name", async () => {
  const result = await getMeetings({
    nameQuery: "Test Meeting 2",
  })
  expect(result).toHaveLength(1)
})

test("Retrieves meetings with attributes of format, type and community", async () => {
  const result = await getMeetings({
    features: ["DB", "OUT"],
    communities: ["M"],
    type: "C",
  })

  expect(result).toHaveLength(1)
  expect(result[0].name).toBe("Test Meeting 3")
})

test("Retrieves discussion meetings in Spanish", async () => {
  const testFormats: Format[] = ["D"]
  const testLangs = ["ES"]

  const results = await getMeetings({
    formats: testFormats,
    languages: testLangs,
  })

  expect(results).toHaveLength(1)
  expect(results[0].name).toBe("Test Meeting 2")
})
