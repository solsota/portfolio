import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Play } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import AccordionGallery from '../AccordionGallery/AccordionGallery'
import { ultimoTurnoImages, ultimoTurnoMedia, ultimoTurnoMechanics, ultimoTurnoAnimationGallery } from '../../data/ultimoTurno'
import './UltimoTurnoPage.css'

function GameMedia({ source, title, className = '' }) {
  const { t } = useLanguage()
  return (
    <figure className={`eut-media ${className}`}>
      {source ? <img src={source} alt={t(title)} loading="lazy" /> : (
        <div className="eut-media-pending" role="img" aria-label={t('{title} — animation coming soon', { title: t(title) })}>
          <Play size={28} strokeWidth={1} aria-hidden="true" />
          <span>{t(title)}</span>
          <small>{t('Animation coming soon')}</small>
        </div>
      )}
    </figure>
  )
}

function SectionHeading({ number, title, subtitle, id }) {
  const { t } = useLanguage()
  return <div className="eut-section-heading"><h2 id={id}>{number} — {t(title)}</h2><h3>{t(subtitle)}</h3></div>
}

export default function UltimoTurnoPage() {
  const { t, href } = useLanguage()
  const titleRef = useRef(null)
  const [mechanicIndex, setMechanicIndex] = useState(0)
  const mechanic = ultimoTurnoMechanics[mechanicIndex]
  const galleryItems = useMemo(() => ultimoTurnoAnimationGallery.map(item => ({
    ...item,
    label: t(item.label),
    placeholder: t('Animation coming soon'),
  })), [t])

  useLayoutEffect(() => {
    const previousTitle = document.title
    document.title = 'El Último Turno — SOL’s creative archive'
    titleRef.current?.focus({ preventScroll: true })
    return () => { document.title = previousTitle }
  }, [])

  return (
    <article className="eut-page" aria-labelledby="eut-title">
      <header className="eut-hero">
        <a className="eut-back" href={href('/#projects')}><ArrowLeft size={17} aria-hidden="true" />{t('Back to work')}</a>
        <h1 className="eut-sr-only" id="eut-title" ref={titleRef} tabIndex={-1}>El Último Turno</h1>
        <img className="eut-banner" src={ultimoTurnoImages.banner} alt={t('El Último Turno — psychological horror in a bar after dark')} fetchPriority="high" width="3896" height="1244" />
      </header>

      <section className="eut-intro" aria-label={t('About the project')}>
        <img className="eut-eva" src={ultimoTurnoImages.eva} alt="EVA 2026 — Exposición de Videojuegos Argentina" width="381" height="229" />
        <div className="eut-container">
          <p className="eut-tagline">{t('A descent into the darkest corners of consciousness.')}</p>
          <p className="eut-event">EVA 2026 · {t('Buenos Aires')}</p>
          <p className="eut-summary">{t('A psychological horror experience where routine becomes the last refuge of sanity.')}</p>
          <ul className="eut-tags" aria-label={t('Project disciplines')}>
            {['GAME UI/UX', 'UNITY DEVELOPMENT', '3D ART', '2026'].map(tag => <li key={tag}>{t(tag)}</li>)}
          </ul>
        </div>
      </section>

      <section className="eut-section eut-burgundy" id="behind-the-game" aria-labelledby="eut-behind-title">
        <div className="eut-container">
          <SectionHeading number="01" title="Behind the Game" subtitle="Where routine meets psychological horror." id="eut-behind-title" />
          <div className="eut-copy">
            <p>{t('El Último Turno is a first-person psychological horror game developed by T15 Studio. The story follows Lucas, a bartender whose nightly routine begins to unravel as his surroundings become increasingly distorted and memories of his past resurface. Through everyday tasks, exploration, and unsettling encounters, the game explores guilt, perception, and the blurred line between reality and hallucination.')}</p>
            <p>{t('Developed in Unity, the project combines environmental storytelling, interactive mechanics, and an atmosphere of gradually escalating tension. The playable demo features the first two nights of the experience.')}</p>
          </div>
          <div className="eut-split eut-contribution">
            <div className="eut-copy"><h3>{t('My Contribution')}</h3><p>{t('As a member of T15 Studio, I contributed to multiple stages of development, focusing on Game UI/UX, gameplay programming, 3D art, and visual design. My work ranged from designing and implementing user interfaces and interactive systems to creating animations, cinematic sequences, and promotional content for the game.')}</p></div>
            <GameMedia source={ultimoTurnoMedia.contribution} title="My Contribution" />
          </div>
        </div>
      </section>

      <section className="eut-section eut-charcoal" id="designing-the-experience" aria-labelledby="eut-design-title">
        <div className="eut-container eut-split eut-reverse-mobile">
          <GameMedia source={ultimoTurnoMedia.interface} title="UI/UX Design & Implementation" />
          <div className="eut-copy eut-align-right">
            <SectionHeading number="02" title="Designing the Experience" subtitle="UI/UX Design & Implementation" id="eut-design-title" />
            <p>{t('In a psychological horror game, every interface element influences the player’s sense of immersion. My approach focused on creating intuitive, responsive systems that communicate essential information without disrupting the game’s atmosphere.')}</p>
            <p>{t('I designed and implemented several UI systems, combining visual consistency, interaction feedback, and functional gameplay integration.')}</p>
          </div>
        </div>
      </section>

      <section className="eut-section eut-ink" id="hud-objectives" aria-labelledby="eut-hud-title">
        <div className="eut-container eut-split">
          <div className="eut-copy">
            <h2 id="eut-hud-title">{t('HUD & Objective System')}</h2>
            <h3>{t('Keeping players informed without breaking immersion.')}</h3>
            <p>{t('Designed and developed a dynamic objective-tracking system that adapts to different gameplay situations.')}</p>
            <p>{t('The interface includes collapsible panels, contextual task lists, completion indicators, and transitions that maintain a clean, readable HUD while allowing players to focus on their surroundings.')}</p>
          </div>
          <GameMedia source={ultimoTurnoMedia.hud} title="HUD & Objective System" />
        </div>
      </section>

      <section className="eut-section eut-burgundy" id="gameplay-mechanics" aria-labelledby="eut-mechanics-title">
        <div className="eut-container">
          <div className="eut-copy eut-centered">
            <SectionHeading number="03" title="Bringing Mechanics to Life" subtitle="Gameplay Development & Interactive Systems" id="eut-mechanics-title" />
            <p>{t('Using Unity and C#, I developed and refined gameplay mechanics to create responsive interactions and enhance player immersion.')}</p>
            <p>{t('My contributions included interactive drink-serving and cleaning systems, object interactions, character animations, visual feedback, and scripted events.')}</p>
            <p>{t('Each system was designed to connect player actions with clear visual responses, supporting both gameplay functionality and the game’s psychological horror atmosphere.')}</p>
          </div>
          <div className="eut-mechanic-tabs" role="tablist" aria-label={t('Gameplay mechanics')}>
            {ultimoTurnoMechanics.map((item, index) => <button key={item.id} id={`eut-tab-${item.id}`} type="button" role="tab" aria-selected={index === mechanicIndex} aria-controls="eut-mechanic-panel" tabIndex={index === mechanicIndex ? 0 : -1} onClick={() => setMechanicIndex(index)} onKeyDown={event => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
              event.preventDefault()
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? ultimoTurnoMechanics.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + ultimoTurnoMechanics.length) % ultimoTurnoMechanics.length
              setMechanicIndex(next)
              document.getElementById(`eut-tab-${ultimoTurnoMechanics[next].id}`)?.focus()
            }}>{t(item.title)}</button>)}
          </div>
          <div className="eut-mechanic-panel" id="eut-mechanic-panel" role="tabpanel" aria-labelledby={`eut-tab-${mechanic.id}`}>
            <h3>{t(mechanic.title)}</h3><p className="eut-tools">{t(mechanic.tools)}</p>
            <div className="eut-split">
              <GameMedia source={ultimoTurnoMedia[mechanic.id]} title={mechanic.title} />
              <div className="eut-copy eut-align-right">{mechanic.paragraphs.map(paragraph => <p key={paragraph}>{t(paragraph)}</p>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="eut-section eut-ink" id="rigging-animation" aria-labelledby="eut-rigging-title">
        <div className="eut-container">
          <div className="eut-copy">
            <SectionHeading number="04" title="From Rigging to Reality" subtitle="3D Animation · Rigging · Enemy Encounter Design" id="eut-rigging-title" />
            <p>{t('Created and implemented creature animations using Blender and Unity, including the complete quadrupedal movement animations of the first enemy.')}</p>
            <p>{t('I also designed and assembled enemy encounter sequences, combining environmental atmosphere, animation timing, scripted events, and movement paths to create immersive horror experiences.')}</p>
          </div>
          <AccordionGallery items={galleryItems} defaultIndex={1} accentColor="#a52b32" overlayColor="#100d0e" textColor="#f3eee8" height={350} gap={10} radius={12} expandRatio={0.6} tilt={5} grayscale={false} parallax={0.25} orientation="auto" ariaLabel={t('Creature animation and enemy encounter gallery')} />
        </div>
      </section>

      <section className="eut-section eut-charcoal" id="shaders-effects" aria-labelledby="eut-shaders-title">
        <div className="eut-container">
          <div className="eut-copy eut-align-right">
            <SectionHeading number="05" title="Shaders & Visual Effects" subtitle="Unity Shader Graph · URP · C#" id="eut-shaders-title" />
            <p>{t('Created and implemented custom shader effects to enhance gameplay interactions, creature appearances, and the game’s psychological horror atmosphere.')}</p>
            <p>{t('Using Unity Shader Graph, I developed dynamic material effects and integrated shader properties with C# scripts to control their behavior during gameplay.')}</p>
          </div>
          <div className="eut-shader-grid">
            <div><GameMedia source={ultimoTurnoMedia.creatureShadow} title="Creature Shadow Shader" /><h3>{t('Creature Shadow Shader')}</h3></div>
            <div><GameMedia source={ultimoTurnoMedia.enemyDisintegration} title="Enemy Disintegration Shader" /><h3>{t('Enemy Disintegration Shader')}</h3></div>
          </div>
        </div>
      </section>

      <nav className="eut-page-bottom eut-container" aria-label={t('Project navigation')}>
        <a href={href('/#projects')}><ArrowLeft size={17} aria-hidden="true" />{t('Back to work')}</a>
        <a href={href('/#contact')}>{t('Let’s work together')}<ArrowRight size={17} aria-hidden="true" /></a>
      </nav>
    </article>
  )
}
