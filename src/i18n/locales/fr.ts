import type { TranslationStrings } from "./en"

const fr: TranslationStrings = {
  // Common
  ongoing: "En cours",
  back_to_meetings: "Retour aux réunions",

  // Search & Filters
  filters: "Filtres",
  clear_filters: "Effacer les filtres",
  search_placeholder: "Rechercher",
  search_min_chars: "Entrez au moins 3 caractères.",
  scheduled: "Planifiée",
  filters_unavailable:
    "Les filtres sont temporairement indisponibles. Veuillez réessayer dans un moment.",
  retry: "Réessayer",

  // Filter section headings
  filter_day_time: "Jour et heure",
  filter_meeting_type: "Type de réunion",
  filter_formats: "Formats",
  filter_features: "Caractéristiques",
  filter_communities: "Communautés",
  filter_languages: "Langues",

  // Days
  day: "Jour",
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",

  // Time frames
  time: "Heure",
  morning: "Matin (4h–11h)",
  midday: "Midi (11h–13h)",
  afternoon: "Après-midi (13h–17h)",
  evening: "Soirée (17h–21h)",
  night: "Nuit (21h–4h)",

  // Meeting list
  meetings: "Réunions",
  meetings_summary: "({{total}} résultats au total ; {{shown}} chargés.)",
  no_results: "Aucune réunion ne correspond à vos critères.",

  // Meeting time
  today: "Aujourd'hui",
  tomorrow: "Demain",
  yesterday: "Hier",
  in_days: "Dans {{count}} jours",
  days_ago: "Il y a {{count}} jours",
  originally: "(initialement {{day}})",
  meeting_time_label: "Heure de la réunion :",
  your_local_time: "(votre heure locale)",
  your_time: "Votre heure : {{time}}",
  your_local_time_label: "Votre heure locale :",
  at: "à",

  // Meeting detail page
  meeting_details: "Détails de la réunion",
  meeting_information: "Informations sur la réunion",
  meeting_categories: "Catégories de la réunion",
  additional_categories: "Catégories supplémentaires :",
  meeting_id: "ID de réunion",
  group_id: "ID de groupe",
  meeting_time: "Heure de la réunion",
  your_local_time_heading: "Votre heure locale",
  conference_provider: "Fournisseur de conférence",
  minutes: "{{count}} minutes",

  // Group info
  about_this_group: "À propos de ce groupe",
  group_notes: "Notes du groupe",
  all_meetings: "{{name}} - Toutes les réunions",

  // Actions
  join: "Rejoindre",
  join_meeting: "Rejoindre la réunion",
  join_service: "Rejoindre {{service}}",
  join_service_meeting: "Rejoindre la réunion {{service}}",
  send_email: "Envoyer un courriel",
  email_group: "Envoyer un courriel au groupe",
  email: "Courriel",
  visit_website: "Visiter le site web",
  website: "Site web",

  // Calendar
  add_to_calendar: "Ajouter au calendrier",
  calendar: "Calendrier",
  add: "Ajouter",
  add_event: "Ajouter un événement",
  single_event: "Événement unique",
  single_event_ics: "Événement unique (.ics (mac))",
  recurring_series: "Série récurrente (hebdomadaire)",
  recurring_series_ics: "Série récurrente (.ics (mac))",
  ics_mac: ".ics (mac)",
  google: "Google",
  google_calendar: "Google Agenda",
  outlook: "Outlook",
  quick_add: "Ajout rapide :",
  calendar_events_note:
    "Les événements incluent les liens de réunion, les numéros de téléphone et les rappels.",
  online_meeting: "Réunion en ligne",
  meeting_reminder: "Rappel de réunion",

  // ICS content strings
  ics_join: "Rejoindre la réunion : {{url}}",
  ics_phone: "Téléphone : {{phone}}",
  ics_contact: "Contact : {{email}}",
  ics_website: "Site web : {{url}}",
  ics_join_short: "Rejoindre : {{url}}",

  // Meeting types
  types: {
    O: "Ouverte",
    C: "Fermée",
  },

  // Formats
  formats: {
    "11": "Méditation sur la 11e étape",
    "12x12": "12 Étapes & 12 Traditions",
    A: "Séculier",
    ABSI: "Comme le voit Bill",
    B: "Gros Livre",
    BE: "Nouveau venu",
    D: "Discussion",
    DR: "Réflexions quotidiennes",
    GR: "Grapevine",
    H: "Anniversaire",
    LIT: "Littérature",
    LS: "Vivre sobre",
    MED: "Méditation",
    SP: "Conférencier",
    ST: "Étude des étapes",
    TR: "Étude des traditions",
  },

  // Features
  features: {
    "AL-AN": "En parallèle avec Al-Anon",
    AL: "En parallèle avec Alateen",
    ASL: "Langue des signes américaine",
    BA: "Garde d'enfants disponible",
    BRK: "Petit-déjeuner",
    CAN: "À la bougie",
    CF: "Accueillant pour les enfants",
    DB: "Panier numérique",
    FF: "Sans parfum",
    OUT: "En plein air",
    POA: "Attestation de présence",
    RSL: "Langue des signes russe",
    SM: "Fumeurs autorisés",
    TC: "Lieu temporairement fermé",
    X: "Accès fauteuil roulant",
    XB: "Salle de bain accessible en fauteuil roulant",
    XT: "Crosstalk autorisé",
  },

  // Communities
  communities: {
    M: "Hommes",
    W: "Femmes",
    DD: "Double diagnostic",
    LGBTQ: "LGBTQIAA+",
    BI: "Bisexuel(le)",
    G: "Gay",
    L: "Lesbienne",
    T: "Transgenre",
    SEN: "Séniors",
    Y: "Jeunes",
    POC: "Personnes de couleur",
    N: "Amérindiens",
    NDG: "Autochtones",
    "BV-I": "Aveugles / Malvoyants",
    "D-HOH": "Sourds / Malentendants",
    "LO-I": "Solitaires / Isolationnistes",
    P: "Professionnels",
  },

  // Languages
  languages: {
    am: "Amharique",
    bg: "Bulgare",
    de: "Allemand",
    el: "Grec",
    en: "Anglais",
    es: "Espagnol",
    fa: "Persan",
    fr: "Français",
    hi: "Hindi",
    hu: "Hongrois",
    it: "Italien",
    ja: "Japonais",
    ko: "Coréen",
    lt: "Lituanien",
    ml: "Malayâlam",
    mt: "Maltais",
    pa: "Pendjabi",
    pl: "Polonais",
    pt: "Portugais",
    ru: "Russe",
    sv: "Suédois",
  },
}

export default fr
