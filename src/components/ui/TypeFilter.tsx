import { Button, Flex, Box } from "@chakra-ui/react"
import { Tooltip } from "@/components/ui/tooltip"
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
          <Box key={type.code}>
            <Tooltip content={type.description || type.name}>
              <Button
                size="xs"
                variant="outline"
                colorScheme={isSelected ? "blue" : "gray"}
                onClick={() => onToggleType(type.code)}
                fontWeight="normal"
                px={3}
                height="24px"
                borderRadius="full"
                borderWidth="1px"
                color="inherit"
                _dark={{
                  borderColor: isSelected ? 'blue.200' : 'whiteAlpha.400',
                  _hover: {
                    bg: 'whiteAlpha.100',
                    borderColor: isSelected ? 'blue.300' : 'whiteAlpha.500'
                  }
                }}
                _hover={{
                  bg: 'blackAlpha.50',
                  borderColor: isSelected ? 'blue.500' : 'gray.400'
                }}
              >
                {type.name}
              </Button>
            </Tooltip>
          </Box>
        )
      })}
    </Flex>
  )
} 