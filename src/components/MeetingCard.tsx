import { FaExternalLinkAlt } from "react-icons/fa"

import { Tooltip } from "@/components/ui/tooltip"
import type { Meeting } from "@/meetings-utils"
import { TYPE, FORMATS, FEATURES, COMMUNITIES } from "@/meetingTypes"
import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react"

const DESCRIPTIONS: Record<string, string> = {
  ...TYPE,
  ...FORMATS,
  ...FEATURES,
  ...COMMUNITIES,
}

interface CategoryColors {
  features: string
  formats: string
  languages: string
  communities: string
  type: string
}

const CATEGORY_COLORS: CategoryColors = {
  features: "purple",
  formats: "blue",
  languages: "green",
  communities: "orange",
  type: "cyan"
}

interface MeetingCardProps {
  meeting: Meeting
}

export const MeetingCard = ({ meeting }: MeetingCardProps) => {

export function MeetingCard({ meeting }: MeetingCardProps) {
  const hasJoinLink = meeting.conference_url || meeting.conference_phone

  const renderJoinButton = () => {
    // If there's a direct conference URL (Zoom/Meet)
    if (meeting.conference_url) {
      return (
        <Link
          href={meeting.conference_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            colorScheme="blue"
            size="sm"
            variant="solid"
            color="white"
            _hover={{ bg: 'blue.600' }}
          >
            <FaExternalLinkAlt style={{ marginRight: '8px' }} />
            Join Meeting
          </Button>
        </Link>
      )
    }

    // If there's a website link
    if (meeting.website) {
      return (
        <Link
          href={meeting.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            colorScheme="gray"
            size="sm"
            variant="solid"
            _hover={{ bg: 'gray.600' }}
          >
            <FaExternalLinkAlt style={{ marginRight: '8px' }} />
            Website
          </Button>
        </Link>
      )
    }

    return null
  }

  const renderMeetingInfo = () => {
    if (meeting.conference_url_notes) {
      return <Text color="gray.500">ID: {meeting.conference_url_notes}</Text>
    }
    if (meeting.conference_phone) {
      return (
        <Text color="gray.500">
          Dial in: {meeting.conference_phone}
          {meeting.conference_phone_notes && ` (${meeting.conference_phone_notes})`}
        </Text>
      )
    }
    return null
  }

  // Create arrays of categories that exist in the meeting
  const categories = ['features', 'formats', 'languages', 'communities', 'type'] as const
  
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
          <Heading size="md" color="blue.600" _dark={{ color: "blue.300" }}>
            {meeting.name}
          </Heading>
          <Heading size="sm" color="gray.600" fontWeight="medium" mt={1}>
            {new Date(meeting.startDateUTC).toLocaleString(undefined, {
              weekday: "long",
              hour: "numeric",
              minute: "numeric",
              timeZoneName: "short",
            })}
          </Heading>
        </Box>

        {/* Meeting Info */}
        {meeting.notes && (
          <VStack align="stretch" gap={2}>
            {meeting.notes.split("\n").map((note, index) => (
              <Text key={index} color="gray.700" _dark={{ color: "gray.300" }}>
                {note}
              </Text>
            ))}
          </VStack>
        )}

        {/* Meeting Access Section */}
        <VStack align="start" gap={2} mt={4}>
          {renderJoinButton()}
          {renderMeetingInfo()}
        </VStack>

        {/* Categories */}
        <HStack wrap="wrap" gap={2}>
          {categories.map(category => 
            meeting[category]?.length > 0 && (
              meeting[category].map((item: string) => (
                <Tooltip key={`${category}-${item}`} content={DESCRIPTIONS[item] || item}>
                  <Badge
                    colorScheme={CATEGORY_COLORS[category]}
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    {item}
                  </Badge>
                </Tooltip>
              ))
            )
          )}
        </HStack>
      </VStack>
    </Box>
  )
}
