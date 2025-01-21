import { useEffect, useState } from "react"

import { Outlet, useSearchParams } from "react-router"

import { MeetingsSummary } from "@/components/MeetingsSummary"
import { SearchInput } from "@/components/SearchInput"
import { buildFilter, getMeetings } from "@/meetings-utils"
import { Box, Heading, VStack } from "@chakra-ui/react"

import type { Route } from "./+types/meetings-filtered"

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { searchParams } = new URL(request.url)
  const meetings = await getMeetings(buildFilter(searchParams))
  return { meetings }
}

export default function MeetingsFiltered({ loaderData }: Route.ComponentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterParams, setFilterParams] = useSearchParams()

  useEffect(() => {
    setFilterParams({ types: ["D"] })
  }, [filterParams, setFilterParams])

  return (
    <>
      <Box
        p={4}
        borderRadius="lg"
        _dark={{
          borderColor: "whiteAlpha.200",
        }}
      >
        <VStack gap={4} align="stretch">
          <Heading size="md" color="inherit">
            Filters
          </Heading>
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </VStack>
      </Box>
      <MeetingsSummary meetings={loaderData.meetings} />
      <div>
        <Outlet />
      </div>
    </>
  )
}
