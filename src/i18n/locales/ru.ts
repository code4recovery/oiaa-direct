import type { TranslationStrings } from "./en"

const ru: TranslationStrings = {
  // Common
  ongoing: "Идёт сейчас",
  back_to_meetings: "Назад к встречам",

  // Search & Filters
  filters: "Фильтры",
  clear_filters: "Очистить фильтры",
  search_placeholder: "Поиск",
  search_min_chars: "Введите не менее 3 символов.",
  scheduled: "Запланировано",
  filters_unavailable:
    "Фильтры временно недоступны. Пожалуйста, повторите попытку через момент.",
  retry: "Повторить",

  // Filter section headings
  filter_day_time: "День и время",
  filter_meeting_type: "Тип встречи",
  filter_formats: "Форматы",
  filter_features: "Особенности",
  filter_communities: "Сообщества",
  filter_languages: "Языки",

  // Days
  day: "День",
  monday: "Понедельник",
  tuesday: "Вторник",
  wednesday: "Среда",
  thursday: "Четверг",
  friday: "Пятница",
  saturday: "Суббота",
  sunday: "Воскресенье",

  // Time frames
  time: "Время",
  morning: "Утро (4–11)",
  midday: "Полдень (11–13)",
  afternoon: "День (13–17)",
  evening: "Вечер (17–21)",
  night: "Ночь (21–4)",

  // Meeting list
  meetings: "Встречи",
  meetings_summary: "({{total}} всего результатов; загружено {{shown}}.)",
  no_results: "Встречи по вашим критериям не найдены.",

  // Meeting time
  today: "Сегодня",
  tomorrow: "Завтра",
  yesterday: "Вчера",
  in_days: "Через {{count}} дн.",
  days_ago: "{{count}} дн. назад",
  originally: "(изначально {{day}})",
  meeting_time_label: "Время встречи:",
  your_local_time: "(ваше местное время)",
  your_time: "Ваше время: {{time}}",
  your_local_time_label: "Ваше местное время:",
  at: "в",

  // Meeting detail page
  meeting_details: "Детали встречи",
  meeting_information: "Информация о встрече",
  meeting_categories: "Категории встречи",
  additional_categories: "Дополнительные категории:",
  meeting_id: "ID встречи",
  group_id: "ID группы",
  meeting_time: "Время встречи",
  your_local_time_heading: "Ваше местное время",
  conference_provider: "Провайдер конференции",
  minutes: "{{count}} мин.",

  // Group info
  about_this_group: "О группе",
  group_notes: "Заметки группы",
  all_meetings: "{{name}} — Все встречи",

  // Actions
  join: "Войти",
  join_meeting: "Войти на встречу",
  join_service: "Войти через {{service}}",
  join_service_meeting: "Войти на встречу в {{service}}",
  send_email: "Отправить письмо",
  email_group: "Написать группе",
  email: "Эл. почта",
  visit_website: "Перейти на сайт",
  website: "Сайт",

  // Calendar
  add_to_calendar: "Добавить в календарь",
  calendar: "Календарь",
  add: "Добавить",
  add_event: "Добавить событие",
  single_event: "Разовое событие",
  single_event_ics: "Разовое событие (.ics (mac))",
  recurring_series: "Повторяющаяся серия (еженедельно)",
  recurring_series_ics: "Повторяющаяся серия (.ics (mac))",
  ics_mac: ".ics (mac)",
  google: "Google",
  google_calendar: "Google Календарь",
  outlook: "Outlook",
  quick_add: "Быстрое добавление:",
  calendar_events_note:
    "События содержат ссылки на встречу, номера телефонов и напоминания.",
  online_meeting: "Онлайн-встреча",
  meeting_reminder: "Напоминание о встрече",

  // ICS content strings
  ics_join: "Войти на встречу: {{url}}",
  ics_phone: "Телефон: {{phone}}",
  ics_contact: "Контакт: {{email}}",
  ics_website: "Сайт: {{url}}",
  ics_join_short: "Войти: {{url}}",

  // Meeting types
  types: {
    O: "Открытая",
    C: "Закрытая",
  },

  // Formats
  formats: {
    "11": "Медитация 11-го шага",
    "12x12": "12 шагов и 12 традиций",
    A: "Светская",
    ABSI: "Как это видит Билл",
    B: "Большая книга",
    BE: "Для новоприбывших",
    D: "Обсуждение",
    DR: "Ежедневные размышления",
    GR: "Grapevine",
    H: "День рождения трезвости",
    LIT: "Литература",
    LS: "Жить трезво",
    MED: "Медитация",
    SP: "Выступающий",
    ST: "Изучение шагов",
    TR: "Изучение традиций",
  },

  // Features
  features: {
    "AL-AN": "Одновременно с Al-Anon",
    AL: "Одновременно с Alateen",
    ASL: "Американский язык жестов",
    BA: "Детский уголок",
    BRK: "Завтрак",
    CAN: "При свечах",
    CF: "Можно с детьми",
    DB: "Цифровая корзина",
    FF: "Без ароматизаторов",
    OUT: "На открытом воздухе",
    POA: "Подтверждение присутствия",
    RSL: "Русский язык жестов",
    SM: "Курение разрешено",
    TC: "Место временно закрыто",
    X: "Доступно для колясок",
    XB: "Туалет для колясок",
    XT: "Перекрёстный разговор разрешён",
  },

  // Communities
  communities: {
    M: "Мужчины",
    W: "Женщины",
    DD: "Двойной диагноз",
    LGBTQ: "ЛГБТК+",
    BI: "Бисексуалы",
    G: "Геи",
    L: "Лесбиянки",
    T: "Трансгендеры",
    SEN: "Пожилые",
    Y: "Молодёжь",
    POC: "Люди небелой расы",
    N: "Коренные американцы",
    NDG: "Коренные народы",
    "BV-I": "Незрячие / Слабовидящие",
    "D-HOH": "Глухие / Слабослышащие",
    "LO-I": "Одиночки / Изоляционисты",
    P: "Профессионалы",
  },

  // Languages
  languages: {
    am: "Амхарский",
    bg: "Болгарский",
    de: "Немецкий",
    el: "Греческий",
    en: "Английский",
    es: "Испанский",
    fa: "Персидский",
    fr: "Французский",
    hi: "Хинди",
    hu: "Венгерский",
    it: "Итальянский",
    ja: "Японский",
    ko: "Корейский",
    lt: "Литовский",
    ml: "Малаялам",
    mt: "Мальтийский",
    pa: "Панджаби",
    pl: "Польский",
    pt: "Португальский",
    ru: "Русский",
    sv: "Шведский",
  },
}

export default ru
