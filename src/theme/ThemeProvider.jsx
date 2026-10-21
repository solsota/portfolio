import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContext'

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })
  const toggleTheme = useCallback(() => setTheme((current) => current === 'light' ? 'dark' : 'light'), [])
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('portfolio-theme', theme)
    } catch {
      // The control remains usable when storage is unavailable.
    }
  }, [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
