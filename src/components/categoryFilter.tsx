import { Tooltip } from "@/components/ui/tooltip"
import { Box, Button, Flex, Heading } from "@chakra-ui/react"

interface CategoryFilterProps<T extends string> {
  displayName: string
  options: Record<T, string | string[]>
  selected: T[]
  onToggle: (x: string) => void
}

export function CategoryFilter<T extends string>({
  displayName,
  options,
  selected,
  onToggle,
}: CategoryFilterProps<T>) {
  const codes = Object.keys(options) as T[]
  return (
    <Box>
      <Heading size="sm" mb={2} color="inherit">
        {displayName}
      </Heading>

      <Flex gap={2} flexWrap="wrap">
        {codes.map((code) => {
          const isSelected = selected.includes(code)
          return (
            <Box key={code}>
              <Tooltip content={options[code]}>
                <Button
                  size="xs"
                  variant="outline"
                  colorScheme={isSelected ? "blue" : "gray"}
                  onClick={() => {
                    onToggle(code)
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
                  {options[code]}
                </Button>
              </Tooltip>
            </Box>
          )
        })}
      </Flex>
    </Box>
  )
}
