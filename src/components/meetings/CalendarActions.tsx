import { DateTime } from "luxon"
import {
  FaCalendarPlus,
  FaCalendarCheck,
  FaChevronDown,
} from "react-icons/fa"

import type { Meeting } from "@/meetingTypes"
import {
  Button,
  Flex,
  HStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@/components/ui/popover"

export interface CalendarActionsProps {
  /** Meeting data for calendar generation */
  meeting: Meeting
  /** Button display mode */
  mode?: 'full' | 'compact' | 'icon-only'
  /** Button size */
  size?: 'xs' | 'sm' | 'md'
  /** Layout orientation */
  layout?: 'horizontal' | 'vertical'
  /** Override responsive behavior */
  forceMode?: 'full' | 'compact' | 'icon-only'
}

/**
 * Generate ICS calendar content for a meeting
 */
const generateICS = (meeting: Meeting, isRecurring: boolean = false): string => {
  const startDate = DateTime.fromISO(meeting.timeUTC)
  const endDate = startDate.plus({ hours: 1 }) // Assume 1-hour meetings
  
  // Format dates for ICS (YYYYMMDDTHHMMSSZ)
  const formatICSDate = (date: DateTime): string => 
    date.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")

  const startDateICS = formatICSDate(startDate)
  const endDateICS = formatICSDate(endDate)
  const now = formatICSDate(DateTime.now())

  // Create a unique UID
  const uid = `${meeting.slug}-${startDateICS}@oiaa-direct.com`

  // Build description with meeting details
  const description = [
    Array.isArray(meeting.notes) ? meeting.notes.join('\\n') : meeting.notes || '',
    meeting.conference_url ? `Join Meeting: ${meeting.conference_url}` : '',
    meeting.conference_phone ? `Phone: ${meeting.conference_phone}` : '',
    meeting.groupEmail ? `Contact: ${meeting.groupEmail}` : '',
    meeting.groupWebsite ? `Website: ${meeting.groupWebsite}` : '',
  ].filter(Boolean).join('\\n\\n')

  // Location (online or address)
  const location = meeting.conference_url || 'Online Meeting'

  // Recurrence rule for weekly meetings (if recurring)
  const recurrenceRule = isRecurring ? '\nRRULE:FREQ=WEEKLY;BYDAY=' + 
    ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][startDate.weekday % 7] : ''

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//OIAA Direct//Meeting Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTART:${startDateICS}
DTEND:${endDateICS}
DTSTAMP:${now}
SUMMARY:${meeting.name}
DESCRIPTION:${description}
LOCATION:${location}${recurrenceRule}
STATUS:CONFIRMED
TRANSP:OPAQUE
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Meeting reminder
END:VALARM
END:VEVENT
END:VCALENDAR`

  return icsContent
}

/**
 * Download ICS file for calendar import
 */
const downloadICS = (meeting: Meeting, isRecurring: boolean = false) => {
  const icsContent = generateICS(meeting, isRecurring)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${meeting.slug}${isRecurring ? '-recurring' : ''}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate calendar URLs for popular services
 */
const generateCalendarUrls = (meeting: Meeting, isRecurring: boolean = false) => {
  const startDate = DateTime.fromISO(meeting.timeUTC)
  const endDate = startDate.plus({ hours: 1 })
  
  // Google Calendar format
  const googleStartDate = startDate.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")
  const googleEndDate = endDate.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")
  const googleDetails = encodeURIComponent([
    Array.isArray(meeting.notes) ? meeting.notes.join('\n') : meeting.notes || '',
    meeting.conference_url ? `Join: ${meeting.conference_url}` : '',
    meeting.groupEmail ? `Contact: ${meeting.groupEmail}` : '',
  ].filter(Boolean).join('\n\n'))
  
  const googleLocation = encodeURIComponent(
    meeting.conference_url || 'Online Meeting'
  )

  const recurrence = isRecurring ? '&recur=RRULE:FREQ=WEEKLY' : ''

  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meeting.name)}&dates=${googleStartDate}/${googleEndDate}&details=${googleDetails}&location=${googleLocation}${recurrence}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(meeting.name)}&startdt=${startDate.toISO()}&enddt=${endDate.toISO()}&body=${googleDetails}&location=${googleLocation}`,
    yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(meeting.name)}&st=${googleStartDate}&et=${googleEndDate}&desc=${googleDetails}&in_loc=${googleLocation}`,
  }
}

export const CalendarActions = ({
  meeting,
  mode = 'compact',
  size = 'sm',
  layout = 'horizontal',
  forceMode,
}: CalendarActionsProps) => {
  // Responsive display mode
  const responsiveMode = useBreakpointValue({ 
    base: 'icon-only', 
    sm: 'compact', 
    md: 'full' 
  })
  
  const displayMode = forceMode || mode || responsiveMode

  const calendarUrls = generateCalendarUrls(meeting, false)
  const recurringUrls = generateCalendarUrls(meeting, true)

  // Button content based on display mode
  const getButtonContent = (isMain: boolean = true) => {
    if (displayMode === 'icon-only') {
      return <FaCalendarPlus />
    }
    
    if (displayMode === 'compact') {
      return (
        <Flex align="center" gap={2}>
          <FaCalendarPlus />
          <Text>{isMain ? 'Calendar' : 'Add'}</Text>
        </Flex>
      )
    }
    
    // Full mode
    return (
      <Flex align="center" gap={2}>
        <FaCalendarPlus />
        <Text>{isMain ? 'Add to Calendar' : 'Add Event'}</Text>
      </Flex>
    )
  }

  const containerProps = {
    gap: layout === 'horizontal' ? 2 : 1,
    direction: layout === 'vertical' ? 'column' : 'row',
    align: 'stretch',
    w: layout === 'vertical' ? 'full' : 'auto',
  } as const

  if (displayMode === 'icon-only') {
    // Simple dropdown for icon-only mode
    return (
      <PopoverRoot positioning={{ placement: "bottom-start" }}>
        <PopoverTrigger asChild>
          <Button
            size={size}
            variant="outline"
            colorScheme="green"
            title="Add to Calendar"
          >
            <FaCalendarPlus />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <Flex direction="column" gap={2}>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Add to Calendar
              </Text>
              
              <Button
                size="xs"
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => downloadICS(meeting, false)}
              >
                <FaCalendarPlus style={{ marginRight: '8px' }} />
                Single Event (.ics)
              </Button>
              
              <Button
                size="xs"
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => downloadICS(meeting, true)}
              >
                <FaCalendarCheck style={{ marginRight: '8px' }} />
                Recurring Series (.ics)
              </Button>
              
              <Text fontSize="xs" color="gray.500" mt={2} mb={1}>
                Quick Add:
              </Text>
              
              <Button
                as="a"
                size="xs"
                variant="ghost"
                justifyContent="flex-start"
                colorScheme="blue"
                onClick={() => window.open(calendarUrls.google, '_blank')}
              >
                Google Calendar
              </Button>
              
              <Button
                as="a"
                size="xs"
                variant="ghost"
                justifyContent="flex-start"
                colorScheme="blue"
                onClick={() => window.open(calendarUrls.outlook, '_blank')}
              >
                Outlook
              </Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    )
  }

  // Compact and Full modes with dropdown
  return (
    <Flex {...containerProps}>
      <PopoverRoot positioning={{ placement: "bottom-start" }}>
        <PopoverTrigger asChild>
          <Button
            size={size}
            variant="outline"
            colorScheme="green"
          >
            <Flex align="center" gap={2}>
              {getButtonContent()}
              <FaChevronDown />
            </Flex>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <Flex direction="column" gap={3}>
              <Text fontSize="sm" fontWeight="medium">
                Add to Calendar
              </Text>
              
              {/* Single Event Options */}
              <Flex direction="column" gap={2}>
                <Text fontSize="xs" fontWeight="medium" color="gray.600" _dark={{ color: "gray.400" }}>
                  Single Event
                </Text>
                
                <HStack gap={2}>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => downloadICS(meeting, false)}
                    flex="1"
                  >
                    <FaCalendarPlus style={{ marginRight: '4px' }} />
                    Download .ics
                  </Button>
                  
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="blue"
                    flex="1"
                    onClick={() => window.open(calendarUrls.google, '_blank')}
                  >
                    Google
                  </Button>
                  
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="blue"
                    flex="1"
                    onClick={() => window.open(calendarUrls.outlook, '_blank')}
                  >
                    Outlook
                  </Button>
                </HStack>
              </Flex>
              
              {/* Recurring Series Options */}
              <Flex direction="column" gap={2}>
                <Text fontSize="xs" fontWeight="medium" color="gray.600" _dark={{ color: "gray.400" }}>
                  Recurring Series (Weekly)
                </Text>
                
                <HStack gap={2}>
                  <Button
                    size="xs"
                    variant="outline"
                    colorScheme="purple"
                    onClick={() => downloadICS(meeting, true)}
                    flex="1"
                  >
                    <FaCalendarCheck style={{ marginRight: '4px' }} />
                    Download .ics
                  </Button>
                  
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="purple"
                    flex="1"
                    onClick={() => window.open(recurringUrls.google, '_blank')}
                  >
                    Google
                  </Button>
                  
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="purple"
                    flex="1"
                    onClick={() => window.open(recurringUrls.outlook, '_blank')}
                  >
                    Outlook
                  </Button>
                </HStack>
              </Flex>
              
              <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                Events include meeting links, phone numbers, and reminders.
              </Text>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    </Flex>
  )
}

export default CalendarActions