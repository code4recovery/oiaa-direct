import type { FilterParams } from "./meetings-utils"
import {
  fetchMeetings,
  filteredData,
  fuzzyGlobalTextFilter,
} from "./meetings-utils"
import type { Meeting } from "./meetingTypes"

export const getMeetings = async (
  filter?: FilterParams
): Promise<Meeting[]> => {
  if (!import.meta.env.VITE_CQ_URL)
    throw new Error("App not configured correctly")
  const url = import.meta.env.VITE_CQ_URL as string
  let meetings = await fetchMeetings(url)

  if (filter) {
    const { nameQuery, features, formats, type, communities, languages } =
      filter
    const applyFilters = [
      type
        ? (data: Meeting[]) => filteredData(data, [type], "type")
        : undefined,
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

    meetings = applyFilters.reduce((data, filterFn) => filterFn(data), meetings)
  }

  return meetings
}
