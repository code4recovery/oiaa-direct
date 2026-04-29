import type { TranslationStrings } from "./en"

const pt: TranslationStrings = {
  // Common
  ongoing: "Em andamento",
  back_to_meetings: "Voltar às reuniões",

  // Search & Filters
  filters: "Filtros",
  clear_filters: "Limpar filtros",
  search_placeholder: "Pesquisar reuniões...",
  search_min_chars: "Digite pelo menos 3 caracteres.",
  scheduled: "Agendada",
  filters_unavailable:
    "Os filtros estão temporariamente indisponíveis. Por favor, tente novamente em breve.",
  retry: "Tentar novamente",

  // Filter section headings
  filter_day_time: "Dia e hora",
  filter_meeting_type: "Tipo de reunião",
  filter_formats: "Formatos",
  filter_features: "Recursos",
  filter_communities: "Comunidades",
  filter_languages: "Idiomas",

  // Days
  day: "Dia",
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",

  // Time frames
  time: "Hora",
  morning: "Manhã (4h–11h)",
  midday: "Meio-dia (11h–13h)",
  afternoon: "Tarde (13h–17h)",
  evening: "Início da noite (17h–21h)",
  night: "Noite (21h–4h)",

  // Meeting list
  meetings: "Reuniões",
  meetings_summary: "({{total}} resultados no total; {{shown}} carregados.)",
  no_results: "Nenhuma reunião encontrada com os critérios informados.",

  // Meeting time
  today: "Hoje",
  tomorrow: "Amanhã",
  yesterday: "Ontem",
  in_days: "Em {{count}} dias",
  days_ago: "Há {{count}} dias",
  originally: "(originalmente {{day}})",
  meeting_time_label: "Horário da reunião:",
  your_local_time: "(seu horário local)",
  your_time: "Seu horário: {{time}}",
  your_local_time_label: "Seu horário local:",
  at: "às",

  // Meeting detail page
  meeting_details: "Detalhes da reunião",
  meeting_information: "Informações da reunião",
  meeting_categories: "Categorias da reunião",
  additional_categories: "Categorias adicionais:",
  meeting_id: "ID da reunião",
  group_id: "ID do grupo",
  meeting_time: "Horário da reunião",
  your_local_time_heading: "Seu horário local",
  conference_provider: "Provedor de conferência",
  minutes: "{{count}} minutos",

  // Group info
  about_this_group: "Sobre este grupo",
  group_notes: "Notas do grupo",
  all_meetings: "{{name}} - Todas as reuniões",

  // Actions
  join: "Entrar",
  join_meeting: "Entrar na reunião",
  join_service: "Entrar no {{service}}",
  join_service_meeting: "Entrar na reunião do {{service}}",
  send_email: "Enviar e-mail",
  email_group: "Enviar e-mail ao grupo",
  email: "E-mail",
  visit_website: "Visitar site",
  website: "Site",

  // Calendar
  add_to_calendar: "Adicionar ao calendário",
  calendar: "Calendário",
  add: "Adicionar",
  add_event: "Adicionar evento",
  single_event: "Evento único",
  single_event_ics: "Evento único (.ics (mac))",
  recurring_series: "Série recorrente (semanal)",
  recurring_series_ics: "Série recorrente (.ics (mac))",
  google_calendar: "Google Agenda",
  quick_add: "Adição rápida:",
  calendar_events_note:
    "Os eventos incluem links de reunião, números de telefone e lembretes.",
  online_meeting: "Reunião online",
  meeting_reminder: "Lembrete de reunião",

  // ICS content strings
  ics_join: "Entrar na reunião: {{url}}",
  ics_phone: "Telefone: {{phone}}",
  ics_contact: "Contato: {{email}}",
  ics_website: "Site: {{url}}",
  ics_join_short: "Entrar: {{url}}",

  // Meeting types
  types: {
    O: "Aberta",
    C: "Fechada",
  },

  // Formats
  formats: {
    "11": "Meditação do 11º Passo",
    "12x12": "12 Passos & 12 Tradições",
    A: "Secular",
    ABSI: "Como Bill Vê",
    B: "Livro Grande",
    BE: "Recém-chegados",
    D: "Discussão",
    DR: "Reflexões Diárias",
    GR: "Grapevine",
    H: "Aniversário",
    LIT: "Literatura",
    LS: "Vivendo Sóbrio",
    MED: "Meditação",
    SP: "Palestrante",
    ST: "Estudo dos Passos",
    TR: "Estudo das Tradições",
  },

  // Features
  features: {
    "AL-AN": "Simultâneo com Al-Anon",
    AL: "Simultâneo com Alateen",
    ASL: "Língua de Sinais Americana",
    BA: "Babá disponível",
    BRK: "Café da manhã",
    CAN: "À luz de velas",
    CF: "Adequado para crianças",
    DB: "Cesta digital",
    FF: "Sem fragrâncias",
    OUT: "Ao ar livre",
    POA: "Comprovante de presença",
    RSL: "Língua de Sinais Russa",
    SM: "Fumar permitido",
    TC: "Local temporariamente fechado",
    X: "Acesso para cadeira de rodas",
    XB: "Banheiro acessível para cadeira de rodas",
    XT: "Cross Talk permitido",
  },

  // Communities
  communities: {
    M: "Homens",
    W: "Mulheres",
    DD: "Diagnóstico duplo",
    LGBTQ: "LGBTQIAA+",
    BI: "Bissexual",
    G: "Gay",
    L: "Lésbica",
    T: "Transgênero",
    SEN: "Idosos",
    Y: "Jovens",
    POC: "Pessoas de cor",
    N: "Nativos americanos",
    NDG: "Indígenas",
    "BV-I": "Cegos / Deficientes visuais",
    "D-HOH": "Surdos / Com deficiência auditiva",
    "LO-I": "Solitários / Isolacionistas",
    P: "Profissionais",
  },

  // Languages
  languages: {
    am: "Amárico",
    bg: "Búlgaro",
    de: "Alemão",
    el: "Grego",
    en: "Inglês",
    es: "Espanhol",
    fa: "Persa",
    fr: "Francês",
    hi: "Hindi",
    hu: "Húngaro",
    it: "Italiano",
    ja: "Japonês",
    ko: "Coreano",
    lt: "Lituano",
    ml: "Malaiala",
    mt: "Maltês",
    pa: "Punjabi",
    pl: "Polonês",
    pt: "Português",
    ru: "Russo",
    sv: "Sueco",
  },
}

export default pt
