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
      {types.map((type) => {
        const isSelected = selectedTypes.includes(type.code)
        return (
          <Button
            key={type.code}
            size="sm"
            variant={isSelected ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => onToggleType(type.code)}
            color={isSelected ? 'white' : 'inherit'}
            _dark={{
              color: isSelected ? 'white' : 'gray.200',
              borderColor: isSelected ? 'transparent' : 'gray.600',
              bg: isSelected ? 'blue.500' : 'transparent',
              _hover: {
                bg: isSelected ? 'blue.600' : 'whiteAlpha.200'
              }
            }}
          >
            {type.name}
          </Button>
        )
      })}
    </Flex>
  )
} 