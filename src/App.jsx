import { useLanguage } from './i18n/LanguageContext'
import { lazy, Suspense, useLayoutEffect, useRef, useSyncExternalStore } from 'react'
import './App.css'

import HeroParallaxBackground from './components/HeroParallaxBackground/HeroParallaxBackground'
import BubblePage from './components/BubblePage/BubblePage'
import Navigation from './components/Navigation/Navigation'
import Footer from './components/Footer/Footer'
import ResumeSection from './components/ResumeSection/ResumeSection'
import { workProjects } from './data/workProjects'
import { getLocation, navigate, subscribeLocation, withoutLanguagePrefix } from './routing/location'

const Lanyard = lazy(() => import('./components/Lanyard/Lanyard'))
const ProjectPage = lazy(() => import('./components/ProjectPage/ProjectPage'))
const AdimensionalPage = lazy(() => import('./components/AdimensionalPage/AdimensionalPage'))
const UltimoTurnoPage = lazy(() => import('./components/UltimoTurnoPage/UltimoTurnoPage'))

function ProjectView({ project, hash }) {
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = hash && document.getElementById(hash.slice(1))
      if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, project.id])

  if (project.kind === 'ultimo-turno') return <UltimoTurnoPage key={project.id} />

  return project.kind === 'adimensional'
    ? <AdimensionalPage key={project.id} />
    : <ProjectPage key={project.id} project={project} />
}

function handleSiteNavigation(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = event.target.closest('a[href]')
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
  const url = new URL(link.href)
  if (url.origin !== window.location.origin) return
  const route = withoutLanguagePrefix(url.pathname)
  if (route !== '/' && !workProjects.some((project) => project.path === route)) return
  event.preventDefault()
  navigate(url)
}



function App() {
  const { t, href } = useLanguage()

  const portfolioRef = useRef(null)
  const heroContentRef = useRef(null)
  const location = useSyncExternalStore(subscribeLocation, getLocation)
  const { pathname, hash } = new URL(location)
  const route = withoutLanguagePrefix(pathname)
  const legacyProject = workProjects.find((item) => `#${item.id}` === hash)
  const project = workProjects.find((item) => item.path === route) || legacyProject

  useLayoutEffect(() => {
    const content = heroContentRef.current
    const portfolio = portfolioRef.current
    if (!content || !portfolio) return
    const measure = () => {
      portfolio.style.setProperty('--hero-copy-bottom', `${content.offsetTop + content.offsetHeight}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [project])

  useLayoutEffect(() => {
    if (!legacyProject) return
    const target = new URL(href(legacyProject.path), window.location.origin)
    target.search = window.location.search
    navigate(target, { replace: true })
  }, [legacyProject, href])

  useLayoutEffect(() => {
    if (!project) document.title = t('Sol Masetti — Portfolio')
  }, [project, t])

  useLayoutEffect(() => {
    if (project) {
      const target = hash && document.getElementById(hash.slice(1))
      if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' })
      else window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    // Home sections mount again when returning from a project view.
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1) || 'home')
      target?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, project, route])

  return (
    <div className={`portfolio${project?.kind === 'ultimo-turno' ? ' portfolio-ultimo-turno' : ''}`} ref={portfolioRef} onClick={handleSiteNavigation}>

      <Navigation />


      <main>
        {project ? (
          <Suspense fallback={<div className="project-loading" aria-busy="true" />}>
            <ProjectView project={project} hash={hash} />
          </Suspense>
        ) : (
          <>

        <section
          className="hero"
          id="home"
        >

          <HeroParallaxBackground
          />


          <div className="hero-content" ref={heroContentRef}>

            <h1 className="archive-title" lang="en" aria-label="SOL's creative archive">

              <span className="archive-top">

                <span className="sols">SOL's</span>

                <span className="creative">creative</span>

              </span>

              <span className="archive-word">ARCHIVE</span>

            </h1>


            <h2 className="hero-role">{t("Digital & Game Experience Designer")}</h2>


            <p className="hero-description">{t("I’m Sol, a multidisciplinary designer creating playful, intuitive and visually engaging experiences across digital products, games and creative projects.")}</p>

          </div>


          <div
            className="projects-anchor"
            id="projects"
            aria-hidden="true"
          />

          </section>

          <BubblePage />
          </>
        )}
        <ResumeSection />
      </main>

      <Footer />


      {!project && <div className="lanyard-overlay">

        <Suspense fallback={null}><Lanyard
          eventSource={portfolioRef}
          position={[0, 0.1, 11.2]}
          offset={[2.85, 0.5, 0]}
          gravity={[-7, -30, 0]}
          fov={18}
          lanyardWidth={0.7}
          frontImage="/lanyard-front.webp"
          backImage="/lanyard-back.webp"
          imageFit="cover"
        /></Suspense>

      </div>}

    </div>
  )
}

export default App
