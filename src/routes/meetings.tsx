import { useEffect } from "react"

import { useLoaderData, useSearchParams } from "react-router"

import type { Meeting } from "../meetings-utils"
import { buildFilter, getMeetings } from "../meetings-utils"
import type { Route } from "./+types/meetings"

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { searchParams } = new URL(request.url)
  const meetings = (await getMeetings(buildFilter(searchParams))) ?? []
  return meetings
}

export default function Meetings() {
  const [filterParams, setFilterParams] = useSearchParams()

  useEffect(() => {
    setFilterParams({ types: ["W"] })
  }, [filterParams, setFilterParams])

  const meetings = useLoaderData<Meeting[]>()
  console.log(meetings)

  return (
    <div>
      <h1>Loaded. Check console for details</h1>
    </div>
  )
}
