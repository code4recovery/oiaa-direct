import { useLoaderData } from "react-router-dom"

import { useRootLoaderData } from "./root"

import type { Meeting } from "../types"

export function loader({ params }) {
  return params
}

export default function Meeting() {
  const { meetingId } = useLoaderData() as Record<string, string>
  const { meetings } = useRootLoaderData() as Record<string, Meeting[]>
  const meeting = meetings.filter((meeting) => meeting.slug === meetingId)[0]

  return (
    <>
      <h1>{meeting.name}</h1>
      <h2>{meeting.conference_url}</h2>
    </>
  )
}
