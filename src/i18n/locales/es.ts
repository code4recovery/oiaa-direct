import type { TranslationStrings } from "./en"

const es: TranslationStrings = {
  // Common
  ongoing: "En curso",
  back_to_meetings: "Volver a reuniones",

  // Search & Filters
  filters: "Filtros",
  clear_filters: "Borrar filtros",
  search_placeholder: "Buscar",
  search_min_chars: "Ingrese al menos 3 caracteres.",
  scheduled: "Programada",
  filters_unavailable:
    "Los filtros no están disponibles temporalmente. Por favor intente de nuevo en un momento.",
  retry: "Reintentar",

  // Filter section headings
  filter_day_time: "Día y hora",
  filter_meeting_type: "Tipo de reunión",
  filter_formats: "Formatos",
  filter_features: "Características",
  filter_communities: "Comunidades",
  filter_languages: "Idiomas",

  // Days
  day: "Día",
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",

  // Time frames
  time: "Hora",
  morning: "Mañana (4–11 AM)",
  midday: "Mediodía (11 AM–1 PM)",
  afternoon: "Tarde (1–5 PM)",
  evening: "Noche temprana (5–9 PM)",
  night: "Noche (9 PM–4 AM)",

  // Meeting list
  meetings: "Reuniones",
  meetings_summary: "({{total}} resultados totales; {{shown}} cargados.)",
  no_results: "No se encontraron reuniones que coincidan con sus criterios.",

  // Meeting time
  today: "Hoy",
  tomorrow: "Mañana",
  yesterday: "Ayer",
  in_days: "En {{count}} días",
  days_ago: "Hace {{count}} días",
  originally: "(originalmente {{day}})",
  meeting_time_label: "Hora de la reunión:",
  your_local_time: "(su hora local)",
  your_time: "Su hora: {{time}}",
  your_local_time_label: "Su hora local:",
  at: "a las",

  // Meeting detail page
  meeting_details: "Detalles de la reunión",
  meeting_information: "Información de la reunión",
  meeting_categories: "Categorías de la reunión",
  additional_categories: "Categorías adicionales:",
  meeting_id: "ID de reunión",
  group_id: "ID de grupo",
  meeting_time: "Hora de la reunión",
  your_local_time_heading: "Su hora local",
  conference_provider: "Proveedor de conferencia",
  minutes: "{{count}} minutos",

  // Group info
  about_this_group: "Acerca de este grupo",
  group_notes: "Notas del grupo",
  all_meetings: "{{name}} - Todas las reuniones",

  // Actions
  join: "Unirse",
  join_meeting: "Unirse a la reunión",
  join_service: "Unirse a {{service}}",
  join_service_meeting: "Unirse a la reunión de {{service}}",
  send_email: "Enviar correo",
  email_group: "Enviar correo al grupo",
  email: "Correo",
  visit_website: "Visitar sitio web",
  website: "Sitio web",

  // Calendar
  add_to_calendar: "Agregar al calendario",
  calendar: "Calendario",
  add: "Agregar",
  add_event: "Agregar evento",
  single_event: "Evento único",
  single_event_ics: "Evento único (.ics (mac))",
  recurring_series: "Serie recurrente (semanal)",
  recurring_series_ics: "Serie recurrente (.ics (mac))",
  ics_mac: ".ics (mac)",
  google: "Google",
  google_calendar: "Google Calendar",
  outlook: "Outlook",
  quick_add: "Agregar rápido:",
  calendar_events_note:
    "Los eventos incluyen enlaces de reunión, números de teléfono y recordatorios.",
  online_meeting: "Reunión en línea",
  meeting_reminder: "Recordatorio de reunión",

  // ICS content strings
  ics_join: "Unirse a la reunión: {{url}}",
  ics_phone: "Teléfono: {{phone}}",
  ics_contact: "Contacto: {{email}}",
  ics_website: "Sitio web: {{url}}",
  ics_join_short: "Unirse: {{url}}",

  // Meeting types
  types: {
    O: "Abierta",
    C: "Cerrada",
  },

  // Formats
  formats: {
    "11": "Meditación del paso 11",
    "12x12": "12 Pasos y 12 Tradiciones",
    A: "Secular",
    ABSI: "Como lo ve Bill",
    B: "Libro Grande",
    BE: "Recién llegados",
    D: "Discusión",
    DR: "Reflexiones diarias",
    GR: "Grapevine",
    H: "Cumpleaños",
    LIT: "Literatura",
    LS: "Vivir sobrio",
    MED: "Meditación",
    SP: "Orador",
    ST: "Estudio de pasos",
    TR: "Estudio de tradiciones",
  },

  // Features
  features: {
    "AL-AN": "Simultáneo con Al-Anon",
    AL: "Simultáneo con Alateen",
    ASL: "Lenguaje de señas americano",
    BA: "Guardería disponible",
    BRK: "Desayuno",
    CAN: "A la luz de las velas",
    CF: "Apto para niños",
    DB: "Canasta digital",
    FF: "Libre de fragancias",
    OUT: "Al aire libre",
    POA: "Comprobante de asistencia",
    RSL: "Lenguaje de señas ruso",
    SM: "Se permite fumar",
    TC: "Ubicación temporalmente cerrada",
    X: "Acceso para silla de ruedas",
    XB: "Baño accesible para silla de ruedas",
    XT: "Se permite hablar entre participantes",
  },

  // Communities
  communities: {
    M: "Hombres",
    W: "Mujeres",
    DD: "Diagnóstico dual",
    LGBTQ: "LGBTQIAA+",
    BI: "Bisexual",
    G: "Gay",
    L: "Lesbiana",
    T: "Transgénero",
    SEN: "Adultos mayores",
    Y: "Jóvenes",
    POC: "Personas de color",
    N: "Nativos americanos",
    NDG: "Indígenas",
    "BV-I": "Ciegos / Discapacitados visuales",
    "D-HOH": "Sordos / Hipoacúsicos",
    "LO-I": "Solitarios / Aislacionistas",
    P: "Profesionales",
  },

  // Languages
  languages: {
    am: "Amhárico",
    bg: "Búlgaro",
    de: "Alemán",
    el: "Griego",
    en: "Inglés",
    es: "Español",
    fa: "Persa",
    fr: "Francés",
    hi: "Hindi",
    hu: "Húngaro",
    it: "Italiano",
    ja: "Japonés",
    ko: "Coreano",
    lt: "Lituano",
    ml: "Malayálam",
    mt: "Maltés",
    pa: "Punjabi",
    pl: "Polaco",
    pt: "Portugués",
    ru: "Ruso",
    sv: "Sueco",
  },
}

export default es
