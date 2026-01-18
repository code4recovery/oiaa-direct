import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaGlobeAmericas,
  FaInfoCircle,
} from "react-icons/fa"
import { Link as RouterLink } from "react-router"

import { Layout } from "@/components/Layout"
import {
  CalendarActions,
  JoinMeetingButton,
  MeetingItem,
} from "@/components/meetings"
import {
  getMeeting,
  getRelatedDetails,
} from "@/getData"
import {
  COMMUNITIES,
  FEATURES,
  FORMATS,
  LANGUAGES,
  type Meeting,
  TYPE,
} from "@/meetingTypes"
import {
  formatMeetingTimeInfo,
  isScheduledMeeting,
  type MeetingTimeInfo,
} from "@/utils/meetings-utils"
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react"

import type { Route } from "./+types/group-info"

const DESCRIPTIONS: Record<string, string> = {
  ...TYPE,
  ...FORMATS,
  ...FEATURES,
  ...COMMUNITIES,
  ...LANGUAGES,
}

const CATEGORY_COLORS = {
  features: "purple",
  formats: "blue",
  languages: "green",
  communities: "orange",
  type: "cyan",
}

const TimeDisplay = ({ 
  timeInfo, 
  type = 'original' 
}: { 
  timeInfo: MeetingTimeInfo; 
  type?: 'original' | 'user' 
}) => {
  const time = type === 'original' ? timeInfo.originalTime : timeInfo.userTime
  const timezone = type === 'original' ? timeInfo.originalTimezone : timeInfo.userTimezone
  return (
    <>
      {time} ({timezone.replace("_", " ")})
    </>
  )
}

const localDay = (timeStamp: string) =>
  new Date(timeStamp).toLocaleString(undefined, {
    weekday: "long",
  })


const getCategoryFullName = (
  category: string,
): string => {
   return DESCRIPTIONS[category] || category
}

const MeetingTimeInfo = ({ 
  timeInfo 
}: { 
  timeInfo: MeetingTimeInfo | undefined
}) => {
  if (!timeInfo) {
    return (
      <Flex align="center" mt={2}>
        <Box mr={2} color="gray.600" _dark={{ color: "gray.400" }}>
          <FaCalendarAlt />
        </Box>
        <Text
          color="gray.600"
          _dark={{ color: "gray.400" }}
          fontWeight="medium"
        >
          Ongoing
        </Text>
      </Flex>
    )
  }

  return (
    <>
      <Flex align="center" mt={2}>
        <Box mr={2} color="gray.600" _dark={{ color: "gray.400" }}>
          <FaCalendarAlt />
        </Box>
        <Text
          color="gray.600"
          _dark={{ color: "gray.400" }}
          fontWeight="medium"
        >
          {localDay(timeInfo.timeUTC)} at {timeInfo.originalTime} ({timeInfo.originalTimezone.replace("_", " ")})
        </Text>
      </Flex>
      <Flex align="center" mt={1}>
        <Box mr={2} color="gray.600" _dark={{ color: "gray.400" }}>
          <FaGlobeAmericas />
        </Box>
        <Text color="gray.600" _dark={{ color: "gray.400" }}>
          Your local time: <TimeDisplay timeInfo={timeInfo} type="user" />
        </Text>
      </Flex>
      {timeInfo.duration && (
        <Flex align="center" mt={1}>
          <Box mr={2} color="gray.600" _dark={{ color: "gray.400" }}>
            <FaClock />
          </Box>
          <Text color="gray.600" _dark={{ color: "gray.400" }}>
            {timeInfo.duration} minutes
          </Text>
        </Flex>
      )}
    </>
  )
}

