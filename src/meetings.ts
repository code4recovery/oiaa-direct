import { matchSorter } from "match-sorter"

import { Meeting } from "./types"

export async function getMeetings(
  query: string | null
): Promise<Meeting[] | null> {
  let meetings = await (await fetch(import.meta.env.VITE_CQ_URL)).json()
  if (!meetings) meetings = []
  if (query) {
    meetings = matchSorter(meetings, query, { keys: ["name"] })
  }
  return meetings
}
