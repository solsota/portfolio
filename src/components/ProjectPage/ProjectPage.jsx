import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Box, Clapperboard, Expand, Info, X } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { archiveProjects, projectText } from '../../data/archiveProjects'
import mediaSizes from '../../data/projectMediaSizes.json'
import ProjectVideo from './ProjectVideo'
import './ProjectPage.css'

export default function ProjectPage({ project }) {
  const { language, t, href } = useLanguage()
  const titleRef = useRef(null)
  const dialogRef = useRef(null)
  const [expanded, setExpanded] = useState(null)
  const copy = value => projectText(value, language)
  const next = archiveProjects[(archiveProjects.findIndex(item => item.id === project.id) + 1) % archiveProjects.length]

  useLayoutEffect(() => {
    const previousTitle = document.title
    document.title = `${project.title} — SOL’s creative archive`
    titleRef.current?.focus({ preventScroll: true })
    return () => { document.title = previousTitle }
  }, [project])

  const openMedia = media => {
    setExpanded(media)
    dialogRef.current.showModal()
  }

  const renderMedia = (media, index) => (
    <figure className={`project-evidence${media.layout ? ` project-evidence--${media.layout}` : ''}`} key={media.src || index}>
      {media.src ? (
        media.kind === 'video'
          ? <ProjectVideo media={media} label={copy(media.caption)} />
          : <button type="button" className="project-image-button" onClick={() => openMedia(media)} aria-label={`${t('View image')}: ${copy(media.caption)}`}>
              <img src={media.src} alt={copy(media.caption)} {...mediaSizes[media.src]} loading="lazy" />
              <span className="project-expand" aria-hidden="true"><Expand size={17} /></span>
            </button>
      ) : (
        <div className="project-media-pending" role="img" aria-label={copy(media.caption)}>
          {media.kind === 'pending-video' ? <Clapperboard size={34} strokeWidth={1} /> : <Box size={34} strokeWidth={1} />}
          <span>{copy(media.caption)}</span>
        </div>
      )}
      {media.src && <figcaption>{copy(media.caption)}</figcaption>}
    </figure>
  )

  return (
    <article className={`project-page project-page--${project.theme}`} id={project.id} aria-labelledby="project-title">
      <div className="project-page-inner">
        <nav className="project-breadcrumb" aria-label={t('Project navigation')}>
          <a href={href('/#projects')} className="project-back-link"><ArrowLeft size={16} aria-hidden="true" />{t('Back to work')}</a>
          <span lang="en">CREATIVE ARCHIVE / {String(archiveProjects.indexOf(project) + 1).padStart(2, '0')}</span>
        </nav>
        <header className="project-intro">
          <div className="project-intro-copy">
            <p className="project-eyebrow" lang="en">{project.type}</p>
            <h1 id="project-title" ref={titleRef} tabIndex={-1} lang="en">{project.title}</h1>
            <p className="project-overview">{copy(project.overview)}</p>
            {project.external && <a className="project-external" href={project.external.href} target="_blank" rel="noopener noreferrer" lang="en">{project.external.label}<ArrowUpRight size={18} aria-hidden="true" /></a>}
          </div>
          <figure className="project-cover">
            {project.cover ? <img src={project.cover} alt={project.title} {...mediaSizes[project.cover]} fetchPriority="high" /> : (
              <div className="project-type-cover" lang="en" aria-label={`${project.title} — visual material coming soon`}>
                {project.theme === 'environment' ? <Clapperboard size={48} strokeWidth={1} aria-hidden="true" /> : <Box size={48} strokeWidth={1} aria-hidden="true" />}
                <span>{project.theme === 'environment' ? 'Scene Study' : 'High / Low'}</span>
                <small>{project.theme === 'environment' ? 'UNREAL ENGINE' : 'BLENDER · TOPOLOGY · UVs'}</small>
              </div>
            )}
          </figure>
        </header>
        <dl className="project-facts">
          <div><dt lang="en">My role</dt><dd>{copy(project.role)}</dd></div>
          <div><dt lang="en">Context</dt><dd>{copy(project.context)}</dd></div>
          {project.tools.length > 0 && <div><dt lang="en">Tools</dt><dd>{project.tools.join(' · ')}</dd></div>}
        </dl>
        <div className="project-case-study">
          {project.sections.map((section, index) => (
            <section className={`project-case-section${section.media.length ? '' : ' project-case-section--text'}`} key={section.title} aria-labelledby={`project-section-${index}`}>
              <div className="project-section-copy">
                <span className="project-section-number" aria-hidden="true">{String(index + 1).padStart(2, '0')} /</span>
                <h2 id={`project-section-${index}`} lang="en">{section.title}</h2>
                <p>{copy(section.body)}</p>
              </div>
              {section.media.length > 0 && <div className={`project-evidence-grid${section.media.length === 1 ? ' project-evidence-grid--single' : ''}`}>{section.media.map(renderMedia)}</div>}
            </section>
          ))}
        </div>
        <aside className="project-credits" aria-labelledby="project-credits-title">
          <Info size={21} strokeWidth={1.4} aria-hidden="true" />
          <div><h2 id="project-credits-title" lang="en">Credits & scope</h2><p>{copy(project.credit)}</p>
            {project.recognition && <p className="project-recognition">{t('Academic assessment')}: <strong>{project.recognition}</strong></p>}
          </div>
        </aside>
        <nav className="project-footer" aria-label={t('Project navigation')}>
          <a href={href('/#projects')} className="project-back-link"><ArrowLeft size={16} aria-hidden="true" />{t('Back to work')}</a>
          <a href={href(next.path)} className="project-next"><small lang="en">NEXT PROJECT</small><span>{next.title}<ArrowRight size={20} aria-hidden="true" /></span></a>
        </nav>
      </div>
      <dialog className="project-lightbox" ref={dialogRef} onClose={() => setExpanded(null)} onClick={event => { if (event.target === event.currentTarget) dialogRef.current.close() }} aria-label={t('View image')}>
        <button type="button" className="project-lightbox-close" onClick={() => dialogRef.current.close()} aria-label={t('Close image')}><X size={24} /></button>
        {expanded && <figure><img src={expanded.src} alt={copy(expanded.caption)} {...mediaSizes[expanded.src]} /><figcaption>{copy(expanded.caption)}</figcaption></figure>}
      </dialog>
    </article>
  )
}