const MeetingHeader = ({ meeting }: { meeting: Meeting }) => {
  const timeInfo = isScheduledMeeting(meeting) ? formatMeetingTimeInfo(meeting) : undefined
  const websiteUrl = meeting.groupWebsite

  return (
    <Flex
      justifyContent="space-between"
      alignItems="flex-start"
      flexWrap="wrap"
    >
      <Box>
        <Heading size="lg" color="blue.600" _dark={{ color: "blue.300" }}>
          {meeting.name}
        </Heading>
        <MeetingTimeInfo timeInfo={timeInfo} />
      </Box>

      <Box mt={{ base: 4, md: 0 }}>
        {meeting.conference_url && (
          <Box
            as="span"
            display="inline-block"
            mr={2}
            verticalAlign="middle"
          >
            <JoinMeetingButton joinUrl={meeting.conference_url} />
          </Box>
        )}

        {websiteUrl && (
          <Link
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            _hover={{ textDecoration: "none" }}
            display="inline-block"
            mr={2}
          >
            <Button
              bg="purple.600"
              color="white"
              _hover={{
                bg: "purple.700",
              }}
              _dark={{
                bg: "purple.600",
                _hover: {
                  bg: "purple.700",
                },
              }}
              size="md"
            >
              <FaGlobeAmericas style={{ marginRight: "8px" }} />
              Website
            </Button>
          </Link>
        )}

        {meeting.groupEmail && (
          <Link
            href={`mailto:${meeting.groupEmail}`}
            _hover={{ textDecoration: "none" }}
            display="inline-block"
          >
            <Button
              bg="teal.600"
              color="white"
              _hover={{
                bg: "teal.700",
              }}
              _dark={{
                bg: "teal.600",
                _hover: {
                  bg: "teal.700",
                },
              }}
              size="md"
            >
              <FaEnvelope style={{ marginRight: "8px" }} />
              Email
            </Button>
          </Link>
        )}
      </Box>
    </Flex>
  )
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const meeting = await getMeeting(params.slug)
  const group = await getRelatedDetails(`${params.slug}/related-group-info`)
  console.log("meeting", meeting)
  console.log("group", group)
  return { meeting, group }
}

function MeetingDisplay({ meeting }: { meeting: Meeting }) {
  return (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderColor="gray.200" 
      borderRadius="md"
      bg="white"
      shadow="sm"
      _dark={{ borderColor: "gray.700", bg: "gray.800" }}
    >
      <Flex 
        direction={{ base: "column", md: "row" }} 
        gap={4} 
        align={{ base: "stretch", md: "flex-start" }}
      >

        <Box flex="1">
          <Heading 
            size="md" 
            color="gray.900" 
            _dark={{ color: "gray.100" }}
            mb={2}
          >
            {meeting.name}
          </Heading>

          <MeetingItem
            meeting={meeting}
            variant="compact"
            showActions={false}
            showCategories={false}
            showNotes={false}
            showLink={false}
          />
          
          <Flex flexWrap="wrap" gap={1} mt={3}>
            {meeting.formats.map((format: string) => (
              <Badge
                key={format}
                colorScheme="blue"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="full"
                fontSize="xs"
              >
                {DESCRIPTIONS[format] || format}
              </Badge>
            ))}
            {meeting.type && (
              <Badge
                colorScheme="purple"
                variant="subtle"
                px={2}
                py={1}
                borderRadius="full"
                fontSize="xs"
              >
                {DESCRIPTIONS[meeting.type] || meeting.type}
              </Badge>
            )}
          </Flex>
        </Box>
        

        <Box>
          <CalendarActions
            meeting={meeting}
            mode="full"
            size="md"
            layout="vertical"
          />
        </Box>
      </Flex>
    </Box>
  )
}

