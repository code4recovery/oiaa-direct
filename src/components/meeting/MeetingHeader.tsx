import { Heading, Text, VStack } from "@chakra-ui/react"
import type { Meeting } from "@/meetings-utils"

interface MeetingHeaderProps {
  meeting: Meeting
}

export const MeetingHeader = ({ meeting }: MeetingHeaderProps) => (
  <VStack align="start" gap={1}>
    <Heading size="md">{meeting.name}</Heading>
    <Text color="gray.500">
      {meeting.time} {meeting.timezone}
    </Text>
  </VStack>
) 