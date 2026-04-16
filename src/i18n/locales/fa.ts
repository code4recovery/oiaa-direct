import type { TranslationStrings } from "./en"

// NOTE: Farsi is an RTL language. Ensure Chakra UI's `direction="rtl"` is set
// on ChakraProvider when this locale is active. See TRANSLATION_PLAN.md Step 10.
const fa: TranslationStrings = {
  // Common
  ongoing: "در حال برگزاری",
  back_to_meetings: "بازگشت به جلسات",

  // Search & Filters
  filters: "فیلترها",
  clear_filters: "پاک کردن فیلترها",
  search_placeholder: "جستجو",
  search_min_chars: "حداقل ۳ کاراکتر وارد کنید.",
  scheduled: "برنامه‌ریزی شده",
  filters_unavailable:
    "فیلترها موقتاً در دسترس نیستند. لطفاً لحظه‌ای دیگر دوباره امتحان کنید.",
  retry: "تلاش مجدد",

  // Filter section headings
  filter_day_time: "روز و زمان",
  filter_meeting_type: "نوع جلسه",
  filter_formats: "قالب‌ها",
  filter_features: "ویژگی‌ها",
  filter_communities: "انجمن‌ها",
  filter_languages: "زبان‌ها",

  // Days
  day: "روز",
  monday: "دوشنبه",
  tuesday: "سه‌شنبه",
  wednesday: "چهارشنبه",
  thursday: "پنج‌شنبه",
  friday: "جمعه",
  saturday: "شنبه",
  sunday: "یکشنبه",

  // Time frames
  time: "زمان",
  morning: "صبح (۴ تا ۱۱)",
  midday: "ظهر (۱۱ تا ۱۳)",
  afternoon: "بعد از ظهر (۱۳ تا ۱۷)",
  evening: "عصر (۱۷ تا ۲۱)",
  night: "شب (۲۱ تا ۴)",

  // Meeting list
  meetings: "جلسات",
  meetings_summary: "(مجموع {{total}} نتیجه؛ {{shown}} بارگذاری شده.)",
  no_results: "جلسه‌ای با معیارهای شما یافت نشد.",

  // Meeting time
  today: "امروز",
  tomorrow: "فردا",
  yesterday: "دیروز",
  in_days: "{{count}} روز دیگر",
  days_ago: "{{count}} روز پیش",
  originally: "(اصالتاً {{day}})",
  meeting_time_label: "زمان جلسه:",
  your_local_time: "(به وقت محلی شما)",
  your_time: "وقت شما: {{time}}",
  your_local_time_label: "وقت محلی شما:",
  at: "ساعت",

  // Meeting detail page
  meeting_details: "جزئیات جلسه",
  meeting_information: "اطلاعات جلسه",
  meeting_categories: "دسته‌بندی‌های جلسه",
  additional_categories: "دسته‌بندی‌های اضافی:",
  meeting_id: "شناسه جلسه",
  group_id: "شناسه گروه",
  meeting_time: "زمان جلسه",
  your_local_time_heading: "وقت محلی شما",
  conference_provider: "ارائه‌دهنده کنفرانس",
  minutes: "{{count}} دقیقه",

  // Group info
  about_this_group: "درباره این گروه",
  group_notes: "یادداشت‌های گروه",
  all_meetings: "{{name}} - همه جلسات",

  // Actions
  join: "پیوستن",
  join_meeting: "پیوستن به جلسه",
  join_service: "پیوستن به {{service}}",
  join_service_meeting: "پیوستن به جلسه {{service}}",
  send_email: "ارسال ایمیل",
  email_group: "ایمیل به گروه",
  email: "ایمیل",
  visit_website: "بازدید از وب‌سایت",
  website: "وب‌سایت",

  // Calendar
  add_to_calendar: "افزودن به تقویم",
  calendar: "تقویم",
  add: "افزودن",
  add_event: "افزودن رویداد",
  single_event: "رویداد تکی",
  single_event_ics: "رویداد تکی (.ics (mac))",
  recurring_series: "سری تکراری (هفتگی)",
  recurring_series_ics: "سری تکراری (.ics (mac))",
  google_calendar: "گوگل کلندر",
  quick_add: "افزودن سریع:",
  calendar_events_note:
    "رویدادها شامل لینک جلسه، شماره تلفن و یادآورها می‌شوند.",
  online_meeting: "جلسه آنلاین",
  meeting_reminder: "یادآور جلسه",

  // ICS content strings
  ics_join: "پیوستن به جلسه: {{url}}",
  ics_phone: "تلفن: {{phone}}",
  ics_contact: "تماس: {{email}}",
  ics_website: "وب‌سایت: {{url}}",
  ics_join_short: "پیوستن: {{url}}",

  // Meeting types
  types: {
    O: "باز",
    C: "بسته",
  },

  // Formats — AA-specific literature titles kept close to Persian AA usage
  formats: {
    "11": "مراقبه گام یازدهم",
    "12x12": "۱۲ گام و ۱۲ سنت",
    A: "غیردینی",
    ABSI: "آنطور که بیل می‌بیند",
    B: "کتاب بزرگ",
    BE: "تازه‌واردان",
    D: "بحث و گفتگو",
    DR: "تأملات روزانه",
    GR: "Grapevine",
    H: "سالگرد هوشیاری",
    LIT: "ادبیات",
    LS: "زندگی هوشیار",
    MED: "مراقبه",
    SP: "سخنران",
    ST: "مطالعه گام‌ها",
    TR: "مطالعه سنت‌ها",
  },

  // Features
  features: {
    "AL-AN": "همزمان با Al-Anon",
    AL: "همزمان با Alateen",
    ASL: "زبان اشاره آمریکایی",
    BA: "مراقب کودک در دسترس",
    BRK: "صبحانه",
    CAN: "با شمع",
    CF: "مناسب کودکان",
    DB: "سبد دیجیتال",
    FF: "بدون عطر",
    OUT: "در فضای باز",
    POA: "گواهی حضور",
    RSL: "زبان اشاره روسی",
    SM: "سیگار مجاز",
    TC: "محل موقتاً بسته است",
    X: "دسترسی ویلچر",
    XB: "دستشویی مناسب ویلچر",
    XT: "صحبت متقاطع مجاز",
  },

  // Communities
  communities: {
    M: "مردان",
    W: "زنان",
    DD: "تشخیص دوگانه",
    LGBTQ: "LGBTQIAA+",
    BI: "دوجنس‌گرا",
    G: "گی",
    L: "لزبین",
    T: "ترنسجندر",
    SEN: "سالمندان",
    Y: "جوانان",
    POC: "افراد رنگین‌پوست",
    N: "بومیان آمریکا",
    NDG: "بومی",
    "BV-I": "نابینا / کم‌بینا",
    "D-HOH": "ناشنوا / کم‌شنوا",
    "LO-I": "تنها / انزواطلب",
    P: "متخصصان",
  },

  // Languages
  languages: {
    am: "امهری",
    bg: "بلغاری",
    de: "آلمانی",
    el: "یونانی",
    en: "انگلیسی",
    es: "اسپانیایی",
    fa: "فارسی",
    fr: "فرانسوی",
    hi: "هندی",
    hu: "مجاری",
    it: "ایتالیایی",
    ja: "ژاپنی",
    ko: "کره‌ای",
    lt: "لیتوانیایی",
    ml: "مالایالام",
    mt: "مالتی",
    pa: "پنجابی",
    pl: "لهستانی",
    pt: "پرتغالی",
    ru: "روسی",
    sv: "سوئدی",
  },
}

export default fa
