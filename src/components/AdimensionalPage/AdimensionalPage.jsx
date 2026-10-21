import { useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Boxes, Layers3, Lightbulb, RotateCcw, Ticket } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import FlexCarousel from '../FlexCarousel/FlexCarousel'
import TearTicket from '../TearTicket/TearTicket'
import AdimensionalGallery from './AdimensionalGallery'
import { adimensionalImages, adimensionalSlides } from '../../data/adimensional'
import './AdimensionalPage.css'

const compactTicketQuery = '(max-width: 560px)'
const getCompactTicket = () => window.matchMedia(compactTicketQuery).matches
const subscribeCompactTicket = (onChange) => {
  const query = window.matchMedia(compactTicketQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export default function AdimensionalPage() {
  const { t, href } = useLanguage()
  const titleRef = useRef(null)
  const carouselRef = useRef(null)
  const compactTicket = useSyncExternalStore(subscribeCompactTicket, getCompactTicket)
  const [activeSlide, setActiveSlide] = useState(0)
  const [ticketTorn, setTicketTorn] = useState(false)
  const currentSlide = adimensionalSlides[activeSlide]
  const carouselItems = useMemo(() => adimensionalSlides.map(slide => ({
    images: slide.images.map(image => ({ ...image, alt: t(image.alt) })), title: t(slide.title),
  })), [t])

  useLayoutEffect(() => {
    const previousTitle = document.title
    document.title = 'Adimensional — SOL’s creative archive'
    titleRef.current?.focus({ preventScroll: true })
    return () => { document.title = previousTitle }
  }, [])

  return (
    <article className="adim-page" id="work-adimensional" aria-labelledby="adim-title">
      <header className="adim-hero">
        <img className="adim-hero-image" src={adimensionalImages.banner} alt={t('Adimensional digital store and decorative objects')} fetchPriority="high" />
        <div className="adim-hero-content">
          <a className="adim-back" href={href('/#projects')}><ArrowLeft size={17} aria-hidden="true" />{t('Back to work')}</a>
          <p className="adim-eyebrow">ADIMENSIONAL · 2020 — {t('Present')}</p>
          <h1 id="adim-title" ref={titleRef} tabIndex={-1}>{t('From pixels to objects.')}</h1>
          <p>{t('Brand identity · E-commerce UX · 3D product design')}</p>
        </div>
      </header>

      <div className="adim-ribbon" aria-hidden="true">
        <div>{Array.from({ length: 8 }, (_, index) => <span key={index}>{t('Digital design. Physical objects. One brand.')} <span className="adim-ribbon-star">✳</span></span>)}</div>
      </div>

      <section className="adim-brand-intro" aria-label={t('About Adimensional')}>
        <img src={adimensionalImages.logo} alt="Adimensional" width="1349" height="571" />
        <p>{t('Adimensional is a creative brand specializing in 3D-designed products, where digital design, physical production and visual identity come together to create a cohesive brand experience.')}</p>
      </section>

      <section className="adim-digital-section" id="digital-experience" aria-labelledby="adim-digital-title">
        <div className="adim-slide-copy" aria-live="polite" aria-atomic="true">
          <p className="adim-eyebrow">{t('THE DIGITAL EXPERIENCE')}</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={activeSlide} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <h2 id="adim-digital-title">{String(activeSlide + 1).padStart(2, '0')} — {t(currentSlide.title)}</h2>
              <h3>{t(currentSlide.subtitle)}</h3>
              {currentSlide.paragraphs.map(paragraph => <p key={paragraph}>{t(paragraph)}</p>)}
            </motion.div>
          </AnimatePresence>

          <div className="adim-carousel-controls" aria-label={t('Carousel controls')}>
            <button type="button" onClick={() => carouselRef.current?.previous()} aria-label={t('Previous slide')}><ArrowLeft size={20} aria-hidden="true" /></button>
            <span className="adim-slide-counter">{String(activeSlide + 1).padStart(2, '0')} <span>/ {String(adimensionalSlides.length).padStart(2, '0')}</span></span>
            <button type="button" onClick={() => carouselRef.current?.next()} aria-label={t('Next slide')}><ArrowRight size={20} aria-hidden="true" /></button>
          </div>
        </div>

        <div className="adim-carousel-column">
          <div className="adim-carousel-viewport">
            <FlexCarousel
              ref={carouselRef}
              className="adim-flex-carousel"
              items={carouselItems}
              preset="ribbon"
              intro="fade"
              cardHeight={0.66}
              gap={30}
              radius={14}
              bend={0.16}
              dispersion={0.1}
              focusOnClick={false}
              captions={false}
              captureWheel
              onChange={setActiveSlide}
              ariaLabel={t('Adimensional image carousel')}
              positionLabel={t('{number} of {count}', { number: activeSlide + 1, count: adimensionalSlides.length })}
            />
          </div>
          <div className="adim-carousel-thumbnails" aria-label={t('Choose an image')}>
            {adimensionalSlides.map((slide, index) => (
              <button key={slide.id} type="button" aria-label={`${String(index + 1).padStart(2, '0')} — ${t(slide.title)}`} aria-pressed={activeSlide === index} onClick={() => carouselRef.current?.goTo(index)}>
                {slide.images.map(image => <img key={image.src} src={image.src} alt="" loading="lazy" />)}
              </button>
            ))}
          </div>
          <p className="adim-carousel-hint">{t('Drag to explore, or use the arrows.')}</p>
        </div>
      </section>

      <section className="adim-ticket-section" aria-labelledby="adim-ticket-title">
        <div className="adim-ticket-heading"><p className="adim-eyebrow">02 — {t('THE MAKING OF')}</p><h2 id="adim-ticket-title">{t('A little piece of the process.')}</h2><p>{t('Pull the ticket to explore how an idea becomes an object.')}</p></div>
        <div className="adim-ticket-wrap">
          <TearTicket
            className="adim-ticket"
            image={adimensionalImages.banner}
            imageAlt={t('Adimensional digital store and decorative objects')}
            scrim={false}
            width={compactTicket ? 360 : 760}
            height={compactTicket ? 400 : 420}
            stubSize={compactTicket ? 100 : 210}
            radius={6}
            holes={16}
            roughness={1}
            rotate={-3}
            background="#f3eee8"
            color="#3b0c21"
            stubBackground="#efe7de"
            recenter={false}
            torn={ticketTorn}
            onTear={() => setTicketTorn(true)}
            ariaLabel={t('Pull to tear the ticket and explore the process')}
            usedLabel={t('Ticket opened')}
            stub={<div className="adim-ticket-stub"><span>{t('ADMIT ONE')}</span><div><Ticket size={26} aria-hidden="true" /><strong>{t('THE MAKING OF')}</strong></div><span>{t('PULL TO EXPLORE')} →</span></div>}
          >
            <div className="adim-ticket-topline"><strong>ADIMENSIONAL®</strong><span>{t('OBJECT No. 001')}</span></div>
            <div className="adim-ticket-caption"><h3>{t('From pixels to objects.')}</h3><p>{t('Designed digitally. Made physically.')}</p></div>
            <div className="adim-ticket-bottomline"><span>{t('MATERIAL: PLA')}</span><span>{t('MADE TO ORDER')}</span></div>
          </TearTicket>
        </div>
        <div className="adim-ticket-result" aria-live="polite">
          {ticketTorn ? <><span>{t('Every object begins with an idea.')}</span><a href={href('/work/adimensional#layer-by-layer')}>{t('Explore the process')}<ArrowRight size={16} aria-hidden="true" /></a><button type="button" className="adim-ticket-reset" onClick={() => setTicketTorn(false)} aria-label={t('Reset ticket')}><RotateCcw size={16} aria-hidden="true" /></button></> : <span>{t('You can also focus the ticket and press Enter.')}</span>}
        </div>
      </section>

      <section className="adim-process-section" id="layer-by-layer" aria-labelledby="adim-process-title">
        <div className="adim-process-copy">
          <p className="adim-eyebrow">03 — {t('3D & PRODUCT DESIGN')}</p>
          <h2 id="adim-process-title">{t('Layer by Layer.')}</h2>
          <h3>{t('Exploring shape, light and material through 3D design.')}</h3>
          <p>{t('I design and model decorative objects in Blender, combining aesthetics and functionality with the possibilities of 3D printing.')}</p>
          <p>{t('I prioritize geometries that require no supports, minimize material waste and simplify assembly, adapting each design to how it will be used and manufactured.')}</p>
        </div>
        <div className="adim-process-stats">
          <div><Layers3 size={23} aria-hidden="true" /><strong>0</strong><h4>{t('SUPPORTS')}</h4><p>{t('Geometries designed for support-free printing')}</p></div>
          <div><Boxes size={23} aria-hidden="true" /><strong>2–3</strong><h4>{t('COMPONENTS')}</h4><p>{t('Simplified assemblies for lighting objects')}</p></div>
          <div><Lightbulb size={23} aria-hidden="true" /><strong>2</strong><h4>{t('LIGHTING OPTIONS')}</h4><p>{t('Wired or battery-powered alternatives')}</p></div>
        </div>
        <AdimensionalGallery />
      </section>

      <div className="adim-page-bottom">
        <a href={href('/#projects')}><ArrowLeft size={17} aria-hidden="true" />{t('Back to work')}</a>
        <a href="https://www.adimensional3d.com/" target="_blank" rel="noopener noreferrer">{t('Visit Adimensional')}<ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
    </article>
  )
}
