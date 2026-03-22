import { DateTime } from "luxon"
import {
  FaCalendarCheck,
  FaCalendarPlus,
  FaChevronDown,
} from "react-icons/fa"

import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Meeting } from "@/meetingTypes"
import { isScheduledMeeting } from "@/utils/meetings-utils"
import {
  Button,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react"

export interface CalendarActionsProps {
  meeting: Meeting
  mode?: 'full' | 'compact' | 'icon-only'
  size?: 'xs' | 'sm' | 'md'
  layout?: 'horizontal' | 'vertical'
  forceMode?: 'full' | 'compact' | 'icon-only'
}

const generateICS = (meeting: Meeting, isRecurring = false): string => {
  if (!isScheduledMeeting(meeting)) {
    throw new Error('Meeting must have timeUTC and timezone')
  }
  
  const startDate = DateTime.fromISO(meeting.timeUTC, { zone: 'utc' })
  .setZone(meeting.timezone)
  const endDate = startDate.plus({ hours: 1 }) // Assume 1-hour meetings
  
  const formatICSDate = (date: DateTime): string =>
  date.toFormat("yyyyMMdd'T'HHmmss")

  const startDateICS = formatICSDate(startDate)
  const endDateICS = formatICSDate(endDate)
  const now = formatICSDate(DateTime.now().toUTC())

  const uid = `${meeting.slug}-${startDateICS}@oiaa-direct.com`

  const description = [
    (meeting.notes ?? ''),
    meeting.conference_url ? `Join Meeting: ${meeting.conference_url}` : '',
    meeting.conference_phone ? `Phone: ${meeting.conference_phone}` : '',
    meeting.groupEmail ? `Contact: ${meeting.groupEmail}` : '',
    meeting.groupWebsite ? `Website: ${meeting.groupWebsite}` : '',
  ].filter(Boolean).join('\\n\\n')

  const location = meeting.conference_url ?? 'Online Meeting'

  const recurrenceRule = isRecurring ? '\nRRULE:FREQ=WEEKLY;BYDAY=' + 
    ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][startDate.weekday % 7] : ''

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//OIAA Direct//Meeting Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTART;TZID=${meeting.timezone}:${startDateICS}
DTEND;TZID=${meeting.timezone}:${endDateICS}
DTSTAMP:${now}Z
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

const downloadICS = (meeting: Meeting, isRecurring = false) => {
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

const generateCalendarUrls = (meeting: Meeting, isRecurring = false) => {
  if (!isScheduledMeeting(meeting)) {
    throw new Error('Meeting must have timeUTC and timezone')
  }
  
  const startDate = DateTime.fromISO(meeting.timeUTC, { zone: 'utc' })
  const endDate = startDate.plus({ hours: 1 })
  
  const googleStartDate = startDate.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")
  const googleEndDate = endDate.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")
  const googleDetails = encodeURIComponent([
    meeting.notes ?? '',
    meeting.conference_url ? `Join: ${meeting.conference_url}` : '',
    meeting.groupEmail ? `Contact: ${meeting.groupEmail}` : '',
  ].filter(Boolean).join('\n\n'))
  
  const googleLocation = encodeURIComponent(
    meeting.conference_url ?? 'Online Meeting'
  )

  const recurrence = isRecurring ? '&recur=RRULE:FREQ=WEEKLY' : ''

  return {
    google:`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meeting.name)}&dates=${googleStartDate}/${googleEndDate}&details=${googleDetails}&location=${googleLocation}&ctz=${encodeURIComponent(meeting.timezone)}${recurrence}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(meeting.name)}&startdt=${startDate.toISO() ?? ''}&enddt=${endDate.toISO() ?? ''}&body=${googleDetails}&location=${googleLocation}`,
    yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(meeting.name)}&st=${googleStartDate}&et=${googleEndDate}&desc=${googleDetails}&in_loc=${googleLocation}`,
  }
}

interface CalendarOptionProps {
  label: string
  isRecurring: boolean
  meeting: Meeting
  calendarUrls: ReturnType<typeof generateCalendarUrls>
  colorScheme: string
}

const CalendarOption: React.FC<CalendarOptionProps> = ({
  label,
  isRecurring,
  meeting,
  calendarUrls,
  colorScheme,
}) => (
  <Flex direction="column" gap={2}>
    <Text fontSize="xs" fontWeight="medium" color="gray.600" _dark={{ color: "gray.400" }}>
      {label}
    </Text>
    <HStack gap={2}>
      <Button
        size="xs"
        variant="ghost"
        colorScheme={colorScheme}
        onClick={() => { downloadICS(meeting, isRecurring); }}
        flex="1"
      >
        {isRecurring ? <FaCalendarCheck style={{ marginRight: '4px' }} /> : <FaCalendarPlus style={{ marginRight: '4px' }} />}
        .ics (mac)
      </Button>
      <Button
        size="xs"
        variant="ghost"
        colorScheme={colorScheme}
        flex="1"
        onClick={() => window.open(calendarUrls.google, '_blank')}
      >
        Google
      </Button>
      <Button
        size="xs"
        variant="ghost"
        colorScheme={colorScheme}
        flex="1"
        onClick={() => window.open(calendarUrls.outlook, '_blank')}
      >
        Outlook
      </Button>
    </HStack>
  </Flex>
)

export const CalendarActions = ({
  meeting,
  mode = 'compact',
  size = 'sm',
  layout = 'horizontal',
  forceMode,
}: CalendarActionsProps) => {
  // No-op for unscheduled meetings
  if (!isScheduledMeeting(meeting)) {
    return null
  }
  
  const displayMode = forceMode ?? mode

  const calendarUrls = generateCalendarUrls(meeting, false)
  const recurringUrls = generateCalendarUrls(meeting, true)

  const getButtonContent = (isMain = true) => {
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
                onClick={() => {
                  downloadICS(meeting, false)
                }}
              >
                <FaCalendarPlus style={{ marginRight: '8px' }} />
                Single Event (.ics (mac))
              </Button>
              
              <Button
                size="xs"
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  downloadICS(meeting, true)
                }}
              >
                <FaCalendarCheck style={{ marginRight: '8px' }} />
                Recurring Series (.ics (mac))
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
              
              <CalendarOption
                label="Single Event"
                isRecurring={false}
                meeting={meeting}
                calendarUrls={calendarUrls}
                colorScheme="blue"
              />
              
              <CalendarOption
                label="Recurring Series (Weekly)"
                isRecurring={true}
                meeting={meeting}
                calendarUrls={recurringUrls}
                colorScheme="purple"
              />
              
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