import { useState } from "react"

import { DateTime } from "luxon"
import {
  Outlet,
  useSearchParams,
} from "react-router"

import { Filter } from "@/components/filters"
import { Layout } from "@/components/Layout"
import { MeetingsSummary } from "@/components/meetings"
import { getMeetings } from "@/getData"
import type { Meeting } from "@/meetingTypes"
import { shuffleWithinTimeSlots } from "@/utils/meetings-utils"
import {
  Box,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"

import type { Route } from "./+types/meetings-filtered"

function buildMeetingsQueryString(searchParams: URLSearchParams): string {
  const hasParams = [...searchParams.entries()].length
  console.log('🔍 Has search params:', hasParams, 'Params:', [...searchParams.entries()])
  
  if (!hasParams) {
    const now = DateTime.now().toUTC().toISO()
    console.log('⏰ Generated timestamp:', now)
    const params = new URLSearchParams({
      start: now,
      hours: "1",
    })
    return `?${params.toString()}`
  }
  return `?${searchParams.toString()}`
}

// Generate cache key from search params
function getCacheKey(searchParams: URLSearchParams): string {
  const hasParams = [...searchParams.entries()].length > 0
  return !hasParams ? 'default' : searchParams.toString()
}

// Promise-based cache to deduplicate concurrent loader calls
const loaderCache = new Map<string, { promise: Promise<{ meetings: Meeting[] }>, callId: string }>()

let loaderCallCount = 0

export async function clientLoader({ request }: Route.ClientLoaderArgs): Promise<{ meetings: Meeting[] }> {
  const callId = String(++loaderCallCount)
  console.log(`🔵 #${callId} clientLoader called`, 'URL:', request.url)
  const { searchParams } = new URL(request.url)
  const qs = buildMeetingsQueryString(searchParams)
  console.log(`📝 #${callId} Query string :`, qs)
  
  const cacheKey = getCacheKey(searchParams)
  console.log(`🔑 #${callId} Cache key :`, cacheKey)
  
  // Check cache - if exists, return it
  const cachedEntry = loaderCache.get(cacheKey)
  if (cachedEntry) {
    console.log(`💾 #${callId} Using cached promise from call #${cachedEntry.callId}`)
    return cachedEntry.promise
  }
  
  // Create and store promise immediately (before awaiting) to prevent race conditions
  const promise: Promise<{ meetings: Meeting[] }> = (async () => {
    const meetings = await getMeetings(qs)
    const shuffled = shuffleWithinTimeSlots(meetings)
    const firstThree = shuffled.slice(0, 3).map(m => m.slug)
    console.log(`🟢 #${callId} returning`, shuffled.length, 'meetings (shuffled). First 3:', firstThree)
    return { meetings: shuffled }
  })()
  
  // Store in cache IMMEDIATELY (synchronously) so concurrent calls can see it
  loaderCache.set(cacheKey, { promise, callId })
  console.log(`📦 #${callId} Stored new promise in cache`)
  
  // Set up cache cleanup after promise resolves
  void promise.finally(() => {
    setTimeout(() => {
      console.log(`🗑️ #${callId} Clearing cache for key: ${cacheKey}`)
      loaderCache.delete(cacheKey)
    }, 60000) // 60 seconds
  })
  
  return promise
}

export default function MeetingsFiltered({ loaderData }: Route.ComponentProps) {
  console.log('🔴 Component render')
  const [filterParams, setFilterParams] = useSearchParams()
  const { meetings } = loaderData
  const totalMeetings = meetings.length
  const [currentPage, setCurrentPage] = useState(0)
  const meetingsPerPage = 25

  const filterVariant =
    useBreakpointValue<"mobile" | "desktop">({
      base: "mobile",
      md: "desktop",
    }) ?? "mobile"

  const paginatedMeetings = meetings.slice(
    currentPage * meetingsPerPage,
    (currentPage + 1) * meetingsPerPage
  )

  const filterComponent = (
    <Filter
      filterParams={filterParams}
      sendFilterSelectionsToParent={setFilterParams}
      variant={filterVariant}
      showSearch={true}
      showTimeFilter={true}
      showClearButton={true}
    />
  )

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
        sidebar={filterVariant === "desktop" ? filterComponent : undefined}
      >
        {filterVariant === "mobile" && <Box mb={6}>{filterComponent}</Box>}

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

