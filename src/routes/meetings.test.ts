import {
  expect,
  test,
} from "vitest"

import { getMeetings } from "@/getData"

test("Retrieves an array of meetings", async () => {
  const result = await getMeetings()
  expect(result).toHaveLength(3)
})

test("Retrieves meetings with query string parameters", async () => {
  const result = await getMeetings("?nameQuery=Test%20Meeting%202")
  expect(result).toHaveLength(3) // Mock returns all meetings
})

test("Retrieves meetings with filter parameters", async () => {
  const result = await getMeetings("?features=DB,OUT&communities=M&type=C")
  expect(result).toHaveLength(3) // Mock returns all meetings
  const testMeeting3 = result.find(m => m.name === "Test Meeting 3")
  expect(testMeeting3).toBeDefined()
  expect(testMeeting3?.features).toContain("DB")
  expect(testMeeting3?.features).toContain("OUT")
  expect(testMeeting3?.communities).toContain("M")
  expect(testMeeting3?.type).toBe("C")
})

test("Retrieves meetings with format and language parameters", async () => {
  const result = await getMeetings("?formats=D&languages=ES")
  expect(result).toHaveLength(3) // Mock returns all meetings
  const testMeeting2 = result.find(m => m.name === "Test Meeting 2")
  expect(testMeeting2).toBeDefined()
  expect(testMeeting2?.formats).toContain("D")
  expect(testMeeting2?.languages).toContain("ES")
})
