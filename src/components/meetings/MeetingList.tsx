import type { Meeting } from "@/meetingTypes"
import { VStack } from "@chakra-ui/react"

import MeetingItem from "./MeetingItem"

export interface MeetingListProps {
  meetings: Meeting[]
}

export function MeetingList({ meetings }: MeetingListProps) {
  return (
    <VStack gap={6} align="stretch">
      {meetings.map((meeting) => (
        <MeetingItem 
          key={meeting.slug} 
          meeting={meeting} 
          variant="list"
          showActions={true}
          showCategories={true}
          showNotes={false}
          forceResponsive={true}
        />
      ))}
    </VStack>
  )
}
