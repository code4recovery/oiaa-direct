import React, { useState } from "react"

import {
  DateTime,
  type WeekdayNumbers,
} from "luxon"
import type { SetURLSearchParams } from "react-router"

import { targetTimestamp } from "@/utils/date-and-time-utils"
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"

interface FullSearchProps {
  filterParams: URLSearchParams
  sendFilterSelectionsToParent: ReturnType<() => SetURLSearchParams>
}

export function FullSearch({
  filterParams,
  sendFilterSelectionsToParent,
}: FullSearchProps) {
  const today = DateTime.local().toFormat("cccc").toLowerCase()

  const now = DateTime.local()
  const [hour, setHour] = useState(now.toFormat("HH"))
  const [minute, setMinute] = useState(
    Math.round(now.minute / 15) * 15 === 60
      ? "00"
      : String(Math.round(now.minute / 15) * 15).padStart(2, "0")
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const day = formData.get("day") as string
    const dayNumber = DateTime.fromFormat(day, "cccc").weekday as WeekdayNumbers
    const utcTime = targetTimestamp({
      localWeekday: dayNumber,
      localHour: Number(hour),
      localMinute: Number(minute),
    })

    const newParams = new URLSearchParams(filterParams)
    newParams.set("start", utcTime.toString())
    sendFilterSelectionsToParent(newParams)
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
            Expand your search
          </Heading>
          <Text>Select additional options, then submit!</Text>
          <form onSubmit={handleSubmit}>
            <VStack align="stretch" gap={4}>
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Day:
                </Text>
                <select id="day" name="day" defaultValue={today}>
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
                  Start Time:
                </Text>
                <VStack align="stretch" gap={2}>
                  <select
                    value={hour}
                    onChange={(e) => {
                      setHour(e.target.value)
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={String(i).padStart(2, "0")}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <select
                    value={minute}
                    onChange={(e) => {
                      setMinute(e.target.value)
                    }}
                  >
                    {["00", "15", "30", "45"].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </VStack>
              </Box>

              <Box textAlign="center">
                <Button type="submit" colorScheme="blue" size="md">
                  Submit
                </Button>
              </Box>
            </VStack>
          </form>
        </VStack>
      </Box>
    </>
  )
}

export default FullSearch
