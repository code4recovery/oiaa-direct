import { Tooltip } from "@/components/ui/tooltip"
import {
  Box,
  Button,
  Flex,
  Heading,
} from "@chakra-ui/react"

import type { MeetingType } from "../meetingTypes"

interface TypeFilterProps {
  categoryName: string
  types: MeetingType[]
  selectedTypes: string[]
  onToggleType: (type: string) => void
}

export function TypeFilter({
  categoryName,
  types,
  selectedTypes,
  onToggleType,
}: TypeFilterProps) {
  return (
    <Box>
      <Heading size="sm" mb={2} color="inherit">
        {categoryName}
      </Heading>

      <Flex gap={2} flexWrap="wrap">
        {types.map((type) => {
          const isSelected = selectedTypes.includes(type.code)
          return (
            <Box key={type.code}>
              <Tooltip content={type.description ?? type.name}>
                <Button
                  size="xs"
                  variant="outline"
                  colorScheme={isSelected ? "blue" : "gray"}
                  onClick={() => {
                    onToggleType(type.code)
                  }}
                  fontWeight="normal"
                  px={3}
                  height="24px"
                  borderRadius="full"
                  borderWidth="1px"
                  color="inherit"
                  _dark={{
                    borderColor: isSelected ? "blue.800" : "gray.400",
                    _hover: {
                      bg: "whiteAlpha.100",
                      borderColor: isSelected ? "blue.300" : "whiteAlpha.500",
                    },
                  }}
                  _hover={{
                    bg: "blackAlpha.50",
                    borderColor: isSelected ? "blue.500" : "gray.400",
                  }}
                >
                  {type.name}
                </Button>
              </Tooltip>
            </Box>
          )
        })}
      </Flex>
    </Box>
  )
}
