import { Button, Flex } from "@chakra-ui/react"
import type { MeetingType } from "../meetings/meetingTypes"

interface TypeFilterProps {
  types: MeetingType[]
  selectedTypes: string[]
  onToggleType: (type: string) => void
}

export const TypeFilter = ({ types, selectedTypes, onToggleType }: TypeFilterProps) => {
  return (
    <Flex gap={2} flexWrap="wrap">
      {types.map((type) => (
        <Button
          key={type.code}
          size="sm"
          variant={selectedTypes.includes(type.code) ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => onToggleType(type.code)}
        >
          {type.name}
        </Button>
      ))}
    </Flex>
  )
} 