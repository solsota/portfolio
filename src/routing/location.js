const navigationEvent = 'portfolio-navigation'

export const getLocation = () => window.location.href

export function subscribeLocation(onChange) {
  window.addEventListener('popstate', onChange)
  window.addEventListener('hashchange', onChange)
  window.addEventListener(navigationEvent, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener('hashchange', onChange)
    window.removeEventListener(navigationEvent, onChange)
  }
}

export function languagePrefix(pathname) {
  const firstSegment = pathname.split('/')[1]
  return firstSegment === 'es' || firstSegment === 'en' ? `/${firstSegment}` : ''
}

export function withoutLanguagePrefix(pathname) {
  return pathname.slice(languagePrefix(pathname).length).replace(/\/+$/, '') || '/'
}

export function localizedHref(path, prefix) {
  const url = new URL(path, window.location.origin)
  const route = withoutLanguagePrefix(url.pathname)
  url.pathname = route === '/' ? (prefix || '/') : `${prefix}${route}`
  return `${url.pathname}${url.search}${url.hash}`
}

export function navigate(destination, { replace = false } = {}) {
  const url = new URL(destination, window.location.href)
  if (url.href !== window.location.href) {
    window.history[replace ? 'replaceState' : 'pushState'](window.history.state, '', url)
  }
  // Repeated section links may need to reopen their panel, too.
  window.dispatchEvent(new Event(navigationEvent))
}
