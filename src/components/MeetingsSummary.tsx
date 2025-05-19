import { Outlet } from "react-router"

import type { Meeting } from "@/meetingTypes"
import {
  Box,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"

import { MeetingCard } from "./MeetingCard"

interface MeetingsSummaryProps {
  meetings: Meeting[]
  totalMeetings: number
}

export function MeetingsSummary({
  meetings,
  totalMeetings,
}: MeetingsSummaryProps) {
  return (
    <>
      <Box
        minH="calc(100vh - 200px)"
        minW={{ base: "100%", md: "600px" }}
        flex="1"
      >
        <VStack gap={4} align="stretch">
          <Heading size="lg">
            Meetings
            {
              <Text as="span" fontSize="md" color="gray.500" ml={2}>
                ({totalMeetings} total results; {meetings.length} shown.)
              </Text>
            }
          </Heading>
          <VStack gap={6} align="stretch">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.slug} meeting={meeting} />
            ))}
            {meetings.length === 0 && (
              <Text color="gray.500" textAlign="center" py={8}>
                No meetings found matching your criteria
              </Text>
            )}
          </VStack>
        </VStack>
      </Box>
      <Outlet />
    </>
  )
}
