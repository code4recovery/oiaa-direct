import { Link as RRLink } from "react-router"

import type { Meeting } from "@/meetingTypes"
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react"

import MeetingTime from "./MeetingTime"
import MeetingCategories from "./MeetingCategories"
import QuickActions from "./QuickActions"

export type MeetingItemVariant = 'compact' | 'list' | 'card' | 'detailed'

export interface MeetingItemProps {

  meeting: Meeting

  variant: MeetingItemVariant

  showActions?: boolean

  showNotes?: boolean

  showCategories?: boolean

  maxCategories?: number

  showLink?: boolean

  forceResponsive?: boolean
}

const CompactVariant = ({ meeting, showActions = false, showLink = true }: {
  meeting: Meeting
  showActions?: boolean
  showLink?: boolean
}) => {
  const content = (
    <Flex
      align="center"
      justify="space-between"
      minH="60px"
      p={3}
      _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
      transition="background-color 0.2s"
    >
      <Flex direction="column" flex="1" overflow="hidden">
        <Text
          fontSize="sm"
          fontWeight="medium"
          color={showLink ? "blue.600" : "gray.900"}
          _dark={{ color: showLink ? "blue.300" : "gray.100" }}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          _hover={showLink ? { textDecoration: "underline" } : {}}
        >
          {meeting.name}
        </Text>
        <Box mt={1}>
                  <MeetingTime
          timeUTC={meeting.timeUTC}
          timezone={meeting.timezone}
          format="compact"
          showLocal={true}
          showIcons={false}
        />
        </Box>
      </Flex>
      
      {showActions && (
        <Box ml={3}>
          <QuickActions
            meeting={meeting}
            forceMode="icon-only"
            size="xs"
            layout="horizontal"
          />
        </Box>
      )}
    </Flex>
  )

  if (showLink) {
    return (
      <RRLink to={`/group-info/${meeting.slug}`}>
        {content}
      </RRLink>
    )
  }

  return content
}

