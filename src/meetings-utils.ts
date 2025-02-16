import type { WeekdayNumbers } from "luxon"
import { matchSorter } from "match-sorter"

import type { Community, Feature, Format, Type } from "./meetingTypes"

type Minutes = number

// TODO: Figure out why I included `start` and `end`. Appears to be from the `type Meeting` in online-meeting-list, but they are not in the original data source.
// TODO: Figure out how we can can `conference_url` but not a defined `conference_provider`
// TODO: Discuss role of `tags`, `search` and `edit_url`. The fields exist in `online-meeting-list`, but not the original data source.
// TODO: Discuss alternative to `conference_*` fields
export interface Meeting {
  slug: string
  name: string
  timezone: string
  day: WeekdayNumbers
  time: string
  duration: Minutes
  languages: string[]
  features: Feature[]
  formats: Format[]
  communities: Community[]
  type?: Type
  conference_provider?: string
  conference_url?: string
  conference_url_notes?: string
  conference_phone?: string
  conference_phone_notes?: string
  group_id?: string
  notes?: string[]
  // tags: string[]
  // search: string
  // edit_url?: string
  // start?: DateTime
  // end?: DateTime
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

function filteredData<T extends object>(
  data: T[],
  filterValues: string[],
  key: "type" | "formats" | "features" | "communities" | "languages"
) {
  if (filterValues.length === 0) return data

  return filterValues.reduceRight(
    (results, filterValue) =>
      matchSorter(results, filterValue, {
        keys: [{ threshold: matchSorter.rankings.EQUAL, key }],
      }),
    data
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
