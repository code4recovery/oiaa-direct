import {
  Box,
  Text,
} from "@chakra-ui/react"

export interface MeetingsSummaryProps {
  shownCount: number
  totalMeetings: number
}

export function MeetingsSummary({
  shownCount,
  totalMeetings,
}: MeetingsSummaryProps) {
  return (
    <Box
      position="sticky"
      top={0}
      zIndex={10}
      bg="white"
      _dark={{ bg: "gray.800" }}
      py={4}
      mb={4}
    >
      <Text fontSize="xl" fontWeight="bold">
        Meetings
        <Text
          as="span"
          fontSize="md"
          color="gray.500"
          _dark={{ color: "gray.400" }}
          ml={2}
          fontWeight="normal"
        >
          ({totalMeetings} total results; {shownCount} loaded.)
        </Text>
      </Text>
    </Box>
  )
}
