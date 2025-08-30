import { DateTime } from "luxon"
import {
  Box,
  Text,
  VStack,
} from "@chakra-ui/react"

export type TimeFilterVariant = "mobile" | "desktop"

export interface TimeFilterProps {
  selectedDay: string
  selectedTimeFrame: string
  onDayChange: (day: string) => void
  onTimeFrameChange: (timeFrame: string) => void
  variant: TimeFilterVariant
  showLabels?: boolean
}

const DAY_OPTIONS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
]

const TIME_FRAME_OPTIONS = [
  { value: "morning", label: "Morning (4-11 AM)" },
  { value: "midday", label: "Midday (11 AM-1 PM)" },
  { value: "afternoon", label: "Afternoon (1-5 PM)" },
  { value: "evening", label: "Evening (5-9 PM)" },
  { value: "night", label: "Night (9 PM-4 AM)" },
]

const SelectField = ({
  label,
  value,
  onChange,
  options,
  showLabel = true,
  includeHourlyOptions = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  showLabel?: boolean
  includeHourlyOptions?: boolean
}) => {
  return (
    <Box>
      {showLabel && (
        <Text fontSize="sm" fontWeight="medium" mb={2}>
          {label}:
        </Text>
      )}
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #E5E7EB",
          borderRadius: "6px",
          fontSize: "14px",
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {includeHourlyOptions && (
          <>
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
          </>
        )}
      </select>
    </Box>
  )
}

const MobileTimeFilter = ({
  selectedDay,
  selectedTimeFrame,
  onDayChange,
  onTimeFrameChange,
  showLabels = true,
}: {
  selectedDay: string
  selectedTimeFrame: string
  onDayChange: (day: string) => void
  onTimeFrameChange: (timeFrame: string) => void
  showLabels?: boolean
}) => {
  return (
    <VStack gap={3} align="stretch">
      <SelectField
        label="Day"
        value={selectedDay}
        onChange={onDayChange}
        options={DAY_OPTIONS}
        showLabel={showLabels}
        includeHourlyOptions={false}
      />
      <SelectField
        label="Time"
        value={selectedTimeFrame}
        onChange={onTimeFrameChange}
        options={TIME_FRAME_OPTIONS}
        showLabel={showLabels}
        includeHourlyOptions={false}
      />
    </VStack>
  )
}

const DesktopTimeFilter = ({
  selectedDay,
  selectedTimeFrame,
  onDayChange,
  onTimeFrameChange,
  showLabels = true,
}: {
  selectedDay: string
  selectedTimeFrame: string
  onDayChange: (day: string) => void
  onTimeFrameChange: (timeFrame: string) => void
  showLabels?: boolean
}) => {
  return (
    <VStack gap={4} align="stretch">
      <SelectField
        label="Day"
        value={selectedDay}
        onChange={onDayChange}
        options={DAY_OPTIONS}
        showLabel={showLabels}
        includeHourlyOptions={false}
      />
      <SelectField
        label="Time Frame"
        value={selectedTimeFrame}
        onChange={onTimeFrameChange}
        options={TIME_FRAME_OPTIONS}
        showLabel={showLabels}
        includeHourlyOptions={true}
      />
    </VStack>
  )
}

export function TimeFilter({
  selectedDay,
  selectedTimeFrame,
  onDayChange,
  onTimeFrameChange,
  variant,
  showLabels = true,
}: TimeFilterProps) {
  switch (variant) {
    case "mobile":
      return (
        <MobileTimeFilter
          selectedDay={selectedDay}
          selectedTimeFrame={selectedTimeFrame}
          onDayChange={onDayChange}
          onTimeFrameChange={onTimeFrameChange}
          showLabels={showLabels}
        />
      )
    
    case "desktop":
      return (
        <DesktopTimeFilter
          selectedDay={selectedDay}
          selectedTimeFrame={selectedTimeFrame}
          onDayChange={onDayChange}
          onTimeFrameChange={onTimeFrameChange}
          showLabels={showLabels}
        />
      )
    
    default:
      return (
        <DesktopTimeFilter
          selectedDay={selectedDay}
          selectedTimeFrame={selectedTimeFrame}
          onDayChange={onDayChange}
          onTimeFrameChange={onTimeFrameChange}
          showLabels={showLabels}
        />
      )
  }
}
