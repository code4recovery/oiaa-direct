import { expect, test } from "vitest"

import type { Format } from "@/meetingTypes"

import { buildFilter, getMeetings } from "../meetings-utils"

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

test("Filter is correctly built", () => {
  const { searchParams } = new URL(
    new Request(
      "http://localhost:5173/?languages=EN&languages=ES&communities=W"
    ).url
  )

  expect(buildFilter(searchParams)).toStrictEqual({
    languages: ["EN", "ES"],
    communities: ["W"],
  })
})

test("Empty search params returns empty filter", () => {
  const { searchParams } = new URL(new Request("http://localhost:5173/").url)

  expect(buildFilter(searchParams)).toStrictEqual({})
})

test("Single value params are returned as arrays", () => {
  const { searchParams } = new URL(
    new Request("http://localhost:5173/?communities=W").url
  )

  expect(buildFilter(searchParams)).toStrictEqual({
    communities: ["W"],
  })
})

test("Unknown params are handled correctly", () => {
  const { searchParams } = new URL(
    new Request("http://localhost:5173/?unknown=test&communities=W").url
  )

  expect(buildFilter(searchParams)).toStrictEqual({
    unknown: ["test"],
    communities: ["W"],
  })
})

test("Multiple instances of same param are grouped", () => {
  const { searchParams } = new URL(
    new Request(
      "http://localhost:5173/?communities=W&communities=X&communities=Y"
    ).url
  )

  expect(buildFilter(searchParams)).toStrictEqual({
    communities: ["W", "X", "Y"],
  })
})
