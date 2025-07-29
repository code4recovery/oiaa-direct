import {
  useEffect,
  useState,
} from "react"

import type { WeekdayNumbers } from "luxon"
import { DateTime } from "luxon"
import { FaTimesCircle } from "react-icons/fa"
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
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"

import { CategoryFilter } from "./categoryFilter"
import { SearchInput } from "./SearchInput"

interface FilterProps {
  filterParams: URLSearchParams
  sendFilterSelectionsToParent: ReturnType<() => SetURLSearchParams>
  sendQueryToParent: (x: string) => void
}

export function Filter({
  filterParams,
  sendFilterSelectionsToParent,
}: FilterProps) {
  const [searchQueryEntry, setSearchQueryEntry] = useState(filterParams.get("nameQuery") ?? "")
  const [showMinCharWarning, setShowMinCharWarning] = useState(false)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
        sendQueryToParent(searchQueryEntry)
    }, 300)

    // Update warning state on render and not just on change
    // This ensures the warning is shown if the initial value is less than 3 characters
    setShowMinCharWarning(searchQueryEntry.length > 0 && searchQueryEntry.length < 3)

    const sendQueryToParent = (query: string) => {
      sendFilterSelectionsToParent((prev: URLSearchParams) => {
        const next = new URLSearchParams(prev)

        if (query.length > 2) {
          next.set("nameQuery", query)
        } else if (query.length == 0){
          next.delete("nameQuery")
        }
      return next
      })
    }

      return () => { clearTimeout(delayDebounce) }
  }, [searchQueryEntry, sendFilterSelectionsToParent])

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
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<string>(defaultTimeFrame)

  const activeTypes =
    filterParams.getAll("features").length > 0 ||
    filterParams.getAll("formats").length > 0 ||
    filterParams.getAll("type").length > 0 ||
    filterParams.getAll("communities").length > 0 ||
    filterParams.getAll("languages").length > 0

  const hasActiveFilters =
    searchQueryEntry ||
    activeTypes ||
    selectedDay !== defaultDay ||
    selectedTimeFrame !== defaultTimeFrame

  const clearFilters = () => {
    setSearchQueryEntry("")
    setSelectedDay(defaultDay)
    setSelectedTimeFrame(defaultTimeFrame)
    sendFilterSelectionsToParent({})
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

  const handleFormatToggle = (formatOption: string) => {
    handleToggle("formats")(formatOption)
  }

  const handleFeatureToggle = (featureOption: string) => {
    handleToggle("features")(featureOption)
  }

  const handleTypeToggle = (typeOption: string) => {
    handleExclusiveToggle("type")(typeOption)
  }

  const handleCommunityToggle = (communityOption: string) => {
    handleToggle("communities")(communityOption)
  }

  const handleDayOrTimeFrameChange = () => {
    const timeFrameSelect = document.getElementById(
      "timeFrame"
    ) as HTMLSelectElement
    const daySelect = document.getElementById("day") as HTMLSelectElement
    const value = timeFrameSelect.value
    const dayValue = daySelect.value

    setSelectedTimeFrame(value)
    setSelectedDay(dayValue)

    const weekdayMap: Record<string, number> = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 7,
    }

    const targetWeekday = weekdayMap[dayValue.toLowerCase()]
    const now = DateTime.local()

    let selectedHour = 0
    let selectedMinute = 0
    if (value in timeFrames) {
      const { start } = timeFrames[value as keyof typeof timeFrames]
      selectedHour = parseInt(start.split(":")[0], 10)
      selectedMinute = parseInt(start.split(":")[1], 10)
    } else {
      const [hour, minute] = value.split(":").map(Number)
      selectedHour = hour
      selectedMinute = minute
    }

    let targetDate = now.set({
      weekday: targetWeekday as WeekdayNumbers,
      hour: selectedHour,
      minute: selectedMinute,
      second: 0,
      millisecond: 0,
    })

    // Only advance to next week if today and the local time is later than the selected time
    if (
      now.weekday === targetWeekday &&
      (now.hour > selectedHour ||
        (now.hour === selectedHour && now.minute >= selectedMinute))
    ) {
      targetDate = targetDate.plus({ weeks: 1 })
    } else if (now.weekday > targetWeekday) {
      targetDate = targetDate.plus({ weeks: 1 })
    }

    if (value in timeFrames) {
      const { hours } = timeFrames[value as keyof typeof timeFrames]
      const utcStart = targetDate.toUTC().toISO()

      sendFilterSelectionsToParent((prev: URLSearchParams) => {
        if (utcStart) {
          prev.set("start", utcStart)
        }
        prev.set("hours", hours.toString())
        return prev
      })
    } else {
      const utcStart = targetDate.toUTC().toISO()

      sendFilterSelectionsToParent((prev: URLSearchParams) => {
        if (utcStart) {
          prev.set("start", utcStart)
        }
        prev.set("hours", "1")
        return prev
      })
    }
  }

  const handleLanguageToggle = (languageOption: string) => {
    handleToggle("languages")(languageOption)
  }

  const handleInputChange = (value: string) => {
    setSearchQueryEntry(value)
  }

  return (
    <>
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
          <Box>
            <Text fontWeight="bold" mb={2}>
              Day:
            </Text>
            <select
              id="day"
              name="day"
              value={selectedDay}
              onChange={handleDayOrTimeFrameChange}
            >
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </Box>
          <Box>
            <Text fontWeight="bold" mb={2}>
              Time Frame:
            </Text>
            <select
              id="timeFrame"
              name="timeFrame"
              value={selectedTimeFrame}
              onChange={handleDayOrTimeFrameChange}
            >
              <option value="morning">Morning</option>
              <option value="midday">Midday</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
              <option disabled>──────────</option>
              {Array.from({ length: 24 }).map((_, hour) => {
                const dt = DateTime.fromObject({ hour, minute: 0 })
                const label = dt.toLocaleString(DateTime.TIME_SIMPLE)
                const value = dt.toFormat("HH:mm")
                return (
                  <option value={value} key={value}>
                    {label}
                  </option>
                )
              })}
            </select>
          </Box>
          <SearchInput
            value={searchQueryEntry}
            onChange={handleInputChange}
            isInvalid={showMinCharWarning}
          />
          {showMinCharWarning && (
            <Text fontSize="sm" color="red.500" mt={0}>
              Enter at least 3 characters.
            </Text>
          )}
          <CategoryFilter<Type>
            displayName={"Meeting Type"}
            options={TYPE}
            selected={filterParams.getAll("type") as Type[]}
            onToggle={handleTypeToggle}
          />
          <CategoryFilter<Format>
            displayName={"Formats"}
            options={FORMATS}
            selected={filterParams.getAll("formats") as Format[]}
            onToggle={handleFormatToggle}
          />
          <CategoryFilter<Feature>
            displayName={"Features"}
            options={FEATURES}
            selected={filterParams.getAll("features") as Feature[]}
            onToggle={handleFeatureToggle}
          />
          <CategoryFilter<Community>
            displayName={"Communities"}
            options={COMMUNITIES}
            selected={filterParams.getAll("communities") as Community[]}
            onToggle={handleCommunityToggle}
          />
          <CategoryFilter<Language>
            displayName={"Languages"}
            options={LANGUAGES}
            selected={filterParams.getAll("languages") as Language[]}
            onToggle={handleLanguageToggle}
          />
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="gray"
              onClick={clearFilters}
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
    </>
  )
}
