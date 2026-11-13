import i18n, { type BackendModule } from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { en, type Translation } from './locales/en'
import { loadSeoContent } from '../content/seo'
import { loadGuides } from '../content/guides'
import { toLang } from '../lib/routes'

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'tr', label: 'Türkçe' },
] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

/** English is bundled; the other UI translations load on demand (own chunk). */
const localeLoaders: Record<string, () => Promise<Translation>> = {
  tr: () => import('./locales/tr').then((m) => m.tr),
  de: () => import('./locales/de').then((m) => m.de),
  fr: () => import('./locales/fr').then((m) => m.fr),
  es: () => import('./locales/es').then((m) => m.es),
}

const lazyLocales: BackendModule = {
  type: 'backend',
  init: () => {},
  read: (lng, _ns, callback) => {
    const load = localeLoaders[lng]
    if (!load) return callback(null, {})
    load().then(
      (translation) => callback(null, translation),
      (error: Error) => callback(error, null),
    )
  },
}

const i18nReady = i18n
  .use(lazyLocales)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en } },
    // Bundled English plus lazily loaded others.
    partialBundledLanguages: true,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    interpolation: { escapeValue: false }, // React already escapes
    // Languages are loaded before they're shown (see loadLanguage), so
    // components never need to suspend.
    react: { useSuspense: false },
    detection: {
      // A language prefix in the URL (/tr/...) wins; otherwise an explicit
      // choice, then the browser language. Unprefixed URLs are English, so
      // the app moves the URL to the detected language's prefix.
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      lookupLocalStorage: 'lang',
      caches: ['localStorage'],
    },
  })

/** Page copy and guides for a language (UI strings load via i18next). */
const loadContent = (code: string) => {
  const lang = toLang(code)
  return Promise.all([loadSeoContent(lang), loadGuides(lang)])
}

/** Resolves once the starting language — UI strings, copy, guides — is ready. */
export const languageReady = i18nReady.then(() =>
  loadContent(i18n.resolvedLanguage ?? 'en'),
)

/** Switch language after everything it needs has loaded, so nothing flickers. */
export const loadLanguage = async (code: string) => {
  await Promise.all([loadContent(code), i18n.loadLanguages(code)])
  await i18n.changeLanguage(code)
}

// Keep <html lang> in sync for accessibility / SEO.
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})
document.documentElement.lang = i18n.language || 'en'

export default i18n
