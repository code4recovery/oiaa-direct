import { Button, Link, Text, VStack } from "@chakra-ui/react"
import { FaExternalLinkAlt } from "react-icons/fa"
import type { Meeting } from "@/meetings-utils"

interface MeetingActionsProps {
  meeting: Meeting
}

export const MeetingActions = ({ meeting }: MeetingActionsProps) => {
  const renderJoinButton = () => {
    if (meeting.conference_url) {
      return (
        <Link href={meeting.conference_url} target="_blank" rel="noopener noreferrer">
          <Button colorScheme="blue" size="sm" variant="solid" color="white">
            <FaExternalLinkAlt style={{ marginRight: '8px' }} />
            Join Meeting
          </Button>
        </Link>
      )
    }

    if (meeting.website) {
      return (
        <Link href={meeting.website} target="_blank" rel="noopener noreferrer">
          <Button colorScheme="gray" size="sm" variant="solid">
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

  return (
    <VStack align="start" gap={2}>
      {renderJoinButton()}
      {renderMeetingInfo()}
    </VStack>
  )
} 