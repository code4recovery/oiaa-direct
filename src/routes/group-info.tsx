import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCalendarPlus,
  FaClock,
  FaEnvelope,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaGlobeAmericas
} from "react-icons/fa"
import { Link as RouterLink } from "react-router"
import { useState } from "react"

import { Layout } from "@/components/Layout"
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
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react"

import type { Route } from "./+types/group-info"

// Type definitions for our data
interface GroupMeeting {
  slug: string
  name: string
  timezone: string
  duration: number
  notes?: string
  conference_url?: string
  groupID?: string
  languages?: string[]
  groupEmail?: string
  timeUTC: string
  rtc: string
  communities?: string[]
  features?: string[]
  formats?: string[]
  type?: string[]
  groupNotes?: string
}

// Using type assertion instead of interface for local use
type GroupData = {
  groupInfo: {
    _id: string
    name: string
    email: string
    notes?: string
  }
  groupMeetings: GroupMeeting[]
}

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

/**
 * Formats a time in both the original timezone and the user's local timezone
 */
const formatMeetingTime = (timeUTC: string, meetingTimezone: string) => {
  // Create a date object from the UTC time
  const date = new Date(timeUTC);
  
  // Get user's local timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Format date for the meeting's original timezone
  const originalTimeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: meetingTimezone,
    hour12: true
  });
  
  // Format date for user's local timezone
  const userTimeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: userTimezone,
    hour12: true
  });
  
  const originalTime = originalTimeFormatter.format(date);
  const userTime = userTimeFormatter.format(date);
  
  return {
    originalTime,
    userTime,
    originalTimezone: meetingTimezone,
    userTimezone
  };
}

const localDay = (timeStamp: string) => (
  new Date(timeStamp).toLocaleString(undefined, {
    weekday: "long",
  })
)

// Function to get full name of category
const getCategoryFullName = (category: string, categoryType: string): string => {
  if (categoryType === "languages") {
    return category // Languages are already full names
  }
  
  return DESCRIPTIONS[category] || category
}

// This function isn't ready yet, but it will be used to fetch the other group meetings byGroupId.
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const meeting = await getMeeting(params.slug)
  const group = await getRelatedDetails(`${params.slug}/related-group-info`)
  console.log("meeting", meeting)
  console.log("group", group)
  return { meeting, group }
}

