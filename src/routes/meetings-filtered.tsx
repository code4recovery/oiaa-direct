import { useSearchParams } from "react-router"

import { Filter } from "@/components/Filter"
import { Layout } from "@/components/Layout"
import { MeetingsSummary } from "@/components/MeetingsSummary"
import { getNextMeetings } from "@/getMeetings"
import { applyMeetingFilters, buildFilter } from "@/meetings-utils"

import type { Route } from "./+types/meetings-filtered"

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { searchParams } = new URL(request.url)
  const filter = buildFilter(searchParams)
  const unfilteredMeetings = await getNextMeetings()

  const meetings = applyMeetingFilters(unfilteredMeetings, filter)
  console.log(meetings)

  return { meetings }
}

export default function MeetingsFiltered({ loaderData }: Route.ComponentProps) {
  const [filterParams, setFilterParams] = useSearchParams()

  const handleQuery = (query: string) => {
    setFilterParams((prev) => {
      prev.set("nameQuery", query)
      return prev
    })
  }

  return (
    <>
      <Layout
        sidebar={
          <Filter
            filterParams={filterParams}
            sendFilterSelectionsToParent={setFilterParams}
            sendQueryToParent={handleQuery}
          />
        }
      >
        <MeetingsSummary meetings={loaderData.meetings} />
      </Layout>
      {/* <Outlet context={loaderData.meetings} /> */}
    </>
  )
}
