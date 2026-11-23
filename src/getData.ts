import type {
  Meeting,
  RelatedGroupInfo,
} from "./meetingTypes"
import { fetchData } from "./utils/meetings-utils"

/**
 * The Central-Query address.
 * In WordPress, the plugin's "API URL" setting arrives at runtime as window.OIAA_CONFIG.apiUrl and is the
 * only source. If it is empty, this returns undefined: no fallback to the URL baked into the build.
 * Outside WordPress (standalone build, dev) VITE_CQ_URL is used.
 * (Vite replaces import.meta.env.* with fixed text at build time, so it can't be overridden at runtime.)
 */
export function getApiUrl(): string | undefined {
  const url =
    typeof window !== "undefined" && window.OIAA_CONFIG
      ? window.OIAA_CONFIG.apiUrl?.trim()
      : (import.meta.env.VITE_CQ_URL as string | undefined)
  if (!url) return undefined
  return url
}

/**
 * Fetches meetings from a given URL and applies filters if provided.
 * @param urlAddendum - The URL path to fetch meetings from.
 * @param filter - Optional filter parameters to apply to the fetched meetings.
 * @returns A promise that resolves to an array of filtered meetings.
 */
export const createFetcher =
  <T>() =>
  async (urlAddendum = "") => {
    const url = getApiUrl()
    if (!url) throw new Error("App not configured correctly")
    const meetings = await fetchData<T>(`${url}/${urlAddendum}`)

    return meetings
  }

export const getMeetings = createFetcher<Meeting[]>()
export const getMeeting = createFetcher<Meeting>()
export const getRelatedDetails = createFetcher<RelatedGroupInfo>()
