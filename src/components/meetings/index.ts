// Meeting Components - Barrel Exports
// Atomic components for building meeting displays

export { default as MeetingTime } from './MeetingTime'
export type { MeetingTimeProps } from './MeetingTime'

export { default as MeetingCategories } from './MeetingCategories'
export type { MeetingCategoriesProps } from './MeetingCategories'

export { default as QuickActions } from './QuickActions'
export type { QuickActionsProps } from './QuickActions'

export { default as CalendarActions } from './CalendarActions'
export type { CalendarActionsProps } from './CalendarActions'

// Composite components
export { default as MeetingItem } from './MeetingItem'
export type { MeetingItemProps } from './MeetingItem'

export { MeetingsSummary } from './MeetingsSummary'

// Action components
export { default as JoinMeetingButton } from './JoinMeetingButton'

// Legacy components (consider deprecating)
export { MeetingCard } from './MeetingCard'