import { useSearchParams } from "react-router"
import { FaExternalLinkAlt } from "react-icons/fa"

import { Filter } from "@/components/Filter"
import { Layout } from "@/components/Layout"
import { Tooltip } from "@/components/ui/tooltip"
import { getMeetings } from "@/meetings-utils"
import type { Meeting } from "@/meetingTypes"
import {
  COMMUNITIES,
  FEATURES,
  FORMATS,
  TYPE,
} from "@/meetingTypes"
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

const CATEGORY_COLORS = {
  features: "purple",
  formats: "blue",
  languages: "green",
  communities: "orange",
  type: "cyan",
}

interface RouteParams {
  slug: string
}

export type Route = {
  ClientLoaderArgs: {
    request: Request
    params: RouteParams
  }
  ComponentProps: {
    loaderData: {
      meeting: Meeting
    }
  }
}

export async function clientLoader({ params }: Route["ClientLoaderArgs"]) {
  const baseUrl = import.meta.env.VITE_CQ_URL
  if (!baseUrl) throw new Error("App not configured correctly")
  
  // Use the main meetings endpoint with slug filter
  const apiBase = baseUrl.replace('/meetings/next', '/meetings')
  const url = `${apiBase}?slug=${params.slug}`
  
  // For now, fetch all meetings and filter by slug
  // TODO: Update getMeetings to accept slug parameter
  const meetings = await getMeetings()
  const meeting = meetings.find(m => m.slug === params.slug)
  
  if (!meeting) {
    throw new Error(`Meeting with slug ${params.slug} not found`)
  }
  
  return { meeting }
}

export default function MeetingDetails({ loaderData }: Route["ComponentProps"]) {
  const { meeting } = loaderData
  const [filterParams, setFilterParams] = useSearchParams()

  const handleQuery = (query: string) => {
    setFilterParams((prev) => {
      prev.set("nameQuery", query)
      return prev
    })
  }

  // Create arrays of categories that exist in the meeting
  const categories = [
    "features",
    "formats",
    "languages",
    "communities",
    "type",
  ] as const
  
  return (
    <Layout
      sidebar={
        <Filter
          filterParams={filterParams}
          sendFilterSelectionsToParent={setFilterParams}
          sendQueryToParent={handleQuery}
        />
      }
    >
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
              {new Date(`2000-01-01T${meeting.time}`).toLocaleString(undefined, {
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
              {(Array.isArray(meeting.notes) ? meeting.notes : (meeting.notes as string).split('\n')).map((note: string, index: number) => (
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

          {/* Categories */}
          <HStack wrap="wrap" gap={2}>
            {categories.map(
              (category) => {
                const value = meeting[category];
                const items = Array.isArray(value) ? value : [value];
                return items.length > 0 && items.map((item: string) => (
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
                      {item}
                    </Badge>
                  </Tooltip>
                ))
              }
            )}
          </HStack>

          {/* Additional Meeting Details */}
          <Box>
            <Heading size="sm" mb={2}>Additional Details</Heading>
            <VStack align="stretch" gap={2}>
              {/* Add any additional meeting details you want to display */}
              {/* You can add more fields here as needed */}
              <Text color="gray.700" _dark={{ color: "gray.300" }}>
                Meeting ID: {meeting.slug}
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Layout>
  )
} 