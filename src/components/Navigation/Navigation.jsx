import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ArrowUpRight, Moon, Sun } from 'lucide-react'
import { workProjects } from '../../data/workProjects'
import { useLanguage } from '../../i18n/LanguageContext'
import { useTheme } from '../../theme/ThemeContext'
import './Navigation.css'

export default function Navigation() {
  const { language, setLanguage, t, href } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [workOpen, setWorkOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const workRef = useRef(null)
  const triggerRef = useRef(null)
  const languageRef = useRef(null)
  const languageTriggerRef = useRef(null)
  const openedOnHoverRef = useRef(false)

  useEffect(() => {
    if (!workOpen && !languageOpen) return

    const closeOutside = (event) => {
      if (!workRef.current?.contains(event.target)) setWorkOpen(false)
      if (!languageRef.current?.contains(event.target)) {
        setLanguageOpen(false)
        openedOnHoverRef.current = false
      }
    }

    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [workOpen, languageOpen])

  const handleLanguageKeys = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      setLanguageOpen(false)
      openedOnHoverRef.current = false
      languageTriggerRef.current.focus()
      return
    }

    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    setWorkOpen(false)
    setLanguageOpen(true)
    openedOnHoverRef.current = false
    const fromTrigger = event.target === languageTriggerRef.current
    requestAnimationFrame(() => {
      const options = [...languageRef.current.querySelectorAll('[role="menuitemradio"]')]
      const current = options.indexOf(document.activeElement)
      let next
      if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = options.length - 1
      else if (fromTrigger) next = event.key === 'ArrowUp' ? options.length - 1 : 0
      else next = (current + (event.key === 'ArrowUp' ? -1 : 1) + options.length) % options.length
      options[next]?.focus()
    })
  }

  return (
    <header className={`navbar${workOpen || languageOpen ? ' has-open-menu' : ''}`}>
      <nav className="navigation" aria-label={t('Main navigation')}>
        <div
          className="navigation-language"
          ref={languageRef}
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse') {
              if (!languageOpen) openedOnHoverRef.current = true
              setLanguageOpen(true)
              setWorkOpen(false)
            }
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse' && !languageRef.current.contains(document.activeElement)) {
              setLanguageOpen(false)
              openedOnHoverRef.current = false
            }
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setLanguageOpen(false)
          }}
          onKeyDown={handleLanguageKeys}
        >
          <button
            ref={languageTriggerRef}
            className={`language-toggle${languageOpen ? ' is-open' : ''}`}
            type="button"
            aria-label={t('Choose language')}
            aria-haspopup="menu"
            aria-expanded={languageOpen}
            aria-controls="language-dropdown"
            onClick={(event) => {
              // A first mouse click should keep the menu opened by hover.
              if (event.detail > 0 && openedOnHoverRef.current) setLanguageOpen(true)
              else setLanguageOpen((open) => !open)
              openedOnHoverRef.current = false
              setWorkOpen(false)
            }}
          >
            EN/ES
          </button>
          <div id="language-dropdown" className="language-dropdown" hidden={!languageOpen}>
            <div className="work-dropdown-panel" role="menu" aria-label={t('Choose language')}>
              {[{ code: 'en', label: 'English' }, { code: 'es', label: 'Español' }].map((option) => (
                <button
                  key={option.code}
                  type="button"
                  role="menuitemradio"
                  lang={option.code}
                  aria-checked={language === option.code}
                  className="language-option"
                  onClick={() => {
                    setLanguage(option.code)
                    setLanguageOpen(false)
                    openedOnHoverRef.current = false
                    languageTriggerRef.current.focus({ preventScroll: true })
                  }}
                >
                  {option.label}
                  <span className="language-option-check" aria-hidden="true">{language === option.code ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="navigation-work"
          ref={workRef}
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse') {
              setWorkOpen(true)
              setLanguageOpen(false)
            }
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse' && !workRef.current.contains(document.activeElement)) {
              setWorkOpen(false)
            }
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setWorkOpen(false)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              event.stopPropagation()
              setWorkOpen(false)
              triggerRef.current.focus()
            }
            if (event.key === 'ArrowDown' && event.target === triggerRef.current) {
              event.preventDefault()
              setWorkOpen(true)
              setLanguageOpen(false)
              requestAnimationFrame(() => workRef.current.querySelector('.work-dropdown a')?.focus())
            }
          }}
        >
          <button
            ref={triggerRef}
            type="button"
            className={`navigation-link work-trigger${workOpen ? ' is-open' : ''}`}
            aria-expanded={workOpen}
            aria-controls="work-dropdown"
            onClick={() => {
              setWorkOpen((open) => !open)
              setLanguageOpen(false)
            }}
          >
            {t('Work')}
            <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
          </button>

          <div id="work-dropdown" className="work-dropdown" hidden={!workOpen}>
            <div className="work-dropdown-panel">
              <span className="work-dropdown-label">{t('Featured')}</span>
              <ul className="work-project-list">
                {workProjects.filter(project => project.featured).slice(0, 3).map((project) => (
                  <li key={project.id}>
                    <a href={href(project.path)} onClick={() => setWorkOpen(false)}>
                      <span>
                        <strong>{project.title}</strong>
                        <small>{t(project.description)}</small>
                      </span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              <a className="work-view-all" href={href('/#projects')} onClick={() => setWorkOpen(false)}>
                {t('Explore the archive')} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        <a className="navigation-link" href={href('/#about')}>{t('About me')}</a>
        <a className="navigation-link" href={href('/#contact')}>{t('Contact')}</a>
        <button
          type="button"
          role="switch"
          aria-checked={theme === 'dark'}
          aria-label={t('Night mode')}
          title={t(theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode')}
          className="theme-toggle"
          onClick={() => {
            toggleTheme()
            setWorkOpen(false)
            setLanguageOpen(false)
          }}
        >
          {theme === 'dark'
            ? <Sun size={18} strokeWidth={1.8} aria-hidden="true" />
            : <Moon size={18} strokeWidth={1.8} aria-hidden="true" />}
        </button>
      </nav>
    </header>
  )
}
