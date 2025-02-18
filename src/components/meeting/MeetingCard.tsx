import { Box, VStack } from "@chakra-ui/react"
import type { Meeting } from "@/meetings-utils"
import { MeetingHeader } from "./MeetingHeader"
import { MeetingActions } from "./MeetingActions"
import { MeetingCategories } from "./MeetingCategories"

interface MeetingCardProps {
  meeting: Meeting
}

export const MeetingCard = ({ meeting }: MeetingCardProps) => {
  return (
    <Box p={4} borderRadius="lg" borderWidth="1px">
      <VStack align="stretch" gap={4}>
        <MeetingHeader meeting={meeting} />
        <MeetingActions meeting={meeting} />
        <MeetingCategories meeting={meeting} />
      </VStack>
    </Box>
  )
} 