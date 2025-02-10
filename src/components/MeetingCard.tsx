import { FaExternalLinkAlt } from "react-icons/fa"

import { Tooltip } from "@/components/ui/tooltip"
import type { Meeting } from "@/meetings-utils"
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

const BADGE_DESCRIPTIONS: Record<string, string> = {
  POA: "Proof of Attendance",
  ST: "Step Meeting",
  TR: "Tradition Meeting",
  SP: "Speaker Meeting",
  BE: "Beginner Meeting",
  O: "Open Meeting - Anyone may attend",
  D: "Discussion Meeting",
  C: "Closed Meeting - AA Members Only",
  EN: "English Speaking",
  ABSI: "Absolutely Sober",
  LS: "Living Sober",
  Y: "Young People",
  B: "Big Book Study",
}

interface MeetingCardProps {
  meeting: Meeting
}

export const MeetingCard = ({ meeting }: MeetingCardProps) => {
  if (!meeting) {
    return <div>Loading...</div>;
  }

    // Ensure types and languages are arrays with a default empty array
    const types = Array.isArray(meeting.types) ? meeting.types : [];
    const languages = Array.isArray(meeting.languages) ? meeting.languages : [];

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

        {/* Join Button */}
        {meeting.conference_url && (
          <Box>
            <Link
              href={meeting.conference_url}
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ textDecoration: "none" }}
            >
              <Button
                bg="blue.700"
                color="white"
                size="md"
                width="full"
                _hover={{
                  bg: "blue.800",
                }}
              >
                <FaExternalLinkAlt style={{ marginRight: "8px" }} />
                Join Meeting
              </Button>
            </Link>
            {meeting.conference_url_notes && (
              <Text fontSize="sm" color="gray.500" mt={2}>
                {meeting.conference_url_notes}
              </Text>
            )}
          </Box>
        )}

        {/* Tags */}
        <HStack wrap="wrap" gap={2}>
          {types.map((type) => (
            <Tooltip key={type} content={BADGE_DESCRIPTIONS[type] || type}>
              <Badge
                colorScheme="blue"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="full"
              >
                {type}
              </Badge>
            </Tooltip>
          ))}
          {languages.map((lang) => (
            <Tooltip key={lang} content={BADGE_DESCRIPTIONS[lang] || lang}>
              <Badge
                colorScheme="green"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="full"
              >
                {lang}
              </Badge>
            </Tooltip>
          ))}
        </HStack>
      </VStack>
    </Box>
  )
}
