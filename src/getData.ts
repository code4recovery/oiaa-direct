import type {
  Meeting,
  RelatedGroupInfo,
} from "./meetingTypes"
import { fetchData } from "./utils/meetings-utils"

/**
 * Fetches meetings from a given URL and applies filters if provided.
 * @param urlAddendum - The URL path to fetch meetings from.
 * @param filter - Optional filter parameters to apply to the fetched meetings.
 * @returns A promise that resolves to an array of filtered meetings.
 */
export const createFetcher =
  <T>() =>
  async (urlAddendum = "") => {
    if (!import.meta.env.VITE_CQ_URL)
      throw new Error("App not configured correctly")
    const url = import.meta.env.VITE_CQ_URL as string
    const meetings = await fetchData<T>(`${url}/${urlAddendum}`)

    return meetings
  }

export const getMeetings = createFetcher<Meeting[]>()
export const getMeeting = createFetcher<Meeting>()
export const getRelatedDetails = createFetcher<RelatedGroupInfo>()
