import { DateTime } from "luxon"
import {
  FaCalendarAlt,
  FaClock,
  FaGlobeAmericas,
} from "react-icons/fa"

import {
  Box,
  Flex,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"

export interface MeetingTimeProps {
  /** UTC time string from the meeting data */
  timeUTC: string
  /** Meeting's original timezone */
  timezone: string
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
  const originalTimeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZone: meetingTimezone,
    hour12: true,
  })

  // Format for user's local timezone
  const userTimeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZone: userTimezone,
    hour12: true,
  })

  // Day formatter for original timezone
  const originalDayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: meetingTimezone,
  })

  // Day formatter for user's local timezone
  const userDayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: userTimezone,
  })

  // Date formatter for user's local timezone (for clarity)
  const userDateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: userTimezone,
  })

  // Date formatter for original timezone
  const originalDateFormatter = new Intl.DateTimeFormat("en-US", {
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
const getRelativeTimeDescription = (timeUTC: string) => {
  const meetingDate = DateTime.fromISO(timeUTC)
  const now = DateTime.now()
  
  const diffDays = meetingDate.startOf('day').diff(now.startOf('day'), 'days').days

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow" 
  if (diffDays === -1) return "Yesterday"
  if (diffDays > 1 && diffDays <= 7) return `In ${Math.floor(diffDays).toString()} days`
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(Math.floor(diffDays)).toString()} days ago`
  
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
  const timeInfo = formatMeetingTime(timeUTC, timezone)
  const relativeTime = getRelativeTimeDescription(timeUTC)
  
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

  if (format === 'compact') {
    // Single line, minimal info for mobile lists - LOCAL TIME FIRST
    return (
      <Text {...primaryTextProps}>
        {!timeInfo.isSameTimezone && showLocal ? (
          <>
            {timeInfo.userDate} {timeInfo.userTime}
            {!timeInfo.isSameDay && (
              <Text as="span" {...secondaryTextProps} ml={1}>
                (originally {timeInfo.originalDay})
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
              ? `${timeInfo.dayName} at ${timeInfo.userTime}`
              : `${timeInfo.dayName} at ${timeInfo.originalTime}`
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
              Meeting time: {timeInfo.originalDay} at {timeInfo.originalTime}
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
          {timeInfo.dayName} at {timeInfo.originalTime} 
          {timeInfo.originalTimezone !== 'UTC' && (
            <Text as="span">
              {' '}({timeInfo.originalTimezone.replace('_', ' ')})
            </Text>
          )}
        </Text>
        {showLocal && !timeInfo.isSameTimezone && (
          <Text {...secondaryTextProps}>
            Your time: {timeInfo.userTime}
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
              ? `${timeInfo.userDate} at ${timeInfo.userTime}`
              : `${timeInfo.dayName} at ${timeInfo.originalTime}`
            }
            {(!timeInfo.isSameTimezone && showLocal) && (
              <Text as="span" {...secondaryTextProps} ml={1} fontWeight="normal">
                (your local time)
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
              Meeting time: {timeInfo.originalDate} at {timeInfo.originalTime}
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