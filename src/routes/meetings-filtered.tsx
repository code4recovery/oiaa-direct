import {
  Outlet,
  useSearchParams,
} from "react-router"

import { Filter } from "@/components/Filter"
import FullSearch from "@/components/FullSearch"
import { Layout } from "@/components/Layout"
import { MeetingsSummary } from "@/components/MeetingsSummary"
import { getMeetings } from "@/getData"
import {
  applyMeetingFilters,
  buildFilter,
} from "@/utils/meetings-utils"
import { Text } from "@chakra-ui/react"

import type { Route } from "./+types/meetings-filtered"

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { searchParams } = new URL(request.url)
  const qs = `?${searchParams.toString()}`
  const filter = buildFilter(searchParams)
  const unfilteredMeetings = await getMeetings(qs)

  const meetings = applyMeetingFilters(unfilteredMeetings, filter)
  console.log(meetings)

  return { meetings }
}

export default function MeetingsFiltered({ loaderData }: Route.ComponentProps) {
  const [filterParams, setFilterParams] = useSearchParams()
  const { meetings } = loaderData

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
          <>
            {meetings.length === 0 && (
              <FullSearch
                filterParams={filterParams}
                sendFilterSelectionsToParent={setFilterParams}
              />
            )}
            <Filter
              filterParams={filterParams}
              sendFilterSelectionsToParent={setFilterParams}
              sendQueryToParent={handleQuery}
            />
          </>
        }
      >
        {meetings.length > 0 ? (
          <MeetingsSummary meetings={meetings} />
        ) : (
          <Text textAlign="center" py={8} color="gray.500">
            No meetings found matching your criteria.
          </Text>
        )}
      </Layout>
      <Outlet />
    </>
  )
}