export default function GroupInfo({ loaderData }: Route.ComponentProps) {
  const { meeting, group } = loaderData
  const { groupMeetings, groupInfo } = group

  const timeInfo = isScheduledMeeting(meeting) ? formatMeetingTimeInfo(meeting) : undefined 

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
        overflow="hidden"
        mb={6}
        bg="white"
        _dark={{
          bg: "gray.800",
          borderColor: "whiteAlpha.300",
        }}
        boxShadow="md"
      >
        <Box bg="blue.50" _dark={{ bg: "blue.900" }} p={4}>
          <MeetingHeader meeting={meeting} />
        </Box>
      </Box>

      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="white"
        mb={6}
        _dark={{
          bg: "gray.800",
          borderColor: "whiteAlpha.300",
        }}
        boxShadow="sm"
      >
        <Box p={4} bg="gray.50" _dark={{ bg: "gray.700" }}>
          <Heading size="sm" mb={0}>
            Meeting Details
          </Heading>
        </Box>

        <Box p={6}>

          <Box mb={6}>
            <Heading size="sm" mb={3} display="flex" alignItems="center">
              <Box as="span" mr={2}>
                <FaInfoCircle />
              </Box>
              Meeting Categories
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              {categories.map((categoryType) => {
                const value = meeting[categoryType]
                const items = Array.isArray(value) ? value : [value]

                if (items.length === 0) return null

                return (
                  <Box key={categoryType}>
                    <Text fontWeight="bold" mb={2} textTransform="capitalize">
                      {categoryType}:
                    </Text>
                    <Flex flexWrap="wrap" gap={2}>
                      {items
                        .filter((item) => typeof item === "string")
                        .map((item) => (
                          <Badge
                            key={`${categoryType}-${item}`}
                            colorScheme={CATEGORY_COLORS[categoryType]}
                            variant="subtle"
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {getCategoryFullName(item)}
                          </Badge>
                        ))}
                    </Flex>
                  </Box>
                )
              })}
            </SimpleGrid>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mb={6}>
            <Box>
              <Text fontWeight="bold">Meeting ID</Text>
              <Text>{meeting.slug}</Text>
            </Box>

            {meeting.group_id && (
              <Box>
                <Text fontWeight="bold">Group ID</Text>
                <Text>{meeting.group_id}</Text>
              </Box>
            )}

            {timeInfo && (
              <>
                <Box>
                  <Text fontWeight="bold">Day</Text>
                  <Text>{localDay(timeInfo.timeUTC)}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Meeting Time</Text>
                  <Text>
                    <TimeDisplay timeInfo={timeInfo} type="original" />
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Your Local Time</Text>
                  <Text>
                    <TimeDisplay timeInfo={timeInfo} type="user" />
                  </Text>
                </Box>
              </>
            )}

            {meeting.conference_provider && (
              <Box>
                <Text fontWeight="bold">Conference Provider</Text>
                <Text>{meeting.conference_provider}</Text>
              </Box>
            )}
          </SimpleGrid>

          {meeting.notes && (
            <Box mb={6}>
              <Heading size="sm" mb={3}>
                About This Group
              </Heading>
              <Box
                p={4}
                bg="gray.50"
                _dark={{ bg: "gray.700" }}
                borderRadius="md"
              >
                {(Array.isArray(meeting.notes)
                  ? meeting.notes
                  : (meeting.notes as string).split("\n")
                ).map((note: string, index: number) => (
                  <Text
                    key={index}
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                    mb={2}
                  >
                    {note}
                  </Text>
                ))}
              </Box>
            </Box>
          )}

          {groupInfo.notes && (
            <Box mt={4}>
              <Text fontWeight="bold" mb={2}>
                Group Notes
              </Text>
              <Box
                p={4}
                bg="gray.50"
                _dark={{ bg: "gray.700" }}
                borderRadius="md"
              >
                {groupInfo.notes.split("\n").map((note, index) => (
                  <Text key={index} mb={2}>
                    {note}
                  </Text>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        mb={6}
        bg="white"
        _dark={{
          bg: "gray.800",
          borderColor: "whiteAlpha.300",
        }}
        boxShadow="md"
      >
        <Box bg="blue.50" _dark={{ bg: "blue.900" }} p={4}>
          <Heading size="md" color="blue.600" _dark={{ color: "blue.300" }}>
            {groupInfo.name} - All Meetings
          </Heading>
          {groupInfo.email && (
            <Flex align="center" mt={2}>
              <Box mr={2} color="gray.600" _dark={{ color: "gray.400" }}>
                <FaEnvelope />
              </Box>
              <Link
                href={`mailto:${groupInfo.email}`}
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                {groupInfo.email}
              </Link>
            </Flex>
          )}
        </Box>
        
        <Box p={6}>
          <Flex direction="column" gap={4}>
            {groupMeetings.map((groupMeeting, index: number) => (
              <Box
                key={groupMeeting.slug}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor="gray.200"
                _dark={{ borderColor: "gray.700" }}
                _hover={{ boxShadow: "sm" }}
              >
                <MeetingDisplay meeting={groupMeeting} />
                {index < groupMeetings.length - 1 && (
                  <Box
                    borderBottom="1px"
                    borderColor="gray.200"
                    _dark={{ borderColor: "gray.700" }}
                    mt={4}
                  />
                )}
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>
    </Layout>
  )
}