// Meeting accordion component
function MeetingAccordion({ meeting }: { meeting: GroupMeeting }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeInfo = formatMeetingTime(meeting.timeUTC, meeting.timezone);
  
  return (
    <Box>
      <Flex 
        justifyContent="space-between" 
        alignItems="flex-start"
        flexWrap="wrap"
        mb={isOpen ? 3 : 2}
      >
        <Box>
          <Heading size="sm" color="gray.700" _dark={{ color: "gray.300" }}>
            {meeting.name}
          </Heading>
          <Flex align="center" mt={1}>
            <Box mr={2} color="gray.600" _dark={{ color: "gray.400" }}>
              <FaCalendarAlt />
            </Box>
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              {localDay(meeting.timeUTC)} at {timeInfo.originalTime} ({timeInfo.originalTimezone.replace("_", " ")})
            </Text>
          </Flex>
          <Flex align="center" mt={1}>
            <Box mr={2} color="gray.600" _dark={{ color: "gray.400" }}>
              <FaGlobeAmericas />
            </Box>
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              Your local time: {timeInfo.userTime} ({timeInfo.userTimezone})
            </Text>
          </Flex>
        </Box>
        
        <Button 
          variant="ghost"
          size="sm"
          mt={{ base: 2, md: 0 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Hide Details" : "View Details"} {isOpen ? <FaChevronUp style={{ marginLeft: "8px" }} /> : <FaChevronDown style={{ marginLeft: "8px" }} />}
        </Button>
      </Flex>
      
      {meeting.formats && meeting.formats.length > 0 && (
        <Flex flexWrap="wrap" gap={1} mt={2}>
          {meeting.formats.map((format: string) => (
            <Badge 
              key={format} 
              colorScheme="blue" 
              variant="subtle"
              px={2}
              py={1}
              borderRadius="full"
              mr={1}
              mb={1}
            >
              {getCategoryFullName(format, "formats")}
            </Badge>
          ))}
        </Flex>
      )}
      
      {isOpen && (
        <Box
          mt={3}
          p={3}
          bg="gray.50"
          _dark={{ bg: "gray.700" }}
          borderRadius="md"
        >
          {meeting.notes || (meeting as any).groupNotes ? (
            <Text mb={3}>{meeting.notes || (meeting as any).groupNotes}</Text>
          ) : (
            <Text fontStyle="italic" color="gray.500" mb={3}>No meeting notes available</Text>
          )}
          
          <Button
            colorScheme="green"
            variant="outline"
            size="sm"
          >
            <FaCalendarPlus style={{ marginRight: "8px" }} /> Add to Calendar
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default function GroupInfo({ loaderData }: Route.ComponentProps) {
  const { meeting, group } = loaderData
  // Convert group to GroupData or use a safe default using double assertion for safety
  const groupData = group ? (group as unknown as GroupData) : null
  const timeInfo = formatMeetingTime(meeting.timeUTC, meeting.timezone);

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

      {/* Current Meeting Section - Essential Join Info */}
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
        <Box 
          bg="blue.50" 
          _dark={{ bg: "blue.900" }}
          p={4}
        >
          <Flex justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
            <Box>
              <Heading size="lg" color="blue.600" _dark={{ color: "blue.300" }}>
                {meeting.name}
              </Heading>
              <Flex align="center" mt={2}>
                <Box mr={2} color="gray.600" _dark={{ color: "gray.400" }}>
                  <FaCalendarAlt />
                </Box>
                <Text color="gray.600" _dark={{ color: "gray.400" }} fontWeight="medium">
                  {localDay(meeting.timeUTC)} at {timeInfo.originalTime} ({timeInfo.originalTimezone.replace("_", " ")})
                </Text>
              </Flex>
              <Flex align="center" mt={1}>
                <Box mr={2} color="gray.600" _dark={{ color: "gray.400" }}>
                  <FaGlobeAmericas />
                </Box>
                <Text color="gray.600" _dark={{ color: "gray.400" }}>
                  Your local time: {timeInfo.userTime} ({timeInfo.userTimezone})
                </Text>
              </Flex>
              <Flex align="center" mt={1}>
                <Box mr={2} color="gray.600" _dark={{ color: "gray.400" }}>
                  <FaClock />
                </Box>
                <Text color="gray.600" _dark={{ color: "gray.400" }}>{meeting.duration} minutes</Text>
              </Flex>
            </Box>
            
            <Box mt={{ base: 4, md: 0 }}>
              {meeting.conference_url && (
                <Link
                  href={meeting.conference_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  _hover={{ textDecoration: "none" }}
                  display="inline-block"
                  mr={2}
                >
                  <Button
                    bg="blue.600"
                    color="white"
                    _hover={{
                      bg: "blue.700",
                    }}
                    _dark={{
                      bg: "blue.600",
                      _hover: {
                        bg: "blue.700",
                      }
                    }}
                    size="md"
                  >
                    <FaExternalLinkAlt style={{ marginRight: "8px" }} />
                    Join Meeting
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
                      }
                    }}
                    size="md"
                  >
                    <FaEnvelope style={{ marginRight: "8px" }} />
                    Contact
                  </Button>
                </Link>
              )}
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* Meeting Details */}
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
          {/* Meeting Categories */}
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
                const items = Array.isArray(value) ? value : value ? [value] : []
                
                if (items.length === 0) return null
                
                return (
                  <Box key={categoryType}>
                    <Text fontWeight="bold" mb={2} textTransform="capitalize">
                      {categoryType}:
                    </Text>
                    <Flex flexWrap="wrap" gap={2}>
                      {items.map((item) => (
                        <Badge
                          key={`${categoryType}-${item}`}
                          colorScheme={CATEGORY_COLORS[categoryType]}
                          variant="subtle"
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          {getCategoryFullName(item, categoryType)}
                        </Badge>
                      ))}
                    </Flex>
                  </Box>
                )
              })}
            </SimpleGrid>
          </Box>

          {/* Technical Information */}
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

            <Box>
              <Text fontWeight="bold">Day</Text>
              <Text>{localDay(meeting.timeUTC)}</Text>
            </Box>

            <Box>
              <Text fontWeight="bold">Meeting Time</Text>
              <Text>{timeInfo.originalTime} ({timeInfo.originalTimezone.replace("_", " ")})</Text>
            </Box>
            
            <Box>
              <Text fontWeight="bold">Your Local Time</Text>
              <Text>{timeInfo.userTime} ({timeInfo.userTimezone})</Text>
            </Box>

            {meeting.conference_provider && (
              <Box>
                <Text fontWeight="bold">Conference Provider</Text>
                <Text>{meeting.conference_provider}</Text>
              </Box>
            )}
          </SimpleGrid>
          
          {/* About This Group */}
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
          
          {/* Group Notes */}
          {(groupData?.groupInfo?.notes || (meeting as any).groupNotes) && (
            <Box mt={4}>
              <Text fontWeight="bold" mb={2}>Group Notes</Text>
              <Box 
                p={4} 
                bg="gray.50" 
                _dark={{ bg: "gray.700" }}
                borderRadius="md"
              >
                {((groupData?.groupInfo?.notes || (meeting as any).groupNotes) as string).split("\n").map((note, index) => (
                  <Text key={index} mb={2}>{note}</Text>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Group Information and Meetings */}
      {groupData && (
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
          <Box 
            bg="blue.50" 
            _dark={{ bg: "blue.900" }}
            p={4}
          >
            <Heading size="md" color="blue.600" _dark={{ color: "blue.300" }}>
              {groupData.groupInfo.name} - All Meetings
            </Heading>
            {groupData.groupInfo.email && (
              <Flex align="center" mt={2}>
                <Box mr={2} color="gray.600" _dark={{ color: "gray.400" }}>
                  <FaEnvelope />
                </Box>
                <Link href={`mailto:${groupData.groupInfo.email}`} color="gray.600" _dark={{ color: "gray.400" }}>
                  {groupData.groupInfo.email}
                </Link>
              </Flex>
            )}
          </Box>

          <Box p={6}>
            <Flex direction="column" gap={4}>
              {groupData.groupMeetings.map((groupMeeting: GroupMeeting, index: number) => (
                <Box 
                  key={groupMeeting.slug} 
                  p={4} 
                  borderWidth="1px" 
                  borderRadius="md"
                  borderColor="gray.200"
                  _dark={{ borderColor: "gray.700" }}
                  _hover={{ boxShadow: "sm" }}
                >
                  <MeetingAccordion meeting={groupMeeting} />
                  {index < groupData.groupMeetings.length - 1 && <Box borderBottom="1px" borderColor="gray.200" _dark={{ borderColor: "gray.700" }} mt={4} />}
                </Box>
              ))}
            </Flex>
          </Box>
        </Box>
      )}
    </Layout>
  )
}
