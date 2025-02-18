import type { Meeting } from "@/meetings-utils"
import {
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"

import { MeetingCard } from "@/components/meeting/MeetingCard"

interface MeetingsSummaryProps {
  meetings: Meeting[]
}

export function MeetingsSummary({ meetings }: MeetingsSummaryProps) {
  return (
    <VStack gap={4} align="stretch">
      <Heading size="lg">
        Meetings
        <Text as="span" fontSize="md" color="gray.500" ml={2}>
          ({meetings.length} results)
        </Text>
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
  )
}
