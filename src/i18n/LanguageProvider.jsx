import { useCallback, useLayoutEffect, useMemo, useSyncExternalStore } from 'react'
import { LanguageContext } from './LanguageContext'
import { translate } from './translate'
import { getLocation, languagePrefix, localizedHref, navigate, subscribeLocation } from '../routing/location'

export default function LanguageProvider({ children }) {
  const location = useSyncExternalStore(subscribeLocation, getLocation)
  const prefix = languagePrefix(new URL(location).pathname)
  const language = prefix === '/es' ? 'es' : 'en'

  const chooseLanguage = useCallback((next) => {
    if (next !== 'en' && next !== 'es') return
    const url = new URL(window.location.href)
    const destination = localizedHref(`${url.pathname}${url.search}${url.hash}`, `/${next}`)
    if (new URL(destination, url).href === url.href) return
    navigate(destination)
  }, [])
  const t = useCallback((message, values) => translate(message, language, values), [language])
  const href = useCallback((path) => localizedHref(path, prefix), [prefix])
  const value = useMemo(() => ({ language, setLanguage: chooseLanguage, t, href }), [language, chooseLanguage, t, href])

  useLayoutEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
