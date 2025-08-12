import { useState } from "react"

import { DateTime } from "luxon"
import { Outlet, useSearchParams } from "react-router"

import { Filter, MobileFilters } from "@/components/filters"
import { Layout } from "@/components/Layout"
import { MeetingsSummary } from "@/components/meetings"
import { getMeetings } from "@/getData"
import { Text, Box, useBreakpointValue } from "@chakra-ui/react"

import type { Route } from "./+types/meetings-filtered"

function buildMeetingsQueryString(searchParams: URLSearchParams): string {
  if (![...searchParams.entries()].length) {
    const params = new URLSearchParams({
      start: DateTime.now().toUTC().toISO(),
      hours: "1",
    })
    return `?${params.toString()}`
  }
  return `?${searchParams.toString()}`
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { searchParams } = new URL(request.url)
  const qs = buildMeetingsQueryString(searchParams)
  const meetings = await getMeetings(qs)
  return { meetings }
}

export default function MeetingsFiltered({ loaderData }: Route.ComponentProps) {
  const [filterParams, setFilterParams] = useSearchParams()
  // RESILIENT: Handle both array and object loaderData shapes
  const allMeetings = Array.isArray(loaderData) ? loaderData : loaderData?.meetings ?? []
  const totalMeetings = allMeetings.length
  const [currentPage, setCurrentPage] = useState(0)
  const meetingsPerPage = 25

  // Responsive: show mobile filters on mobile, sidebar on desktop
  const showMobileFilters = useBreakpointValue({ base: true, md: false })
  const showSidebar = useBreakpointValue({ base: false, md: true })

  const handleQuery = (query: string) => {
    setFilterParams((prev) => {
      prev.set("nameQuery", query)
      return prev
    })
  }

  const handleNextPage = () => {
    if ((currentPage + 1) * meetingsPerPage < allMeetings.length) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const paginatedMeetings = allMeetings.slice(
    currentPage * meetingsPerPage,
    (currentPage + 1) * meetingsPerPage
  )

  const PaginationButtons = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "16px",
        marginBottom: "16px",
      }}
    >
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 0}
        style={{
          marginRight: "8px",
          padding: "8px 16px",
          backgroundColor: "#3182ce",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: currentPage === 0 ? "not-allowed" : "pointer",
        }}
      >
        Previous
      </button>
      <button
        onClick={handleNextPage}
        disabled={(currentPage + 1) * meetingsPerPage >= allMeetings.length}
        style={{
          padding: "8px 16px",
          backgroundColor: "#3182ce",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor:
            (currentPage + 1) * meetingsPerPage >= allMeetings.length
              ? "not-allowed"
              : "pointer",
        }}
      >
        Next
      </button>
    </div>
  )

  return (
    <>
      <Layout
        sidebar={
          showSidebar ? (
            <Filter
              filterParams={filterParams}
              sendFilterSelectionsToParent={setFilterParams}
              sendQueryToParent={handleQuery}
            />
          ) : undefined
        }
      >
        {/* Mobile Filters at Top */}
        {showMobileFilters && (
          <Box mb={6}>
            <MobileFilters
              filterParams={filterParams}
              sendFilterSelectionsToParent={setFilterParams}
              totalMeetings={totalMeetings}
              shownMeetings={paginatedMeetings.length}
            />
          </Box>
        )}

        {/* Meetings Content */}
        {allMeetings.length > 0 ? (
          <>
            <PaginationButtons />
            <MeetingsSummary
              meetings={paginatedMeetings}
              totalMeetings={totalMeetings}
            />
            <PaginationButtons />
          </>
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
