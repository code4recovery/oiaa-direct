import {
  useCallback,
  useState,
} from "react"

import {
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaTimesCircle,
} from "react-icons/fa"
import type { SetURLSearchParams } from "react-router"

import {
  getCurrentDay,
  getCurrentTimeFrame,
  updateQueryParams,
  updateTimeParams,
} from "@/utils/filter-utils"
import { toggleArrayElement } from "@/utils/meetings-utils"
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"

import { renderFilterGroups } from "./filterGroup"
import { SearchFilter } from "./SearchFilter"

interface FilterProps {
  filterParams: URLSearchParams
  sendFilterSelectionsToParent: ReturnType<() => SetURLSearchParams>
  variant: "mobile" | "desktop"
  showSearch?: boolean
  showTimeFilter?: boolean
  showClearButton?: boolean
}

export function Filter({
  filterParams,
  sendFilterSelectionsToParent,
  variant,
  showSearch = true,
  showTimeFilter = true,
  showClearButton = true,
}: FilterProps) {
  const isMobile = variant === "mobile"

  const defaultDay = getCurrentDay()
  const defaultTimeFrame = getCurrentTimeFrame()

  const [selectedDay, setSelectedDay] = useState<string>(defaultDay)
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<string>(defaultTimeFrame)

  const { open: filtersOpen, onToggle: onFiltersToggle } = useDisclosure({
    defaultOpen: false,
  })

  const timeDisclosure = useDisclosure({ defaultOpen: false })
  const typeDisclosure = useDisclosure({ defaultOpen: false })
  const formatsDisclosure = useDisclosure({ defaultOpen: false })
  const featuresDisclosure = useDisclosure({ defaultOpen: false })
  const communitiesDisclosure = useDisclosure({ defaultOpen: false })
  const languagesDisclosure = useDisclosure({ defaultOpen: false })

  const disclosureStates = {
    time: timeDisclosure,
    type: typeDisclosure,
    formats: formatsDisclosure,
    features: featuresDisclosure,
    communities: communitiesDisclosure,
    languages: languagesDisclosure,
  }

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

  const handleQueryChange = useCallback(
    (query: string) => {
      sendFilterSelectionsToParent((prev: URLSearchParams) =>
        updateQueryParams(prev, query)
      )
    },
    [sendFilterSelectionsToParent]
  )

  const handleTimeChange = (day: string, timeFrame: string) => {
    setSelectedDay(day)
    setSelectedTimeFrame(timeFrame)
    sendFilterSelectionsToParent((prev: URLSearchParams) =>
      updateTimeParams(prev, day, timeFrame)
    )
  }

  const handleToggle = (category: string) => (chosen: string) => {
    sendFilterSelectionsToParent((prev: URLSearchParams) => {
      const newOptions = toggleArrayElement(
        filterParams.getAll(category),
        chosen
      )
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

  return (
    <Box p={isMobile ? 0 : 4} borderRadius="lg">
      <VStack gap={4} align="stretch">
        {showSearch && (
          <SearchFilter
            initialValue={filterParams.get("nameQuery") ?? ""}
            onQueryChange={handleQueryChange}
          />
        )}

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

        {isMobile ? (
          <>
            <Button
              onClick={onFiltersToggle}
              variant="outline"
              size="sm"
              borderRadius="md"
              w="full"
              justifyContent="flex-start"
            >
              <Flex align="center" gap={2}>
                <FaFilter />
                <Text>Filters</Text>
                <Badge colorScheme="blue" variant="solid" borderRadius="full">
                  {hasActiveFilters ? 1 : 0}
                </Badge>
                {filtersOpen ? <FaChevronUp /> : <FaChevronDown />}
              </Flex>
            </Button>
            {filtersOpen && (
              <VStack gap={4} align="stretch">
                {renderFilterGroups({
                  filterParams,
                  selectedDay,
                  selectedTimeFrame,
                  handleTimeChange,
                  handleToggle,
                  handleExclusiveToggle,
                  showTimeFilter,
                  isMobile,
                  disclosureStates,
                })}
              </VStack>
            )}
          </>
        ) : (
          <>
            <Heading size="md" color="inherit">
              Filters
            </Heading>
            {renderFilterGroups({
              filterParams,
              selectedDay,
              selectedTimeFrame,
              handleTimeChange,
              handleToggle,
              handleExclusiveToggle,
              showTimeFilter,
              isMobile,
            })}
          </>
        )}
      </VStack>
    </Box>
  )
}
