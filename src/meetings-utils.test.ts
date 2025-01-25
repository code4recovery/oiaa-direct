import { expect, test } from "vitest"

import { toggleArrayElement } from "./meetings-utils"

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
