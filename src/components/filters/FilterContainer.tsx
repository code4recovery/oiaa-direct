import { useState, useCallback } from "react"
import {
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaTimesCircle,
} from "react-icons/fa"
import type { SetURLSearchParams } from "react-router"

import {
  COMMUNITIES,
  type Community,
  type Feature,
  FEATURES,
  type Format,
  FORMATS,
  type Language,
  LANGUAGES,
  type Type,
  TYPE,
} from "@/meetingTypes"
import { toggleArrayElement } from "@/utils/meetings-utils"
import {
  getCurrentDay,
  getCurrentTimeFrame,
  updateQueryParams,
  updateTimeParams,
} from "@/utils/filter-utils"
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"

import { CategoryFilter } from "./categoryFilter"
import { SearchFilter } from "./SearchFilter"
import { TimeFilter } from "./TimeFilter"

interface FilterContainerProps {
  filterParams: URLSearchParams
  sendFilterSelectionsToParent: ReturnType<() => SetURLSearchParams>
  variant: "mobile" | "desktop"
  totalMeetings?: number
  shownMeetings?: number
  showSearch?: boolean
  showTimeFilter?: boolean
  showClearButton?: boolean
  collapsible?: boolean
}

const FilterSection = ({
  title,
  isOpen,
  onToggle,
  children,
  badge,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  badge?: number
}) => (
  <Box borderWidth="1px" borderColor="gray.200" _dark={{ borderColor: "gray.700" }} borderRadius="md">
    <Button
      w="full"
      h="auto"
      p={3}
      variant="ghost"
      onClick={onToggle}
      justifyContent="space-between"
      fontWeight="medium"
      fontSize="sm"
      borderRadius="md"
      _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
    >
      <Flex align="center" gap={2}>
        <Text>{title}</Text>
        {badge && badge > 0 && (
          <Badge colorScheme="blue" variant="solid" borderRadius="full" px={2} py={0.5} fontSize="xs">
            {badge}
          </Badge>
        )}
      </Flex>
      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
    </Button>
    {isOpen && (
      <Box p={3} pt={0}>
        {children}
      </Box>
    )}
  </Box>
)

