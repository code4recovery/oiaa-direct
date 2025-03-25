import { Tooltip } from "@/components/ui/tooltip"
import { Box, Button, Flex, Heading } from "@chakra-ui/react"

const CATEGORY_COLORS = {
  features: "purple",
  formats: "blue",
  languages: "green",
  communities: "orange",
  type: "cyan",
} as const

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
  const colorScheme = CATEGORY_COLORS[displayName.toLowerCase().split(" ")[0] as keyof typeof CATEGORY_COLORS] || "blue"
  
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
                  colorScheme={isSelected ? colorScheme : "gray"}
                  onClick={() => {
                    onToggle(code)
                  }}
                  fontWeight="normal"
                  px={3}
                  height="24px"
                  borderRadius="full"
                  borderWidth="1px"
                  color="inherit"
                  bg={isSelected ? `${colorScheme}.100` : "transparent"}
                  borderColor={isSelected ? `${colorScheme}.200` : "gray.200"}
                  _dark={{
                    borderColor: isSelected ? `${colorScheme}.800` : "gray.400",
                    bg: isSelected ? `${colorScheme}.900` : "transparent",
                    _hover: {
                      bg: isSelected ? `${colorScheme}.800` : "whiteAlpha.100",
                      borderColor: isSelected ? `${colorScheme}.300` : "whiteAlpha.500",
                    },
                  }}
                  _hover={{
                    bg: isSelected ? `${colorScheme}.200` : "gray.50",
                    borderColor: isSelected ? `${colorScheme}.300` : "gray.300",
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
