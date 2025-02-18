import { matchSorter } from "match-sorter"

import type { Community, Feature, Format, Type, CategoryMap } from "./meetingTypes"


// TODO: Figure out why I included `start` and `end`. Appears to be from the `type Meeting` in online-meeting-list, but they are not in the original data source.
// TODO: Figure out how we can can `conference_url` but not a defined `conference_provider`
// TODO: Discuss role of `tags`, `search` and `edit_url`. The fields exist in `online-meeting-list`, but not the original data source.
// TODO: Discuss alternative to `conference_*` fields
export interface Meeting extends CategoryMap {
  slug: string
  name: string
  timezone: string
  day: number
  time: string
  duration: number
  notes?: string
  conference_url?: string
  conference_url_notes?: string
  conference_phone?: string
  conference_phone_notes?: string
  website?: string
  languages: string[]
  startDateUTC: string
  adjustedUTC: string
  sortRTCDay: number
  sortRTCTime: string
  rtc: string
}

export interface FilterParams {
  nameQuery?: string
  languages?: string[]
  features?: Feature[]
  formats?: Format[]
  type?: Type
  communities?: Community[]
}

function fuzzyGlobalTextFilter<T extends object>(
  rows: T[],
  keys: string[],
  filterValue: string
) {
  const terms = filterValue.split(" ")
  if (!(typeof terms === "object")) {
    return rows
  }

  return terms.reduceRight(
    (results, term) => matchSorter(results, term, { keys }),
    rows
  ) as Meeting[]
}

// Type guard for checking if a meeting has a specific category
export function hasCategoryValue(
  meeting: Meeting,
  category: keyof CategoryMap,
  value: string
): boolean {
  const values = meeting[category] as unknown as string[]
  return values?.includes(value) ?? false
}

// Type-safe filter function
export function filteredData<K extends keyof CategoryMap>(
  data: Meeting[],
  filterValues: CategoryMap[K][number][],
  key: K
) {
  if (filterValues.length === 0) return data

  return data.filter(meeting => 
    filterValues.every(value => hasCategoryValue(meeting, key, value))
  )
}

export async function getMeetings(filter?: FilterParams): Promise<Meeting[]> {
  if (!import.meta.env.VITE_CQ_URL) throw Error("App not configured correctly")
  const url = import.meta.env.VITE_CQ_URL as string
  let meetings = ((await (await fetch(url)).json()) ?? []) as Meeting[]
  if (filter) {
    const { nameQuery, features, formats, type, communities, languages } =
      filter
    if (type) meetings = filteredData(meetings, [type], "type")
    if (formats) meetings = filteredData(meetings, formats, "formats")
    if (features) meetings = filteredData(meetings, features, "features")
    if (communities)
      meetings = filteredData(meetings, communities, "communities")
    if (languages) meetings = filteredData(meetings, languages, "languages")
    if (nameQuery)
      meetings = fuzzyGlobalTextFilter(
        meetings,
        ["name", "slug"],
        nameQuery.toString()
      )
  }
  return meetings
}

export function buildFilter(searchParams: URLSearchParams) {
  const filter: Record<string, string[]> = {}

  for (const [key] of searchParams.entries()) {
    if (!filter[key]) {
      filter[key] = searchParams.getAll(key)
    }
  }

  return filter
}

export function toggleArrayElement<T>(array: T[], value: T): T[] {
  const newArray = array.filter((x) => x !== value)
  if (newArray.length === array.length) {
    return [...newArray, value]
  }
  return newArray
}