export function FilterContainer({
  filterParams,
  sendFilterSelectionsToParent,
  variant,
  totalMeetings,
  shownMeetings,
  showSearch = true,
  showTimeFilter = true,
  showClearButton = true,
  collapsible: _collapsible = false
}: FilterContainerProps) {
  const isMobile = variant === "mobile"
  
  const defaultDay = getCurrentDay()
  const defaultTimeFrame = getCurrentTimeFrame()
  
  const [selectedDay, setSelectedDay] = useState<string>(defaultDay)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>(defaultTimeFrame)

  const { open: isFiltersOpen, onToggle: onFiltersToggle } = useDisclosure({ defaultOpen: false })
  const { open: isTimeOpen, onToggle: onTimeToggle } = useDisclosure({ defaultOpen: false })
  const { open: isTypesOpen, onToggle: onTypesToggle } = useDisclosure({ defaultOpen: false })
  const { open: isFormatsOpen, onToggle: onFormatsToggle } = useDisclosure({ defaultOpen: false })
  const { open: isFeaturesOpen, onToggle: onFeaturesToggle } = useDisclosure({ defaultOpen: false })
  const { open: isCommunitiesOpen, onToggle: onCommunitiesToggle } = useDisclosure({ defaultOpen: false })
  const { open: isLanguagesOpen, onToggle: onLanguagesToggle } = useDisclosure({ defaultOpen: false })

  const activeTypes =
    filterParams.getAll("features").length > 0 ||
    filterParams.getAll("formats").length > 0 ||
    filterParams.getAll("type").length > 0 ||
    filterParams.getAll("communities").length > 0 ||
    filterParams.getAll("languages").length > 0

  const hasActiveFilters =
    Boolean(filterParams.get("nameQuery")) ||
    activeTypes ||
    selectedDay !== defaultDay ||
    selectedTimeFrame !== defaultTimeFrame


  const handleQueryChange = useCallback((query: string) => {
    sendFilterSelectionsToParent((prev: URLSearchParams) => updateQueryParams(prev, query))
  }, [sendFilterSelectionsToParent])

  const handleTimeChange = (day: string, timeFrame: string) => {
    setSelectedDay(day)
    setSelectedTimeFrame(timeFrame)
    sendFilterSelectionsToParent((prev: URLSearchParams) => updateTimeParams(prev, day, timeFrame))
  }

  const handleToggle = (category: string) => (chosen: string) => {
    sendFilterSelectionsToParent((prev: URLSearchParams) => {
      const newOptions = toggleArrayElement(filterParams.getAll(category), chosen)
      prev.delete(category)
      newOptions.forEach((option) => {
        prev.append(category, option)
      })
      return prev
    })
  }

  const handleExclusiveToggle = (category: string) => (chosen: string) => {
    sendFilterSelectionsToParent((prev: URLSearchParams) => {
      const currentSelections = filterParams.getAll(category)
      const isAlreadySelected = currentSelections.includes(chosen)
      prev.delete(category)
      if (!isAlreadySelected) {
        prev.append(category, chosen)
      }
      return prev
    })
  }

  const clearAllFilters = () => {
    setSelectedDay(defaultDay)
    setSelectedTimeFrame(defaultTimeFrame)
    sendFilterSelectionsToParent(new URLSearchParams())
  }


  if (isMobile) {
    return (
      <Box>
        <VStack gap={3} align="stretch">
          {showSearch && (
            <SearchFilter
              initialValue={filterParams.get("nameQuery") ?? ""}
              onQueryChange={handleQueryChange}
            />
          )}

          <Flex align="center" justify="space-between" gap={3}>
            <Button
              onClick={onFiltersToggle}
              variant="outline"
              size="sm"
              borderRadius="md"
            >
              <Flex align="center" gap={2}>
                <FaFilter />
                <Text>Filters</Text>
                <Badge colorScheme="blue" variant="solid" borderRadius="full">
                  0
                </Badge>
                {isFiltersOpen ? <FaChevronUp /> : <FaChevronDown />}
              </Flex>
            </Button>
            
            {totalMeetings !== undefined && shownMeetings !== undefined && (
              <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                {shownMeetings} of {totalMeetings} meetings
              </Text>
            )}
          </Flex>

          {isFiltersOpen && (
            <VStack gap={3} align="stretch">
              {showTimeFilter && (
                <FilterSection
                  title="Day & Time"
                  isOpen={isTimeOpen}
                  onToggle={onTimeToggle}
                >
                  <TimeFilter
                    selectedDay={selectedDay}
                    selectedTimeFrame={selectedTimeFrame}
                    onDayChange={(day) => {
                      handleTimeChange(day, selectedTimeFrame)
                    }}
                    onTimeFrameChange={(timeFrame) => {
                      handleTimeChange(selectedDay, timeFrame)
                    }}
                    variant="mobile"
                  />
                </FilterSection>
              )}

              <FilterSection title="Meeting Types" isOpen={isTypesOpen} onToggle={onTypesToggle}>
                <CategoryFilter<Type>
                  displayName=""
                  options={TYPE}
                  selected={filterParams.getAll("type") as Type[]}
                  onToggle={handleExclusiveToggle("type")}
                />
              </FilterSection>

              <FilterSection title="Formats" isOpen={isFormatsOpen} onToggle={onFormatsToggle}>
                <CategoryFilter<Format>
                  displayName=""
                  options={FORMATS}
                  selected={filterParams.getAll("formats") as Format[]}
                  onToggle={handleToggle("formats")}
                />
              </FilterSection>

              <FilterSection title="Features" isOpen={isFeaturesOpen} onToggle={onFeaturesToggle}>
                <CategoryFilter<Feature>
                  displayName=""
                  options={FEATURES}
                  selected={filterParams.getAll("features") as Feature[]}
                  onToggle={handleToggle("features")}
                />
              </FilterSection>

              <FilterSection title="Communities" isOpen={isCommunitiesOpen} onToggle={onCommunitiesToggle}>
                <CategoryFilter<Community>
                  displayName=""
                  options={COMMUNITIES}
                  selected={filterParams.getAll("communities") as Community[]}
                  onToggle={handleToggle("communities")}
                />
              </FilterSection>

              <FilterSection title="Languages" isOpen={isLanguagesOpen} onToggle={onLanguagesToggle}>
                <CategoryFilter<Language>
                  displayName=""
                  options={LANGUAGES}
                  selected={filterParams.getAll("languages") as Language[]}
                  onToggle={handleToggle("languages")}
                />
              </FilterSection>
            </VStack>
          )}
        </VStack>
      </Box>
    )
  }

  
  return (
    <Box
      p={4}
      borderRadius="lg"
      _dark={{
        borderColor: "whiteAlpha.200",
      }}
    >
      <VStack gap={4} align="stretch">
        <Heading size="md" color="inherit">
          Filters
        </Heading>

        {showTimeFilter && (
          <TimeFilter
            selectedDay={selectedDay}
            selectedTimeFrame={selectedTimeFrame}
            onDayChange={(day) => {
              handleTimeChange(day, selectedTimeFrame)
            }}
            onTimeFrameChange={(timeFrame) => {
              handleTimeChange(selectedDay, timeFrame)
            }}
            variant="desktop"
          />
        )}

        {showSearch && (
          <SearchFilter
            initialValue={filterParams.get("nameQuery") ?? ""}
            onQueryChange={handleQueryChange}
          />
        )}

        <CategoryFilter<Type>
          displayName="Meeting Type"
          options={TYPE}
          selected={filterParams.getAll("type") as Type[]}
          onToggle={handleExclusiveToggle("type")}
        />

        <CategoryFilter<Format>
          displayName="Formats"
          options={FORMATS}
          selected={filterParams.getAll("formats") as Format[]}
          onToggle={handleToggle("formats")}
        />

        <CategoryFilter<Feature>
          displayName="Features"
          options={FEATURES}
          selected={filterParams.getAll("features") as Feature[]}
          onToggle={handleToggle("features")}
        />

        <CategoryFilter<Community>
          displayName="Communities"
          options={COMMUNITIES}
          selected={filterParams.getAll("communities") as Community[]}
          onToggle={handleToggle("communities")}
        />

        <CategoryFilter<Language>
          displayName="Languages"
          options={LANGUAGES}
          selected={filterParams.getAll("languages") as Language[]}
          onToggle={handleToggle("languages")}
        />

        {showClearButton && hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={clearAllFilters}
            color="gray.600"
            _dark={{
              color: "gray.200",
              _hover: { bg: "whiteAlpha.200" },
            }}
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