const ListVariant = ({ 
  meeting, 
  showActions = true, 
  showCategories = true, 
  maxCategories = 3,
  showLink = true 
}: {
  meeting: Meeting
  showActions?: boolean
  showCategories?: boolean
  maxCategories?: number
  showLink?: boolean
}) => {
  const content = (
    <Box
      minH="100px"
      p={4}
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.200"
      bg="white"
      _dark={{ 
        borderColor: "gray.700",
        bg: "gray.800"
      }}
      _hover={{ 
        shadow: "sm",
        borderColor: "blue.300",
        _dark: { borderColor: "blue.500" }
      }}
      transition="all 0.2s"
    >
      <Flex direction="column" gap={2}>

        <Flex justify="space-between" align="flex-start">
          <Box flex="1" overflow="hidden">
            <Heading
              size="sm"
              color={showLink ? "blue.600" : "gray.900"}
              _dark={{ color: showLink ? "blue.300" : "gray.100" }}
              overflow="hidden"
              textOverflow="ellipsis"
              display="-webkit-box"
              css={{
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
              _hover={showLink ? { textDecoration: "underline" } : {}}
            >
              {meeting.name}
            </Heading>
          </Box>
          
          {showActions && (
            <Box ml={3} flexShrink={0}>
              <QuickActions
                meeting={meeting}
                size="sm"
                layout="horizontal"
              />
            </Box>
          )}
        </Flex>

        <Box>
          <MeetingTime
            timeUTC={meeting.timeUTC}
            timezone={meeting.timezone}
            format="compact"
            showLocal={true}
            showIcons={false}
          />
        </Box>

        {showCategories && (
          <MeetingCategories
            meeting={meeting}
            size="sm"
            layout="limited"
            maxVisible={maxCategories}
            showFullNames={false}
          />
        )}
      </Flex>
    </Box>
  )

  if (showLink) {
    return (
      <RRLink to={`/group-info/${meeting.slug}`}>
        {content}
      </RRLink>
    )
  }

  return content
}

const CardVariant = ({ 
  meeting, 
  showActions = true, 
  showNotes = true, 
  showCategories = true,
  showLink = true 
}: {
  meeting: Meeting
  showActions?: boolean
  showNotes?: boolean
  showCategories?: boolean
  showLink?: boolean
}) => {
  const content = (
    <Box
      minH="180px"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      borderColor="gray.200"
      bg="white"
      _dark={{ 
        borderColor: "gray.700",
        bg: "gray.800"
      }}
      _hover={{ 
        shadow: "md",
        borderColor: "blue.300",
        _dark: { borderColor: "blue.500" }
      }}
      transition="all 0.2s"
    >
      <VStack align="stretch" gap={4} h="full">

        <Box>
          <Heading
            size="md"
            color={showLink ? "blue.600" : "gray.900"}
            _dark={{ color: showLink ? "blue.300" : "gray.100" }}
            overflow="hidden"
            textOverflow="ellipsis"
            display="-webkit-box"
            css={{
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
            _hover={showLink ? { textDecoration: "underline" } : {}}
          >
            {meeting.name}
          </Heading>
          <Box mt={2}>
            <MeetingTime
              timeUTC={meeting.timeUTC}
              timezone={meeting.timezone}
              format="short"
              showLocal={true}
              showIcons={true}
            />
          </Box>
        </Box>


        {showNotes && meeting.notes && (
          <Box flex="1">
            <VStack align="stretch" gap={2}>
              {(Array.isArray(meeting.notes)
                ? meeting.notes
                : (meeting.notes as string).split("\n")
              ).slice(0, 2).map((note: string, index: number) => (
                <Text 
                  key={index} 
                  fontSize="sm" 
                  color="gray.700" 
                  _dark={{ color: "gray.300" }} 
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {note}
                </Text>
              ))}
            </VStack>
          </Box>
        )}


        {showActions && (
          <Box>
            <QuickActions
              meeting={meeting}
              size="sm"
              layout="horizontal"
            />
          </Box>
        )}


        {showCategories && (
          <MeetingCategories
            meeting={meeting}
            size="sm"
            layout="limited"
            maxVisible={6}
            showFullNames={false}
          />
        )}
      </VStack>
    </Box>
  )

  if (showLink) {
    return (
      <RRLink to={`/group-info/${meeting.slug}`}>
        {content}
      </RRLink>
    )
  }

  return content
}


const DetailedVariant = ({ 
  meeting, 
  showActions = true, 
  showNotes = true, 
  showCategories = true,
  showLink = false 
}: {
  meeting: Meeting
  showActions?: boolean
  showNotes?: boolean
  showCategories?: boolean
  showLink?: boolean
}) => {
  const content = (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      borderColor="gray.200"
      bg="white"
      _dark={{ 
        borderColor: "gray.700",
        bg: "gray.800"
      }}
      shadow="sm"
    >
      <VStack align="stretch" gap={6}>

        <Box>
          <Heading
            size="lg"
            color={showLink ? "blue.600" : "gray.900"}
            _dark={{ color: showLink ? "blue.300" : "gray.100" }}
            _hover={showLink ? { textDecoration: "underline" } : {}}
          >
            {meeting.name}
          </Heading>
          <Box mt={3}>
            <MeetingTime
              timeUTC={meeting.timeUTC}
              timezone={meeting.timezone}
              format="long"
              showLocal={true}
              showIcons={true}
            />
          </Box>
        </Box>


        {showNotes && meeting.notes && (
          <VStack align="stretch" gap={3}>
            <Text fontSize="md" fontWeight="medium" color="gray.800" _dark={{ color: "gray.200" }}>
              Meeting Information
            </Text>
            <VStack align="stretch" gap={2}>
              {(Array.isArray(meeting.notes)
                ? meeting.notes
                : (meeting.notes as string).split("\n")
              ).map((note: string, index: number) => (
                <Text key={index} fontSize="md" color="gray.700" _dark={{ color: "gray.300" }}>
                  {note}
                </Text>
              ))}
            </VStack>
          </VStack>
        )}

        {showActions && (
          <Box>
            <QuickActions
              meeting={meeting}
              size="md"
              layout="horizontal"
            />
            {meeting.conference_url_notes && (
              <Text fontSize="sm" color="gray.500" mt={3}>
                {meeting.conference_url_notes}
              </Text>
            )}
          </Box>
        )}


        {showCategories && (
          <Box>
            <Text fontSize="md" fontWeight="medium" color="gray.800" _dark={{ color: "gray.200" }} mb={3}>
              Meeting Details
            </Text>
            <MeetingCategories
              meeting={meeting}
              size="md"
              layout="wrap"
              showFullNames={true}
            />
          </Box>
        )}
      </VStack>
    </Box>
  )

  if (showLink) {
    return (
      <RRLink to={`/group-info/${meeting.slug}`}>
        {content}
      </RRLink>
    )
  }

  return content
}

export const MeetingItem = ({
  meeting,
  variant,
  showActions,
  showNotes,
  showCategories,
  maxCategories,
  showLink = true,
  forceResponsive = false,
}: MeetingItemProps) => {
  

  const responsiveVariant = useBreakpointValue({
    base: 'list' as const,
    md: 'card' as const,
    lg: 'card' as const,
  })

  const effectiveVariant = forceResponsive === false ? variant : (responsiveVariant || variant)

  switch (effectiveVariant) {
    case 'compact':
      return (
        <CompactVariant 
          meeting={meeting}
          showActions={showActions}
          showLink={showLink}
        />
      )
    
    case 'list':
      return (
        <ListVariant 
          meeting={meeting}
          showActions={showActions}
          showCategories={showCategories}
          maxCategories={maxCategories}
          showLink={showLink}
        />
      )
    
    case 'card':
      return (
        <CardVariant 
          meeting={meeting}
          showActions={showActions}
          showNotes={showNotes}
          showCategories={showCategories}
          showLink={showLink}
        />
      )
    
    case 'detailed':
      return (
        <DetailedVariant 
          meeting={meeting}
          showActions={showActions}
          showNotes={showNotes}
          showCategories={showCategories}
          showLink={showLink}
        />
      )
    
    default:
      return (
        <ListVariant 
          meeting={meeting}
          showActions={showActions}
          showCategories={showCategories}
          maxCategories={maxCategories}
          showLink={showLink}
        />
      )
  }
}

export default MeetingItem