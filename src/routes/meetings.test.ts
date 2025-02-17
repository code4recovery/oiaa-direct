import { expect, test } from "vitest"

import { buildFilter, getMeetings } from "../meetings-utils"

test("Retrieves an array of meetings", async () => {
  const result = await getMeetings()
  expect(result).not.toHaveLength(0)
})

test("Retrieves meetings with specific name", async () => {
  const result = await getMeetings({
    nameQuery: "It Works It Really Does 6pm Men's Open AA Meeting",
  })
  expect(result).toHaveLength(7)
})

test("Retrieves meetings with multiple meeting types", async () => {
  const checkSubset = (parentArray: string[], subsetArray: string[]) => {
    return subsetArray.every((el) => {
      return parentArray.includes(el)
    })
  }
  const testTypes = ["M", "B", "C"]

  const results = await getMeetings({ types: testTypes })
  let found = [false]
  if (results !== null) {
    found = results.map((result) => checkSubset(result.types, testTypes))
  }
  expect(found.every((el) => el)).toStrictEqual(true)
})

test("Retrieves discussion meetings in Spanish", async () => {
  const checkSubset = (parentArray: string[], subsetArray: string[]) => {
    return subsetArray.every((el) => {
      return parentArray.includes(el)
    })
  }
  const testTypes = ["D"]
  const testLangs = ["ES"]

  const results = await getMeetings({
    types: testTypes,
    languages: testLangs,
  })

  let foundTypes = [false]
  if (results !== null) {
    foundTypes = results.map((result) => checkSubset(result.types, testTypes))
  }

  let foundLangs = [false]
  if (results !== null) {
    foundLangs = results.map((result) =>
      checkSubset(result.languages, testLangs)
    )
  }

  expect(foundTypes.every((el) => el)).toStrictEqual(true)
  expect(foundLangs.every((el) => el)).toStrictEqual(true)
})

test("Filter is correctly built", () => {
  const { searchParams } = new URL(
    new Request("http://localhost:5173/?languages=EN&languages=ES&types=W").url
  )

  expect(buildFilter(searchParams)).toStrictEqual({
    languages: ["EN", "ES"],
    types: ["W"],
  })
})

test("Empty search params returns empty filter", () => {
  const { searchParams } = new URL(
    new Request("http://localhost:5173/").url
  )
  
  expect(buildFilter(searchParams)).toStrictEqual({})
})

test("Single value params are returned as arrays", () => {
  const { searchParams } = new URL(
    new Request("http://localhost:5173/?types=W").url
  )
  
  expect(buildFilter(searchParams)).toStrictEqual({
    types: ["W"]
  })
})

test("Unknown params are handled correctly", () => {
  const { searchParams } = new URL(
    new Request("http://localhost:5173/?unknown=test&types=W").url
  )
  
  expect(buildFilter(searchParams)).toStrictEqual({
    unknown: ["test"],
    types: ["W"]
  })
})

test("Multiple instances of same param are grouped", () => {
  const { searchParams } = new URL(
    new Request("http://localhost:5173/?types=W&types=X&types=Y").url
  )
  
  expect(buildFilter(searchParams)).toStrictEqual({
    types: ["W", "X", "Y"]
  })
})

