import { useState } from "react"

import { DateTime } from "luxon"
import { Outlet, useSearchParams } from "react-router"

import { Filter } from "@/components/Filter"
import { Layout } from "@/components/Layout"
import { MeetingsSummary } from "@/components/MeetingsSummary"
import { getMeetings } from "@/getData"
import { Text } from "@chakra-ui/react"

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
  const { meetings } = loaderData
  const totalMeetings = meetings.length
  const [currentPage, setCurrentPage] = useState(0)
  const meetingsPerPage = 25

  const handleQuery = (query: string) => {
    setFilterParams((prev) => {
      prev.set("nameQuery", query)
      return prev
    })
  }

  const handleNextPage = () => {
    if ((currentPage + 1) * meetingsPerPage < meetings.length) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const paginatedMeetings = meetings.slice(
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
        disabled={(currentPage + 1) * meetingsPerPage >= meetings.length}
        style={{
          padding: "8px 16px",
          backgroundColor: "#3182ce",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor:
            (currentPage + 1) * meetingsPerPage >= meetings.length
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
          <>
            <Filter
              filterParams={filterParams}
              sendFilterSelectionsToParent={setFilterParams}
              sendQueryToParent={handleQuery}
            />
          </>
        }
      >
        {meetings.length > 0 ? (
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
