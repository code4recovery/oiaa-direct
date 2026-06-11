import {
  useEffect,
  useState,
} from "react"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"
import {
  Outlet,
  useSearchParams,
} from "react-router"

import { Filter } from "@/components/filters"
import { Layout } from "@/components/Layout"
import {
  MeetingList,
  MeetingsSummary,
} from "@/components/meetings"
import { getMeetings } from "@/getData"
import type { Meeting } from "@/meetingTypes"
import { shuffleWithinTimeSlots } from "@/utils/meetings-utils"
import { DEFAULT_HOURS_WINDOW } from "@/utils/filter-utils"
import {
  Box,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"

import type { Route } from "./+types/meetings-filtered"

function buildMeetingsQueryString(searchParams: URLSearchParams): string {
  const paramCount = [...searchParams.entries()].length
  
  if (!paramCount) {
    const now = DateTime.now().toUTC().toISO()
    const params = new URLSearchParams({
      start: now,
      hours: String(DEFAULT_HOURS_WINDOW),
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
const loaderCache = new Map<string, Promise<{ meetings: Meeting[] }>>()

export async function clientLoader({ request }: Route.ClientLoaderArgs): Promise<{ meetings: Meeting[] }> {
  const { searchParams } = new URL(request.url)
  const qs = buildMeetingsQueryString(searchParams)
  const cacheKey = getCacheKey(searchParams)
  
  // Check cache - if exists, return it
  const cachedEntry = loaderCache.get(cacheKey)
  if (cachedEntry) {
    return cachedEntry
  }
  
  // Create and store promise immediately (before awaiting) to prevent race conditions
  const promise = (async () => {
    const meetings = await getMeetings(qs)
    const shuffled = shuffleWithinTimeSlots(meetings)
    return { meetings: shuffled }
  })()
  
  // Store in cache IMMEDIATELY (synchronously) so concurrent calls can see it
  loaderCache.set(cacheKey, promise)
  
  // Set up cache cleanup after promise resolves
  void promise.finally(() => {
    setTimeout(() => {
      loaderCache.delete(cacheKey)
    }, 60000) // 60 seconds
  })
  
  return promise
}

export default function MeetingsFiltered({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const [filterParams, setFilterParams] = useSearchParams()
  const { meetings } = loaderData
  const totalMeetings = meetings.length
  const [visibleMeetingsCount, setVisibleMeetingsCount] = useState(25)

  const filterVariant =
    useBreakpointValue<"mobile" | "desktop">({
      base: "mobile",
      md: "desktop",
    }) ?? "mobile"

  const visibleMeetings = meetings.slice(0, visibleMeetingsCount)

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

  const handleLoadMore = () => {
    setVisibleMeetingsCount((prev) => prev + 25)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if (visibleMeetingsCount < meetings.length) {
          handleLoadMore()
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => { window.removeEventListener('scroll', handleScroll) }
  }, [visibleMeetingsCount, meetings.length])

  return (
    <>
      <Layout
        sidebar={filterVariant === "desktop" ? filterComponent : undefined}
      >
        {filterVariant === "mobile" && <Box mb={6}>{filterComponent}</Box>}

        {meetings.length > 0 ? (
          <>
            <MeetingsSummary
              shownCount={visibleMeetings.length}
              totalMeetings={totalMeetings}
            />
            <MeetingList meetings={visibleMeetings} />
          </>
        ) : (
          <Text textAlign="center" py={8} color="gray.500">
            {t("no_results")}
          </Text>
        )}
      </Layout>
      <Outlet />
    </>
  )
}

