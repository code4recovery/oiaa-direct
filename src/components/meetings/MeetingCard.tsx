import { Link as RRLink } from "react-router"

import type { Meeting } from "@/meetingTypes"
import {
  Box,
  Heading,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react"

import MeetingTime from "./MeetingTime"
import MeetingCategories from "./MeetingCategories"
import QuickActions from "./QuickActions"

// Category logic moved to MeetingCategories component

interface MeetingCardProps {
  meeting: Meeting
}

export const MeetingCard = ({ meeting }: MeetingCardProps) => {
  // Responsive time format: compact on mobile, short on desktop
  const timeFormat = useBreakpointValue({
    base: 'compact' as const,
    md: 'short' as const,
  })

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
      bg="white"
      _dark={{
        bg: "gray.800",
        borderColor: "whiteAlpha.300",
      }}
    >
      <VStack align="stretch" gap={4}>
        {/* Header */}
        <Box>
          <RRLink to={`/group-info/${meeting.slug}`}>
            <Heading
              size="md"
              color="blue.600"
              _dark={{ color: "blue.300" }}
              _hover={{ textDecoration: "underline" }}
            >
              {meeting.name}
            </Heading>
          </RRLink>
          <Box mt={2}>
            <MeetingTime
              timeUTC={meeting.timeUTC}
              timezone={meeting.timezone}
              format={timeFormat ?? 'short'}
              showLocal={timeFormat === 'short'}
              showIcons={timeFormat === 'short'}
            />
          </Box>
        </Box>

        {/* Meeting Info */}
        {meeting.notes && (
          <VStack align="stretch" gap={2}>
            {(Array.isArray(meeting.notes)
              ? meeting.notes
              : (meeting.notes as string).split("\n")
            ).map((note: string, index: number) => (
              <Text key={index} color="gray.700" _dark={{ color: "gray.300" }}>
                {note}
              </Text>
            ))}
          </VStack>
        )}

        {/* Action Buttons */}
        <Box>
          <QuickActions
            meeting={meeting}
            layout="auto"
            size={timeFormat === 'compact' ? 'sm' : 'md'}
            joinVariant="solid"
            secondaryVariant="outline"
          />
          {meeting.conference_url_notes && (
            <Text fontSize="sm" color="gray.500" mt={2}>
              {meeting.conference_url_notes}
            </Text>
          )}
        </Box>

        {/* Categories */}
        <MeetingCategories
          meeting={meeting}
          size={timeFormat === 'compact' ? 'sm' : 'md'}
          layout="limited"
          showFullNames={false}
        />
      </VStack>
    </Box>
  )
}
