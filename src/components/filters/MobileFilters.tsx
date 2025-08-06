import { useState, useEffect } from "react"

import type { WeekdayNumbers } from "luxon"
import { DateTime } from "luxon"
import {
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaTimes,
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
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"

import { CategoryFilter } from "./categoryFilter"
import { SearchInput } from "./SearchInput"

export interface MobileFiltersProps {
  filterParams: URLSearchParams
  sendFilterSelectionsToParent: ReturnType<() => SetURLSearchParams>
  totalMeetings: number
  shownMeetings: number
}

/**
 * Quick Filter Button Component
 */
const QuickFilterButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive?: boolean
  onClick: () => void
}) => (
  <Button
    size="sm"
    variant={isActive ? "solid" : "outline"}
    colorScheme={isActive ? "blue" : "gray"}
    onClick={onClick}
    borderRadius="full"
    px={4}
    h={8}
    fontSize="sm"
    fontWeight="medium"
    flexShrink={0}
  >
    {label}
  </Button>
)

/**
 * Filter Section Component with Accordion
 */
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

export const MobileFilters = ({
  filterParams,
  sendFilterSelectionsToParent,
  totalMeetings,
  shownMeetings,
}: MobileFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState(filterParams.get("nameQuery") ?? "")
  const [showMinCharWarning, setShowMinCharWarning] = useState(false)
  
  // Accordion state
  const { open: isFiltersOpen, onToggle: onFiltersToggle } = useDisclosure({ defaultOpen: false })
  const { open: isTimeOpen, onToggle: onTimeToggle } = useDisclosure({ defaultOpen: false })
  const { open: isTypesOpen, onToggle: onTypesToggle } = useDisclosure({ defaultOpen: false })
  const { open: isFormatsOpen, onToggle: onFormatsToggle } = useDisclosure({ defaultOpen: false })
  const { open: isFeaturesOpen, onToggle: onFeaturesToggle } = useDisclosure({ defaultOpen: false })
  const { open: isCommunitiesOpen, onToggle: onCommunitiesToggle } = useDisclosure({ defaultOpen: false })
  const { open: isLanguagesOpen, onToggle: onLanguagesToggle } = useDisclosure({ defaultOpen: false })

  // Mobile vs Desktop display (reserved for future use)

  const timeFrames = {
    morning: { start: "04:00", end: "10:59", hours: 7 },
    midday: { start: "11:00", end: "12:59", hours: 2 },
    afternoon: { start: "13:00", end: "16:59", hours: 4 },
    evening: { start: "17:00", end: "20:59", hours: 4 },
    night: { start: "21:00", end: "03:59", hours: 7 },
  }

  const currentHour = DateTime.local().hour
  const defaultTimeFrame =
    currentHour >= 4 && currentHour < 11
      ? "morning"
      : currentHour >= 11 && currentHour < 13
      ? "midday"
      : currentHour >= 13 && currentHour < 17
      ? "afternoon"
      : currentHour >= 17 && currentHour < 21
      ? "evening"
      : "night"

  const defaultDay = DateTime.local().toFormat("cccc").toLowerCase()
  const [selectedDay, setSelectedDay] = useState<string>(defaultDay)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>(defaultTimeFrame)

  // Search debouncing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const sendQueryToParent = (query: string) => {
        sendFilterSelectionsToParent((prev: URLSearchParams) => {
          const next = new URLSearchParams(prev)
          if (query.length > 2) {
            next.set("nameQuery", query)
          } else if (query.length === 0) {
            next.delete("nameQuery")
          }
          return next
        })
      }
      sendQueryToParent(searchQuery)
    }, 300)

    setShowMinCharWarning(searchQuery.length > 0 && searchQuery.length < 3)
    return () => clearTimeout(delayDebounce)
  }, [searchQuery, sendFilterSelectionsToParent])

  // Active filter counts
  const activeFilters = {
    types: filterParams.getAll("type").length,
    formats: filterParams.getAll("formats").length,
    features: filterParams.getAll("features").length,
    communities: filterParams.getAll("communities").length,
    languages: filterParams.getAll("languages").length,
  }

  const totalActiveFilters = Object.values(activeFilters).reduce((sum, count) => sum + count, 0) +
    (searchQuery ? 1 : 0) +
    (selectedDay !== defaultDay ? 1 : 0) +
    (selectedTimeFrame !== defaultTimeFrame ? 1 : 0)

  const hasActiveFilters = totalActiveFilters > 0

  // Quick Actions
  const setQuickFilter = (type: 'now' | 'today' | 'thisWeek') => {
    const now = DateTime.local()
    
    switch (type) {
      case 'now':
        // Next 2 hours from now
        sendFilterSelectionsToParent((prev: URLSearchParams) => {
          const next = new URLSearchParams(prev)
          next.set("start", now.toUTC().toISO()!)
          next.set("hours", "2")
          return next
        })
        setSelectedTimeFrame(defaultTimeFrame)
        setSelectedDay(defaultDay)
        break
      
      case 'today':
        // Rest of today
        const startOfToday = now.startOf('day').plus({ hours: now.hour })
        sendFilterSelectionsToParent((prev: URLSearchParams) => {
          const next = new URLSearchParams(prev)
          next.set("start", startOfToday.toUTC().toISO()!)
          next.set("hours", (24 - now.hour).toString())
          return next
        })
        setSelectedDay(defaultDay)
        setSelectedTimeFrame(defaultTimeFrame)
        break
      
      case 'thisWeek':
        // Rest of this week
        sendFilterSelectionsToParent((prev: URLSearchParams) => {
          const next = new URLSearchParams(prev)
          next.set("start", now.toUTC().toISO()!)
          next.set("hours", "168") // 7 days
          return next
        })
        setSelectedDay(defaultDay)
        setSelectedTimeFrame(defaultTimeFrame)
        break
    }
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedDay(defaultDay)
    setSelectedTimeFrame(defaultTimeFrame)
    sendFilterSelectionsToParent(new URLSearchParams())
  }

  // Handler functions
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

  const handleDayTimeChange = (day: string, timeFrame: string) => {
    setSelectedDay(day)
    setSelectedTimeFrame(timeFrame)

    const weekdayMap: Record<string, number> = {
      monday: 1, tuesday: 2, wednesday: 3, thursday: 4,
      friday: 5, saturday: 6, sunday: 7,
    }

    const targetWeekday = weekdayMap[day.toLowerCase()]
    const now = DateTime.local()

    let selectedHour = 0
    let selectedMinute = 0
    if (timeFrame in timeFrames) {
      const { start } = timeFrames[timeFrame as keyof typeof timeFrames]
      selectedHour = parseInt(start.split(":")[0], 10)
      selectedMinute = parseInt(start.split(":")[1], 10)
    }

    let targetDate = now.set({
      weekday: targetWeekday as WeekdayNumbers,
      hour: selectedHour,
      minute: selectedMinute,
      second: 0,
      millisecond: 0,
    })

    if (
      now.weekday === targetWeekday &&
      (now.hour > selectedHour || (now.hour === selectedHour && now.minute >= selectedMinute))
    ) {
      targetDate = targetDate.plus({ weeks: 1 })
    } else if (now.weekday > targetWeekday) {
      targetDate = targetDate.plus({ weeks: 1 })
    }

    if (timeFrame in timeFrames) {
      const { hours } = timeFrames[timeFrame as keyof typeof timeFrames]
      const utcStart = targetDate.toUTC().toISO()
      sendFilterSelectionsToParent((prev: URLSearchParams) => {
        if (utcStart) {
          prev.set("start", utcStart)
        }
        prev.set("hours", hours.toString())
        return prev
      })
    }
  }

  return (
    <Box>
      {/* Filter Toggle Button + Quick Actions */}
      <VStack gap={3} align="stretch">
        
        {/* Search Bar - Always Visible */}
        <Box>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            isInvalid={showMinCharWarning}
          />
          {showMinCharWarning && (
            <Text fontSize="xs" color="red.500" mt={1}>
              Enter at least 3 characters.
            </Text>
          )}
        </Box>

        {/* Filter Toggle + Status */}
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
              {hasActiveFilters && (
                <Badge colorScheme="blue" variant="solid" borderRadius="full">
                  {totalActiveFilters}
                </Badge>
              )}
              {isFiltersOpen ? <FaChevronUp /> : <FaChevronDown />}
            </Flex>
          </Button>
          
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            {shownMeetings} of {totalMeetings} meetings
          </Text>
        </Flex>

        {/* Quick Actions - Always Visible */}
        <Box overflowX="auto" pb={1}>
          <HStack gap={2} minW="fit-content">
            <QuickFilterButton label="Now" onClick={() => setQuickFilter('now')} />
            <QuickFilterButton label="Today" onClick={() => setQuickFilter('today')} />
            <QuickFilterButton label="This Week" onClick={() => setQuickFilter('thisWeek')} />
            {hasActiveFilters && (
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={clearAllFilters}
                borderRadius="full"
                px={4}
                h={8}
                fontSize="sm"
                flexShrink={0}
              >
                <Flex align="center" gap={1}>
                  <FaTimes />
                  <Text>Clear All</Text>
                </Flex>
              </Button>
            )}
          </HStack>
        </Box>

        {/* Applied Filters Display */}
        {hasActiveFilters && (
          <Flex wrap="wrap" gap={1}>
            {searchQuery && (
              <Badge variant="solid" colorScheme="blue" borderRadius="full" fontSize="xs">
                Search: "{searchQuery.slice(0, 20)}{searchQuery.length > 20 ? '...' : ''}"
              </Badge>
            )}
            {selectedDay !== defaultDay && (
              <Badge variant="solid" colorScheme="blue" borderRadius="full" fontSize="xs">
                {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
              </Badge>
            )}
            {selectedTimeFrame !== defaultTimeFrame && (
              <Badge variant="solid" colorScheme="blue" borderRadius="full" fontSize="xs">
                {selectedTimeFrame.charAt(0).toUpperCase() + selectedTimeFrame.slice(1)}
              </Badge>
            )}
          </Flex>
        )}

        {/* Collapsible Filter Sections */}
        {isFiltersOpen && (
          <VStack gap={3} align="stretch">
            
            {/* Day & Time Section */}
            <FilterSection
              title="Day & Time"
              isOpen={isTimeOpen}
              onToggle={onTimeToggle}
              badge={
                (selectedDay !== defaultDay ? 1 : 0) +
                (selectedTimeFrame !== defaultTimeFrame ? 1 : 0)
              }
            >
              <VStack gap={3} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Day:
                  </Text>
                  <Box
                    as="select"
                    {...({ 
                      value: selectedDay, 
                      onChange: (e: any) => handleDayTimeChange(e.target.value, selectedTimeFrame) 
                    } as any)}
                    w="full"
                    p={2}
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    bg="white"
                    fontSize="sm"
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.600",
                      color: "white"
                    }}
                  >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </Box>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Time:
                  </Text>
                  <Box
                    as="select"
                    {...({ 
                      value: selectedTimeFrame, 
                      onChange: (e: any) => handleDayTimeChange(selectedDay, e.target.value) 
                    } as any)}
                    w="full"
                    p={2}
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    bg="white"
                    fontSize="sm"
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.600",
                      color: "white"
                    }}
                  >
                    <option value="morning">Morning (4-11 AM)</option>
                    <option value="midday">Midday (11 AM-1 PM)</option>
                    <option value="afternoon">Afternoon (1-5 PM)</option>
                    <option value="evening">Evening (5-9 PM)</option>
                    <option value="night">Night (9 PM-4 AM)</option>
                  </Box>
                </Box>
              </VStack>
            </FilterSection>

            {/* Meeting Types */}
            <FilterSection
              title="Meeting Types"
              isOpen={isTypesOpen}
              onToggle={onTypesToggle}
              badge={activeFilters.types}
            >
              <CategoryFilter<Type>
                displayName=""
                options={TYPE}
                selected={filterParams.getAll("type") as Type[]}
                onToggle={handleExclusiveToggle("type")}
              />
            </FilterSection>

            {/* Formats */}
            <FilterSection
              title="Formats"
              isOpen={isFormatsOpen}
              onToggle={onFormatsToggle}
              badge={activeFilters.formats}
            >
              <CategoryFilter<Format>
                displayName=""
                options={FORMATS}
                selected={filterParams.getAll("formats") as Format[]}
                onToggle={handleToggle("formats")}
              />
            </FilterSection>

            {/* Features */}
            <FilterSection
              title="Features"
              isOpen={isFeaturesOpen}
              onToggle={onFeaturesToggle}
              badge={activeFilters.features}
            >
              <CategoryFilter<Feature>
                displayName=""
                options={FEATURES}
                selected={filterParams.getAll("features") as Feature[]}
                onToggle={handleToggle("features")}
              />
            </FilterSection>

            {/* Communities */}
            <FilterSection
              title="Communities"
              isOpen={isCommunitiesOpen}
              onToggle={onCommunitiesToggle}
              badge={activeFilters.communities}
            >
              <CategoryFilter<Community>
                displayName=""
                options={COMMUNITIES}
                selected={filterParams.getAll("communities") as Community[]}
                onToggle={handleToggle("communities")}
              />
            </FilterSection>

            {/* Languages */}
            <FilterSection
              title="Languages"
              isOpen={isLanguagesOpen}
              onToggle={onLanguagesToggle}
              badge={activeFilters.languages}
            >
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

export default MobileFilters