import { matchSorter } from "match-sorter"

import type { Community, Feature, Format, Meeting, Type } from "./meetingTypes"

// TODO This can extend CategoryMap?
export interface FilterParams {
  nameQuery?: string
  languages?: string[]
  features?: Feature[]
  formats?: Format[]
  type?: Type
  communities?: Community[]
}

export const fuzzyGlobalTextFilter = <T>(
  rows: T[],
  keys: string[],
  filterValue: string | string[]
): T[] => {
  if (!filterValue) {
    return rows
  }

  const filterValueStr = Array.isArray(filterValue)
    ? filterValue.join(" ")
    : filterValue
  const terms = filterValueStr.split(" ")

  return terms.reduceRight(
    (results, term) => matchSorter(results, term, { keys }),
    rows
  )
}

export const filteredData = <T extends object>(
  data: T[],
  filterValues: string[],
  key: "type" | "formats" | "features" | "communities" | "languages"
): T[] => {
  if (filterValues.length === 0) return data

  return filterValues.reduceRight(
    (results, filterValue) =>
      matchSorter(results, filterValue, {
        keys: [{ threshold: matchSorter.rankings.EQUAL, key }],
      }),
    data
  )
}

export const fetchData = async <T>(url: string): Promise<T[]> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }
    return (await response.json()) as T[]
  } catch (error) {
    console.error(error)
    return []
  }
}

export const buildFilter = (
  searchParams: URLSearchParams
): Record<string, string[]> => {
  const filter: Record<string, string[]> = {}

  for (const [key] of searchParams.entries()) {
    filter[key] = searchParams.getAll(key)
  }
  return filter
}

export const toggleArrayElement = <T>(array: T[], value: T): T[] => {
  const newArray = array.filter((x) => x !== value)
  return newArray.length === array.length ? [...newArray, value] : newArray
}

/**
 * Applies filters to a list of meetings based on the provided filter parameters.
 * @param meetings - The list of meetings to filter.
 * @param filter - The filter parameters to apply.
 * @returns The filtered list of meetings.
 */
export const applyMeetingFilters = (
  meetings: Meeting[],
  filter: FilterParams
): Meeting[] => {
  const { nameQuery, features, formats, type, communities, languages } = filter
  const applyFilters = [
    type ? (data: Meeting[]) => filteredData(data, [type], "type") : undefined,
    formats
      ? (data: Meeting[]) => filteredData(data, formats, "formats")
      : undefined,
    features
      ? (data: Meeting[]) => filteredData(data, features, "features")
      : undefined,
    communities
      ? (data: Meeting[]) => filteredData(data, communities, "communities")
      : undefined,
    languages
      ? (data: Meeting[]) => filteredData(data, languages, "languages")
      : undefined,
    nameQuery
      ? (data: Meeting[]) =>
          fuzzyGlobalTextFilter(data, ["name", "slug"], nameQuery)
      : undefined,
  ].filter(Boolean) as ((data: Meeting[]) => Meeting[])[]

  return applyFilters.reduce((data, filterFn) => filterFn(data), meetings)
}
