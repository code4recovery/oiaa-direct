import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react"
import { FaTimesCircle } from "react-icons/fa"
import { useSearchParams } from "react-router-dom"
import { SearchInput } from "./SearchInput"
import { CategoryFilter } from "./categoryFilter"
import { 
  TYPE, FORMATS, FEATURES, COMMUNITIES,
  type Type, type Format, type Feature, type Community,
  type CategoryMap 
} from "@/meetingTypes"
import { toggleArrayElement } from "@/meetings-utils"

interface FilterProps {
  onFilterChange: (filters: URLSearchParams) => void
}

export function Filter({ onFilterChange }: FilterProps) {
  const [searchParams] = useSearchParams()

  const handleCategoryToggle = <K extends keyof CategoryMap>(
    category: K,
    value: CategoryMap[K][number]
  ) => {
    const newParams = new URLSearchParams(searchParams)
    const current = newParams.getAll(category)
    const updated = toggleArrayElement(current, value)
    newParams.delete(category)
    updated.forEach(v => newParams.append(category, v))
    onFilterChange(newParams)
  }

  const handleSearch = (query: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (query) {
      newParams.set("nameQuery", query)
    } else {
      newParams.delete("nameQuery")
    }
    onFilterChange(newParams)
  }

  const clearFilters = () => {
    onFilterChange(new URLSearchParams())
  }

  const hasActiveFilters = searchParams.toString().length > 0

  return (
    <Box p={4} borderRadius="lg">
      <VStack gap={4} align="stretch">
        <Heading size="md">Filters</Heading>
        
        <SearchInput 
          value={searchParams.get("nameQuery") || ""} 
          onChange={handleSearch} 
        />

        <CategoryFilter<Type>
          displayName="Meeting Type"
          options={TYPE}
          selected={searchParams.getAll("type").filter((t): t is Type => t in TYPE)}
          onToggle={(value: Type) => handleCategoryToggle("type", value)}
        />

        <CategoryFilter<Format>
          displayName="Formats"
          options={FORMATS}
          selected={searchParams.getAll("formats").filter((f): f is Format => f in FORMATS)}
          onToggle={(value: Format) => handleCategoryToggle("formats", value)}
        />

        <CategoryFilter<Feature>
          displayName="Features"
          options={FEATURES}
          selected={searchParams.getAll("features").filter((f): f is Feature => f in FEATURES)}
          onToggle={(value: Feature) => handleCategoryToggle("features", value)}
        />

        <CategoryFilter<Community>
          displayName="Communities"
          options={COMMUNITIES}
          selected={searchParams.getAll("communities").filter((c): c is Community => c in COMMUNITIES)}
          onToggle={(value: Community) => handleCategoryToggle("communities", value)}
        />

        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={clearFilters}
          >
            <Flex align="center" gap={2}>
              <FaTimesCircle />
              <Text>Clear Filters</Text>
            </Flex>
          </Button>
        )}
      </VStack>
    </Box>
  )
}
