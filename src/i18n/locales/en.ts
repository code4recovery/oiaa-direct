type TranslationResource = Record<string, string | Record<string, string>>

const en: TranslationResource = {
  // Common
  ongoing: "Ongoing",
  back_to_meetings: "Back to Meetings",

  // Search & Filters
  filters: "Filters",
  clear_filters: "Clear Filters",
  search_placeholder: "Search meetings...",
  search_min_chars: "Enter at least 3 characters.",
  scheduled: "Scheduled",
  filters_unavailable:
    "Filters are temporarily unavailable. Please try again in a moment.",
  retry: "Retry",

  // Filter section headings
  filter_day_time: "Day & Time",
  filter_meeting_type: "Meeting Type",
  filter_formats: "Formats",
  filter_features: "Features",
  filter_communities: "Communities",
  filter_languages: "Languages",

  // Days
  day: "Day",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",

  // Time frames
  time: "Time",
  morning: "Morning (4–11 AM)",
  midday: "Midday (11 AM–1 PM)",
  afternoon: "Afternoon (1–5 PM)",
  evening: "Evening (5–9 PM)",
  night: "Night (9 PM–4 AM)",

  // Meeting list
  meetings: "Meetings",
  meetings_summary: "({{total}} total results; {{shown}} loaded.)",
  no_results: "No meetings found matching your criteria.",

  // Meeting time
  today: "Today",
  tomorrow: "Tomorrow",
  yesterday: "Yesterday",
  in_days: "In {{count}} days",
  days_ago: "{{count}} days ago",
  originally: "(originally {{day}})",
  meeting_time_label: "Meeting time:",
  your_local_time: "(your local time)",
  your_time: "Your time: {{time}}",
  your_local_time_label: "Your local time:",
  at: "at",

  // Meeting detail page
  meeting_details: "Meeting Details",
  meeting_information: "Meeting Information",
  meeting_categories: "Meeting Categories",
  additional_categories: "Additional Categories:",
  meeting_id: "Meeting ID",
  group_id: "Group ID",
  meeting_time: "Meeting Time",
  your_local_time_heading: "Your Local Time",
  conference_provider: "Conference Provider",
  minutes: "{{count}} minutes",

  // Group info
  about_this_group: "About This Group",
  group_notes: "Group Notes",
  all_meetings: "{{name}} - All Meetings",

  // Actions
  join: "Join",
  join_meeting: "Join Meeting",
  join_service: "Join {{service}}",
  join_service_meeting: "Join {{service}} Meeting",
  send_email: "Send Email",
  email_group: "Email Group",
  email: "Email",
  visit_website: "Visit Website",
  website: "Website",

  // Calendar
  add_to_calendar: "Add to Calendar",
  calendar: "Calendar",
  add: "Add",
  add_event: "Add Event",
  single_event: "Single Event",
  single_event_ics: "Single Event (.ics (mac))",
  recurring_series: "Recurring Series (Weekly)",
  recurring_series_ics: "Recurring Series (.ics (mac))",
  google_calendar: "Google Calendar",
  quick_add: "Quick Add:",
  calendar_events_note:
    "Events include meeting links, phone numbers, and reminders.",
  online_meeting: "Online Meeting",
  meeting_reminder: "Meeting reminder",

  // ICS content strings
  ics_join: "Join Meeting: {{url}}",
  ics_phone: "Phone: {{phone}}",
  ics_contact: "Contact: {{email}}",
  ics_website: "Website: {{url}}",
  ics_join_short: "Join: {{url}}",

  // Meeting types
  types: {
    O: "Open",
    C: "Closed",
  },

  // Formats
  formats: {
    "11": "11th Step Meditation",
    "12x12": "12 Steps & 12 Traditions",
    A: "Secular",
    ABSI: "As Bill Sees It",
    B: "Big Book",
    BE: "Newcomer",
    D: "Discussion",
    DR: "Daily Reflections",
    GR: "Grapevine",
    H: "Birthday",
    LIT: "Literature",
    LS: "Living Sober",
    MED: "Meditation",
    SP: "Speaker",
    ST: "Step Study",
    TR: "Tradition Study",
  },

  // Features
  features: {
    "AL-AN": "Concurrent with Al-Anon",
    AL: "Concurrent with Alateen",
    ASL: "American Sign Language",
    BA: "Babysitting Available",
    BRK: "Breakfast",
    CAN: "Candlelight",
    CF: "Child-Friendly",
    DB: "Digital Basket",
    FF: "Fragrance Free",
    OUT: "Outdoor",
    POA: "Proof of Attendance",
    RSL: "Russian Sign Language",
    SM: "Smoking Permitted",
    TC: "Location Temporarily Closed",
    X: "Wheelchair Access",
    XB: "Wheelchair-Accessible Bathroom",
    XT: "Cross Talk Permitted",
  },

  // Communities
  communities: {
    M: "Men",
    W: "Women",
    DD: "Dual Diagnosis",
    LGBTQ: "LGBTQIAA+",
    BI: "Bisexual",
    G: "Gay",
    L: "Lesbian",
    T: "Transgender",
    SEN: "Seniors",
    Y: "Young People",
    POC: "People of Color",
    N: "Native American",
    NDG: "Indigenous",
    "BV-I": "Blind / Visually Impaired",
    "D-HOH": "Deaf / Hard of Hearing",
    "LO-I": "Loners / Isolationists",
    P: "Professionals",
  },

  // Languages
  languages: {
    am: "Amharic",
    bg: "Bulgarian",
    de: "German",
    el: "Greek",
    en: "English",
    es: "Spanish",
    fa: "Persian",
    fr: "French",
    hi: "Hindi",
    hu: "Hungarian",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    lt: "Lithuanian",
    ml: "Malayalam",
    mt: "Maltese",
    pa: "Punjabi",
    pl: "Polish",
    pt: "Portuguese",
    ru: "Russian",
    sv: "Swedish",
  },
}

export type TranslationStrings = TranslationResource

export default en
