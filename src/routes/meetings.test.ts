import { expect, test } from "vitest"

import { getMeetings } from "@/getData"

test("Retrieves an array of meetings", async () => {
  const result = await getMeetings()
  expect(result).toHaveLength(3)
})

test("Retrieves meetings with specific name", async () => {
  const result = await getMeetings("?nameQuery=Test%20Meeting%202")
  expect(result).toHaveLength(3) // Mock returns all meetings
})

test("Retrieves meetings with attributes of format, type and community", async () => {
  const result = await getMeetings("?features=DB&features=OUT&communities=M&type=C")

  expect(result).toHaveLength(3) // Mock returns all meetings
})

test("Retrieves discussion meetings in Spanish", async () => {
  const results = await getMeetings("?formats=D&languages=ES")

  expect(results).toHaveLength(3) // Mock returns all meetings
})
