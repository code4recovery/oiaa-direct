import { useState } from "react"

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
  sendQueryToParent,
}: FilterProps) {
  const [searchQueryEntry, setSearchQueryEntry] = useState<string>("")

  const timeFrames = {
    morning: { start: "04:00", end: "10:59", hours: 7 },
    midday: { start: "11:00", end: "12:59", hours: 2 },
    afternoon: { start: "13:00", end: "16:59", hours: 4 },
    evening: { start: "17:00", end: "20:59", hours: 4 },
    night: { start: "21:00", end: "03:59", hours: 7 },
  }

  // Determine the default time frame based on the current local time
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

  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<string>(defaultTimeFrame)

  const activeTypes =
    filterParams.getAll("features").length > 0 ||
    filterParams.getAll("formats").length > 0 ||
    filterParams.getAll("type").length > 0 ||
    filterParams.getAll("communities").length > 0

  const hasActiveFilters = searchQueryEntry || activeTypes

  const clearFilters = () => {
    setSearchQueryEntry("")
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

  const handleFormatToggle = (formatOption: string) => {
    handleToggle("formats")(formatOption)
  }

  const handleFeatureToggle = (featureOption: string) => {
    handleToggle("features")(featureOption)
  }

  const handleTypeToggle = (typeOption: string) => {
    handleToggle("type")(typeOption)
  }

  const handleCommunityToggle = (communityOption: string) => {
    handleToggle("communities")(communityOption)
  }

  const handleTimeFrameChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value as keyof typeof timeFrames
    setSelectedTimeFrame(value)

    if (value in timeFrames) {
      const { start, hours } = timeFrames[value]

      // Get the selected day from the "day" dropdown
      const selectedDay = document.getElementById("day") as HTMLSelectElement
      const selectedWeekday = selectedDay.value

      // Map weekdays to Luxon's weekday numbers (1 = Monday, 7 = Sunday)
      const weekdayMap: Record<string, number> = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 7,
      }

      const targetWeekday = weekdayMap[selectedWeekday.toLowerCase()]
      const now = DateTime.local()

      // Calculate the next occurrence of the selected weekday
      let targetDate = now.set({
        weekday: targetWeekday as WeekdayNumbers,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      if (targetDate <= now) {
        targetDate = targetDate.plus({ weeks: 1 })
      }

      // Combine the target date with the "start" time
      const utcStart = targetDate
        .set({
          hour: parseInt(start.split(":")[0], 10),
          minute: parseInt(start.split(":")[1], 10),
        })
        .toUTC()
        .toISO()

      sendFilterSelectionsToParent((prev: URLSearchParams) => {
        if (utcStart) {
          prev.set("start", utcStart) // Set the UTC timestamp
        }
        prev.set("hours", hours.toString())
        return prev
      })
    }
  }

  const handleInputChange = (value: string) => {
    setSearchQueryEntry(value)
    if (value.length > 2) sendQueryToParent(value)
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
              defaultValue={DateTime.local().toFormat("cccc").toLowerCase()}
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
              onChange={handleTimeFrameChange}
            >
              <option value="morning">Morning</option>
              <option value="midday">Midday</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </Box>
          <SearchInput value={searchQueryEntry} onChange={handleInputChange} />
          <Box>
            <Heading size="sm" mb={2} color="inherit">
              Languages
            </Heading>
          </Box>
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
