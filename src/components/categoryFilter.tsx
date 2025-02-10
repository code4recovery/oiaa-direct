import { Tooltip } from "@/components/ui/tooltip"
import { Box, Button, Flex, Heading } from "@chakra-ui/react"

interface CategoryFilterProps {
  categoryName: string
  categoryData: Record<string, string>
  selectedTypes: string[]
  onToggleType: (type: string) => void
}

export function CategoryFilter({
  categoryName,
  categoryData,
  selectedTypes,
  onToggleType,
}: CategoryFilterProps) {
  const codes = Object.keys(categoryData)
  return (
    <Box>
      <Heading size="sm" mb={2} color="inherit">
        {categoryName}
      </Heading>

      <Flex gap={2} flexWrap="wrap">
        {codes.map((code) => {
          const isSelected = selectedTypes.includes(code)
          return (
            <Box key={code}>
              <Tooltip content={categoryData[code]}>
                <Button
                  size="xs"
                  variant="outline"
                  colorScheme={isSelected ? "blue" : "gray"}
                  onClick={() => {
                    onToggleType(code)
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
                  {categoryData[code].valueOf()}
                </Button>
              </Tooltip>
            </Box>
          )
        })}
      </Flex>
    </Box>
  )
}
