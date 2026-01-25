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

// Styled select with Chakra-compatible theming
const selectStyles = {
  width: "100%",
  padding: "8px 12px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
} as const

const SelectField = ({
  label,
  value,
  onChange,
  options,
  showLabel = true,
  includeHourlyOptions = true,
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
        <Text fontSize="sm" fontWeight="medium" mb={2} color="inherit">
          {label}:
        </Text>
      )}
      <Box
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        bg="white"
        _dark={{
          bg: "gray.800",
          borderColor: "gray.600",
        }}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...selectStyles,
            border: "none",
            background: "transparent",
            color: "inherit",
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
                const optionLabel = dt.toLocaleString(DateTime.TIME_SIMPLE)
                const optionValue = dt.toFormat("HH:mm")
                return (
                  <option value={optionValue} key={optionValue}>
                    {optionLabel}
                  </option>
                )
              })}
            </>
          )}
        </select>
      </Box>
    </Box>
  )
}


const TimeFilterFields = ({
  selectedDay,
  selectedTimeFrame,
  onDayChange,
  onTimeFrameChange,
  showLabels,
  variant,
}: {
  selectedDay: string
  selectedTimeFrame: string
  onDayChange: (day: string) => void
  onTimeFrameChange: (timeFrame: string) => void
  showLabels: boolean
  variant: TimeFilterVariant
}) => {
  const gap = variant === "mobile" ? 3 : 4

  return (
    <VStack gap={gap} align="stretch">
      <SelectField
        label="Day"
        value={selectedDay}
        onChange={onDayChange}
        options={DAY_OPTIONS}
        showLabel={showLabels}
        includeHourlyOptions={false}
      />
      <SelectField
        label={"Time"}
        value={selectedTimeFrame}
        onChange={onTimeFrameChange}
        options={TIME_FRAME_OPTIONS}
        showLabel={showLabels}

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
  return (
    <TimeFilterFields
      selectedDay={selectedDay}
      selectedTimeFrame={selectedTimeFrame}
      onDayChange={onDayChange}
      onTimeFrameChange={onTimeFrameChange}
      showLabels={showLabels}
      variant={variant}
    />
  )
}
