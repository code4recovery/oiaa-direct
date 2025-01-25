import type { WeekdayNumbers } from "luxon"
import { matchSorter } from "match-sorter"

export interface Meeting {
  slug: string
  name: string
  timezone: string
  day: WeekdayNumbers
  time: string
  duration: number
  conference_url?: string
  conference_url_notes?: string
  conference_phone?: string
  conference_phone_notes?: string
  groupID: unknown
  languages: string[]
  adjustedUTC: string
  notes?: string | null
  rtc: string
  sortRTCDay: number
  sortRTCTime: string
  startDateUTC: string
  types: string[]
}

export interface FilterParams {
  nameQuery?: string
  types?: string[]
  languages?: string[]
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
  key: string
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
    const { nameQuery, types, languages } = filter
    if (types) meetings = filteredData(meetings, types, "types")
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
  let filter = {}
  if (searchParams.has("nameQuery"))
    filter = { ...filter, nameQuery: searchParams.getAll("nameQuery") }
  if (searchParams.has("languages"))
    filter = { ...filter, languages: searchParams.getAll("languages") }
  if (searchParams.has("types"))
    filter = { ...filter, types: searchParams.getAll("types") }
  return filter
}

export function toggleArrayElement<T>(array: T[], value: T): T[] {
  const newArray = array.filter((x) => x !== value)
  if (newArray.length === array.length) {
    return [...newArray, value]
  }
  return newArray
}
