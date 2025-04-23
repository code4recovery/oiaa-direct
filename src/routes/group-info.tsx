import {
  FaArrowLeft,
  FaExternalLinkAlt,
} from "react-icons/fa"
import { Link as RouterLink } from "react-router"

import { Layout } from "@/components/Layout"
import { Tooltip } from "@/components/ui/tooltip"
import {
  getMeeting,
  getRelatedDetails,
} from "@/getData"
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
  Grid,
  GridItem,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react"

import type { Route } from "./+types/group-info"

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

const localTime = (timeStamp: string) => (
  <>
    {new Date(timeStamp).toLocaleString(undefined, {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    })}
  </>
)

const localTimeShort = (timeStamp: string) => (
  <>
    {new Date(timeStamp).toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
    })}
  </>
)

const localDay = (timeStamp: string) => (
  <>
    {new Date(timeStamp).toLocaleString(undefined, {
      weekday: "long",
    })}
  </>
)

// This function isn't ready yet, but it will be used to fetch the other group meetings byGroupId.
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const meeting = await getMeeting(params.slug)
  const group = await getRelatedDetails(`${params.slug}/related-group-info`)
  console.log("meeting", meeting)
  console.log("group", group)
  return { meeting, group }
}

export default function GroupInfo({ loaderData }: Route.ComponentProps) {
  const { meeting, group } = loaderData

  // Create arrays of categories that exist in the meeting
  const categories = [
    "features",
    "formats",
    "languages",
    "communities",
    "type",
  ] as const

  return (
    <Layout>
      <Box mb={4}>
        <RouterLink to="/">
          <Button size="sm" variant="outline" colorScheme="blue">
            <FaArrowLeft style={{ marginRight: "8px" }} />
            Back to Meetings
          </Button>
        </RouterLink>
      </Box>

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
            <Heading size="lg" color="blue.600" _dark={{ color: "blue.300" }}>
              {meeting.name}
            </Heading>
            <Heading size="md" color="gray.600" fontWeight="medium" mt={1}>
              {localTime(meeting.timeUTC)}
            </Heading>
          </Box>

          <hr />

          {/* Meeting Info */}
          {meeting.notes && (
            <VStack align="stretch" gap={2}>
              <Heading size="sm" mb={2}>
                About This Group
              </Heading>
              {(Array.isArray(meeting.notes)
                ? meeting.notes
                : (meeting.notes as string).split("\n")
              ).map((note: string, index: number) => (
                <Text
                  key={index}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {note}
                </Text>
              ))}
            </VStack>
          )}

          <hr />

          {/* Join Meeting Section */}
          <Box>
            <Heading size="sm" mb={2}>
              Join the Meeting
            </Heading>

            {meeting.conference_url && (
              <Box mb={3}>
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
                    Join Meeting Online
                  </Button>
                </Link>
                {meeting.conference_url_notes && (
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    {meeting.conference_url_notes}
                  </Text>
                )}
              </Box>
            )}

            {meeting.conference_phone && (
              <Box>
                <Link
                  href={`tel:${meeting.conference_phone}`}
                  _hover={{ textDecoration: "none" }}
                >
                  <Button
                    bg="green.600"
                    color="white"
                    size="md"
                    width="full"
                    _hover={{
                      bg: "green.700",
                    }}
                  >
                    Join by Phone
                  </Button>
                </Link>
                {meeting.conference_phone_notes && (
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    {meeting.conference_phone_notes}
                  </Text>
                )}
              </Box>
            )}

            {!meeting.conference_url && !meeting.conference_phone && (
              <Text color="gray.600">
                No online meeting links available. This may be an in-person
                meeting only.
              </Text>
            )}
          </Box>

          <hr />

          {/* Group Information */}
          <Box>
            <Heading size="sm" mb={4}>
              Group Information
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <Text fontWeight="bold">Meeting ID</Text>
                <Text>{meeting.slug}</Text>
              </GridItem>

              {meeting.group_id && (
                <GridItem>
                  <Text fontWeight="bold">Group ID</Text>
                  <Text>{meeting.group_id}</Text>
                </GridItem>
              )}

              <GridItem>
                <Text fontWeight="bold">Duration</Text>
                <Text>{meeting.duration} minutes</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Day</Text>
                <Text>{localDay(meeting.timeUTC)}</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Time</Text>
                <Text>{localTimeShort(meeting.timeUTC)}</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="bold">Timezone</Text>
                <Text>{meeting.timezone}</Text>
              </GridItem>

              {meeting.conference_provider && (
                <GridItem colSpan={2}>
                  <Text fontWeight="bold">Conference Provider</Text>
                  <Text>{meeting.conference_provider}</Text>
                </GridItem>
              )}
            </Grid>
          </Box>

          <hr />

          {/* Categories */}
          <Box>
            <Heading size="sm" mb={2}>
              Meeting Categories
            </Heading>
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
                        {item}
                      </Badge>
                    </Tooltip>
                  ))
                )
              })}
            </HStack>
          </Box>
        </VStack>
      </Box>
    </Layout>
  )
}
