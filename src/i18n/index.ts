import type { Resource } from "i18next"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en"
import es from "./locales/es"
import fa from "./locales/fa"
import fr from "./locales/fr"
import it from "./locales/it"
import ja from "./locales/ja"
import pt from "./locales/pt"
import ru from "./locales/ru"

const resources: Resource = {
  en: { translation: en },
  es: { translation: es },
  fa: { translation: fa },
  fr: { translation: fr },
  it: { translation: it },
  ja: { translation: ja },
  pt: { translation: pt },
  ru: { translation: ru },
}

function detectLanguage(): string {
  // WordPress/WPML provides language via global config
  const wpLang = window.OIAA_CONFIG?.language
  if (wpLang && wpLang in resources) return wpLang

  // Fall back to browser language detection
  const browserLangs = navigator.languages
  for (const lang of browserLangs) {
    const code = lang.split("-")[0].toLowerCase()
    if (code in resources) return code
  }

  return "en"
}

void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes
  },
})

export default i18n
