import type { TranslationStrings } from "./en"

const it: TranslationStrings = {
  // Common
  ongoing: "In corso",
  back_to_meetings: "Torna alle riunioni",

  // Search & Filters
  filters: "Filtri",
  clear_filters: "Cancella filtri",
  search_placeholder: "Cerca riunioni...",
  search_min_chars: "Inserisci almeno 3 caratteri.",
  scheduled: "Programmata",
  filters_unavailable:
    "I filtri sono temporaneamente non disponibili. Riprova tra un momento.",
  retry: "Riprova",

  // Filter section headings
  filter_day_time: "Giorno e ora",
  filter_meeting_type: "Tipo di riunione",
  filter_formats: "Formati",
  filter_features: "Caratteristiche",
  filter_communities: "Comunità",
  filter_languages: "Lingue",

  // Days
  day: "Giorno",
  monday: "Lunedì",
  tuesday: "Martedì",
  wednesday: "Mercoledì",
  thursday: "Giovedì",
  friday: "Venerdì",
  saturday: "Sabato",
  sunday: "Domenica",

  // Time frames
  time: "Ora",
  morning: "Mattina (4–11)",
  midday: "Mezzogiorno (11–13)",
  afternoon: "Pomeriggio (13–17)",
  evening: "Sera (17–21)",
  night: "Notte (21–4)",

  // Meeting list
  meetings: "Riunioni",
  meetings_summary: "({{total}} risultati totali; {{shown}} caricati.)",
  no_results: "Nessuna riunione trovata corrispondente ai criteri.",

  // Meeting time
  today: "Oggi",
  tomorrow: "Domani",
  yesterday: "Ieri",
  in_days: "Tra {{count}} giorni",
  days_ago: "{{count}} giorni fa",
  originally: "(originariamente {{day}})",
  meeting_time_label: "Orario della riunione:",
  your_local_time: "(ora locale)",
  your_time: "La tua ora: {{time}}",
  your_local_time_label: "La tua ora locale:",
  at: "alle",

  // Meeting detail page
  meeting_details: "Dettagli della riunione",
  meeting_information: "Informazioni sulla riunione",
  meeting_categories: "Categorie della riunione",
  additional_categories: "Categorie aggiuntive:",
  meeting_id: "ID riunione",
  group_id: "ID gruppo",
  meeting_time: "Orario della riunione",
  your_local_time_heading: "La tua ora locale",
  conference_provider: "Fornitore conferenza",
  minutes: "{{count}} minuti",

  // Group info
  about_this_group: "Informazioni su questo gruppo",
  group_notes: "Note del gruppo",
  all_meetings: "{{name}} - Tutte le riunioni",

  // Actions
  join: "Partecipa",
  join_meeting: "Partecipa alla riunione",
  join_service: "Partecipa a {{service}}",
  join_service_meeting: "Partecipa alla riunione {{service}}",
  send_email: "Invia email",
  email_group: "Invia email al gruppo",
  email: "Email",
  visit_website: "Visita il sito web",
  website: "Sito web",

  // Calendar
  add_to_calendar: "Aggiungi al calendario",
  calendar: "Calendario",
  add: "Aggiungi",
  add_event: "Aggiungi evento",
  single_event: "Evento singolo",
  single_event_ics: "Evento singolo (.ics (mac))",
  recurring_series: "Serie ricorrente (settimanale)",
  recurring_series_ics: "Serie ricorrente (.ics (mac))",
  google_calendar: "Google Calendar",
  quick_add: "Aggiunta rapida:",
  calendar_events_note:
    "Gli eventi includono link per la riunione, numeri di telefono e promemoria.",
  online_meeting: "Riunione online",
  meeting_reminder: "Promemoria riunione",

  // ICS content strings
  ics_join: "Partecipa alla riunione: {{url}}",
  ics_phone: "Telefono: {{phone}}",
  ics_contact: "Contatto: {{email}}",
  ics_website: "Sito web: {{url}}",
  ics_join_short: "Partecipa: {{url}}",

  // Meeting types
  types: {
    O: "Aperta",
    C: "Chiusa",
  },

  // Formats
  formats: {
    "11": "Meditazione dell'11° Passo",
    "12x12": "12 Passi & 12 Tradizioni",
    A: "Laico",
    ABSI: "Come la vede Bill",
    B: "Il Grande Libro",
    BE: "Neofiti",
    D: "Discussione",
    DR: "Riflessioni quotidiane",
    GR: "Grapevine",
    H: "Compleanno di sobrietà",
    LIT: "Letteratura",
    LS: "Vivere da sobri",
    MED: "Meditazione",
    SP: "Relatore",
    ST: "Studio dei Passi",
    TR: "Studio delle Tradizioni",
  },

  // Features
  features: {
    "AL-AN": "Contemporaneo con Al-Anon",
    AL: "Contemporaneo con Alateen",
    ASL: "Lingua dei segni americana",
    BA: "Babysitter disponibile",
    BRK: "Colazione",
    CAN: "A lume di candela",
    CF: "Adatto ai bambini",
    DB: "Cestino digitale",
    FF: "Senza profumi",
    OUT: "All'aperto",
    POA: "Attestato di presenza",
    RSL: "Lingua dei segni russa",
    SM: "Fumatori ammessi",
    TC: "Sede temporaneamente chiusa",
    X: "Accesso per sedie a rotelle",
    XB: "Bagno accessibile per sedie a rotelle",
    XT: "Cross Talk consentito",
  },

  // Communities
  communities: {
    M: "Uomini",
    W: "Donne",
    DD: "Doppia diagnosi",
    LGBTQ: "LGBTQIAA+",
    BI: "Bisessuale",
    G: "Gay",
    L: "Lesbica",
    T: "Transgender",
    SEN: "Anziani",
    Y: "Giovani",
    POC: "Persone di colore",
    N: "Nativi americani",
    NDG: "Indigeni",
    "BV-I": "Ciechi / Ipovedenti",
    "D-HOH": "Sordi / Ipoudenti",
    "LO-I": "Solitari / Isolazionisti",
    P: "Professionisti",
  },

  // Languages
  languages: {
    am: "Amarico",
    bg: "Bulgaro",
    de: "Tedesco",
    el: "Greco",
    en: "Inglese",
    es: "Spagnolo",
    fa: "Persiano",
    fr: "Francese",
    hi: "Hindi",
    hu: "Ungherese",
    it: "Italiano",
    ja: "Giapponese",
    ko: "Coreano",
    lt: "Lituano",
    ml: "Malayalam",
    mt: "Maltese",
    pa: "Punjabi",
    pl: "Polacco",
    pt: "Portoghese",
    ru: "Russo",
    sv: "Svedese",
  },
}

export default it
