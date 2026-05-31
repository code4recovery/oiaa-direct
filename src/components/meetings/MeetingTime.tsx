import { DateTime } from "luxon"
import {
  FaCalendarAlt,
  FaClock,
  FaGlobeAmericas,
} from "react-icons/fa"
import { useTranslation } from "react-i18next"

import i18n from "@/i18n"
import {
  Box,
  Flex,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"

export interface MeetingTimeProps {
  /** UTC time string from the meeting data */
  timeUTC?: string
  /** Meeting's original timezone */
  timezone?: string
  /** Display format variant */
  format: 'short' | 'long' | 'relative' | 'compact'
  /** Whether to show user's local time conversion */
  showLocal?: boolean
  /** Whether to show icons */
  showIcons?: boolean
  /** Override text size */
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

/**
 * Formats a time in both the original timezone and the user's local timezone
 */
const formatMeetingTime = (timeUTC: string, meetingTimezone: string) => {
  const date = new Date(timeUTC)
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Format for meeting's original timezone
  const originalTimeFormatter = new Intl.DateTimeFormat(i18n.language, {
    hour: "numeric",
    minute: "numeric",
    timeZone: meetingTimezone,
    hour12: true,
  })

  // Format for user's local timezone
  const userTimeFormatter = new Intl.DateTimeFormat(i18n.language, {
    hour: "numeric",
    minute: "numeric",
    timeZone: userTimezone,
    hour12: true,
  })

  // Day formatter for original timezone
  const originalDayFormatter = new Intl.DateTimeFormat(i18n.language, {
    weekday: "long",
    timeZone: meetingTimezone,
  })

  // Day formatter for user's local timezone
  const userDayFormatter = new Intl.DateTimeFormat(i18n.language, {
    weekday: "long",
    timeZone: userTimezone,
  })

  // Date formatter for user's local timezone (for clarity)
  const userDateFormatter = new Intl.DateTimeFormat(i18n.language, {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: userTimezone,
  })

  // Date formatter for original timezone
  const originalDateFormatter = new Intl.DateTimeFormat(i18n.language, {
    weekday: "long", 
    month: "short",
    day: "numeric",
    timeZone: meetingTimezone,
  })

  const originalTime = originalTimeFormatter.format(date)
  const userTime = userTimeFormatter.format(date)
  const originalDay = originalDayFormatter.format(date)
  const userDay = userDayFormatter.format(date)
  const userDate = userDateFormatter.format(date)
  const originalDate = originalDateFormatter.format(date)

  return {
    originalTime,
    userTime,
    dayName: originalDay, // Keep for backward compatibility
    originalDay,
    userDay,
    userDate,
    originalDate,
    originalTimezone: meetingTimezone,
    userTimezone,
    isSameTimezone: meetingTimezone === userTimezone,
    isSameDay: originalDay === userDay,
  }
}

/**
 * Get relative time description (Today, Tomorrow, This Week, etc.)
 */
const getRelativeTimeDescription = (timeUTC: string, t: (key: string, options?: Record<string, unknown>) => string) => {
  const meetingDate = DateTime.fromISO(timeUTC)
  const now = DateTime.now()

  const diffDays = meetingDate.startOf('day').diff(now.startOf('day'), 'days').days

  if (diffDays === 0) return t("today")
  if (diffDays === 1) return t("tomorrow")
  if (diffDays === -1) return t("yesterday")
  if (diffDays > 1 && diffDays <= 7) return t("in_days", { count: Math.floor(diffDays) })
  if (diffDays < -1 && diffDays >= -7) return t("days_ago", { count: Math.abs(Math.floor(diffDays)) })

  return meetingDate.toFormat('ccc, MMM d') // e.g., "Mon, Jan 15"
}

export const MeetingTime = ({
  timeUTC,
  timezone,
  format,
  showLocal = false,
  showIcons = true,
  size,
}: MeetingTimeProps) => {
  const { t } = useTranslation()
  // Responsive size handling
  const responsiveSize = useBreakpointValue({
    base: size ?? 'sm',
    md: size ?? 'md',
  })

  const iconSize = responsiveSize === 'xs' ? 12 : responsiveSize === 'sm' ? 14 : 16
  const iconColor = "gray.500"

  // Common text styles
  const primaryTextProps = {
    fontSize: responsiveSize,
    fontWeight: format === 'compact' ? 'medium' : 'normal',
    color: "gray.700",
    _dark: { color: "gray.300" },
  }

  const secondaryTextProps = {
    fontSize: responsiveSize === 'xs' ? 'xs' : 'sm',
    color: "gray.600",
    _dark: { color: "gray.400" },
  }

  if (!timeUTC || !timezone) {
    if (format === 'compact') {
      return (
        <Text {...primaryTextProps}>
          {t("ongoing")}
        </Text>
      )
    } else {
      return (
        <Box>
          <Flex align="center" gap={2}>
            {showIcons && (
              <Box color={iconColor} fontSize={iconSize}>
                <FaCalendarAlt />
              </Box>
            )}
            <Text {...primaryTextProps}>
              {t("ongoing")}
            </Text>
          </Flex>
        </Box>
      )
    }
  }

  // For scheduled meetings, format the time info
  const timeInfo = formatMeetingTime(timeUTC, timezone)
  const relativeTime = getRelativeTimeDescription(timeUTC, t)

  if (format === 'compact') {
    // Single line, minimal info for mobile lists - LOCAL TIME FIRST
    return (
      <Text {...primaryTextProps}>
        {!timeInfo.isSameTimezone && showLocal ? (
          <>
            {timeInfo.userDay} {timeInfo.userTime}
            {!timeInfo.isSameDay && (
              <Text as="span" {...secondaryTextProps} ml={1}>
                {t("originally", { day: timeInfo.originalDay })}
              </Text>
            )}
          </>
        ) : (
          <>
            {timeInfo.dayName} {timeInfo.originalTime}
          </>
        )}
      </Text>
    )
  }

  if (format === 'short') {
    // Two lines: LOCAL TIME FIRST, then optional original time
    return (
      <Box>
        <Flex align="center" gap={2}>
          {showIcons && (
            <Box color={iconColor} fontSize={iconSize}>
              <FaCalendarAlt />
            </Box>
          )}
          <Text {...primaryTextProps}>
            {!timeInfo.isSameTimezone && showLocal
              ? `${timeInfo.dayName} ${t("at")} ${timeInfo.userTime}`
              : `${timeInfo.dayName} ${t("at")} ${timeInfo.originalTime}`
            }
          </Text>
        </Flex>
        {showLocal && !timeInfo.isSameTimezone && (
          <Flex align="center" gap={2} mt={1}>
            {showIcons && (
              <Box color={iconColor} fontSize={iconSize}>
                <FaGlobeAmericas />
              </Box>
            )}
            <Text {...secondaryTextProps}>
              {t("meeting_time_label")} {timeInfo.originalDay} {t("at")} {timeInfo.originalTime}
              {timeInfo.originalTimezone !== 'UTC' && (
                <Text as="span">
                  {' '}({timeInfo.originalTimezone.replace('_', ' ')})
                </Text>
              )}
            </Text>
          </Flex>
        )}
      </Box>
    )
  }

  if (format === 'relative') {
    // Relative time with absolute time as secondary
    return (
      <Box>
        <Flex align="center" gap={2}>
          {showIcons && (
            <Box color={iconColor} fontSize={iconSize}>
              <FaClock />
            </Box>
          )}
          <Text {...primaryTextProps}>
            {relativeTime}
          </Text>
        </Flex>
        <Text {...secondaryTextProps} mt={1}>
          {timeInfo.dayName} {t("at")} {timeInfo.originalTime}
          {timeInfo.originalTimezone !== 'UTC' && (
            <Text as="span">
              {' '}({timeInfo.originalTimezone.replace('_', ' ')})
            </Text>
          )}
        </Text>
        {showLocal && !timeInfo.isSameTimezone && (
          <Text {...secondaryTextProps}>
            {t("your_time", { time: timeInfo.userTime })}
          </Text>
        )}
      </Box>
    )
  }

  // Full detailed display with LOCAL TIME PROMINENTLY FEATURED (format === 'long' or default)
  return (
      <Box>
        {/* LOCAL TIME - Primary Display */}
        <Flex align="center" gap={2} mb={2}>
          {showIcons && (
            <Box color={iconColor} fontSize={iconSize}>
              <FaCalendarAlt />
            </Box>
          )}
          <Text {...primaryTextProps} fontWeight="medium">
            {!timeInfo.isSameTimezone && showLocal
              ? `${timeInfo.userDate} ${t("at")} ${timeInfo.userTime}`
              : `${timeInfo.dayName} ${t("at")} ${timeInfo.originalTime}`
            }
            {(!timeInfo.isSameTimezone && showLocal) && (
              <Text as="span" {...secondaryTextProps} ml={1} fontWeight="normal">
                {t("your_local_time")}
              </Text>
            )}
          </Text>
        </Flex>

        {/* ORIGINAL TIME - Secondary Display */}
        {showLocal && !timeInfo.isSameTimezone && (
          <Flex align="center" gap={2} mb={2}>
            {showIcons && (
              <Box color={iconColor} fontSize={iconSize}>
                <FaGlobeAmericas />
              </Box>
            )}
            <Text {...secondaryTextProps}>
              {t("meeting_time_label")} {timeInfo.originalDate} {t("at")} {timeInfo.originalTime}
              {timeInfo.originalTimezone !== 'UTC' && (
                <Text as="span">
                  {' '}({timeInfo.originalTimezone.replace('_', ' ')})
                </Text>
              )}
            </Text>
          </Flex>
        )}
        
        {/* RELATIVE TIME */}
        <Flex align="center" gap={2}>
          {showIcons && (
            <Box color={iconColor} fontSize={iconSize}>
              <FaClock />
            </Box>
          )}
          <Text {...secondaryTextProps}>
            {relativeTime}
          </Text>
        </Flex>
      </Box>
    )
}

export default MeetingTime