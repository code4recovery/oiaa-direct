import { FaEnvelope, FaExternalLinkAlt, FaLink } from "react-icons/fa"
import { Link as RRLink } from "react-router"

import { Tooltip } from "@/components/ui/tooltip"
import type { Meeting } from "@/meetingTypes"
import { COMMUNITIES, FEATURES, FORMATS, TYPE } from "@/meetingTypes"
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
  type: "cyan",
}

interface MeetingCardProps {
  meeting: Meeting
}

export const MeetingCard = ({ meeting }: MeetingCardProps) => {
  // Create arrays of categories that exist in the meeting
  const categories = [
    "features",
    "formats",
    "languages",
    "communities",
    "type",
  ] as const

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
          <Heading size="sm" color="gray.600" fontWeight="medium" mt={1}>
            {new Date(`${meeting.timeUTC}`).toLocaleString(undefined, {
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

        {/* Contact Buttons */}
        {(meeting.groupEmail || meeting.groupWebsite) && (
          <HStack gap={2} wrap="wrap">
            {meeting.groupEmail && (
              <Link
                href={`mailto:${meeting.groupEmail}`}
                _hover={{ textDecoration: "none" }}
              >
                <Button size="sm" variant="outline" colorScheme="blue">
                  <FaEnvelope style={{ marginRight: "8px" }} />
                  Email
                </Button>
              </Link>
            )}

            {meeting.groupWebsite && (
              <Link
                href={meeting.groupWebsite}
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ textDecoration: "none" }}
              >
                <Button size="sm" variant="outline" colorScheme="blue">
                  <FaLink style={{ marginRight: "8px" }} />
                  Website
                </Button>
              </Link>
            )}
          </HStack>
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

        {/* Categories */}
        <HStack wrap="wrap" gap={2}>
          {categories.map((category) => {
            const value = meeting[category]
            const items = Array.isArray(value) ? value : [value]
            return (
              items.length > 0 &&
              items.map((item: string) => (
                <Tooltip
                  key={`${category}-${item}`}
                  content={DESCRIPTIONS[item] || item}
                >
                  <Badge
                    colorScheme={CATEGORY_COLORS[category]}
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    {item?.toUpperCase()}
                  </Badge>
                </Tooltip>
              ))
            )
          })}
        </HStack>
      </VStack>
    </Box>
  )
}
