import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

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

const DAY_KEYS = [
  { value: "monday", key: "monday" },
  { value: "tuesday", key: "tuesday" },
  { value: "wednesday", key: "wednesday" },
  { value: "thursday", key: "thursday" },
  { value: "friday", key: "friday" },
  { value: "saturday", key: "saturday" },
  { value: "sunday", key: "sunday" },
] as const

const TIME_FRAME_KEYS = [
  { value: "morning", key: "morning" },
  { value: "midday", key: "midday" },
  { value: "afternoon", key: "afternoon" },
  { value: "evening", key: "evening" },
  { value: "night", key: "night" },
] as const

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
  const { t } = useTranslation()
  const gap = variant === "mobile" ? 3 : 4

  const dayOptions = DAY_KEYS.map(({ value, key }) => ({ value, label: t(key) }))
  const timeFrameOptions = TIME_FRAME_KEYS.map(({ value, key }) => ({ value, label: t(key) }))

  return (
    <VStack gap={gap} align="stretch">
      <SelectField
        label={t("day")}
        value={selectedDay}
        onChange={onDayChange}
        options={dayOptions}
        showLabel={showLabels}
        includeHourlyOptions={false}
      />
      <SelectField
        label={t("time")}
        value={selectedTimeFrame}
        onChange={onTimeFrameChange}
        options={timeFrameOptions}
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
