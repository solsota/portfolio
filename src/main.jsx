import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LanguageProvider from './i18n/LanguageProvider.jsx'
import ThemeProvider from './theme/ThemeProvider.jsx'

// An open tab can request a lazy chunk from a release that Hosting has removed.
// Refresh once per build so it recovers the current routes without a reload loop.
window.addEventListener('vite:preloadError', event => {
  if (!navigator.onLine) return
  try {
    const key = 'portfolio-preload-recovery'
    if (sessionStorage.getItem(key) === import.meta.url) return
    sessionStorage.setItem(key, import.meta.url)
  } catch { return }
  event.preventDefault()
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
