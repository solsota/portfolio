import { useLanguage } from '../../i18n/LanguageContext'
import { projectArchiveRows } from '../../data/projectArchiveRows'
import mediaSizes from '../../data/projectMediaSizes.json'
import {
  useCallback,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from 'react'

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'motion/react'

import './HeroParallaxBackground.css'

const mobileGalleryQuery = '(max-width: 700px)'
function subscribeMobileGallery(onChange) {
  const query = window.matchMedia(mobileGalleryQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const isMobileGallery = () => window.matchMedia(mobileGalleryQuery).matches

function wrapTrackX(value, width) {
  if (!width) return value

  let next = value

  while (next >= 0) {
    next -= width
  }

  while (next <= -2 * width) {
    next += width
  }

  return next
}

const ProjectCard = memo(function ProjectCard({
  product,
  duplicate = false,
  interactive = false,
  shouldBlockClick
}) {
  const { href } = useLanguage()
  return (
    <a
      href={href(product.link)}
      className="flow-card"
      aria-label={duplicate ? undefined : product.title}
      draggable={false}
      aria-hidden={duplicate || !interactive ? 'true' : undefined}
      tabIndex={duplicate || !interactive ? -1 : undefined}
      style={{ '--card-image-scale': product.imageScale, '--card-image-position': product.imagePosition }}
      onClick={(event) => {
        if (
          !interactive ||
          shouldBlockClick?.()
        ) {
          event.preventDefault()
        }
      }}
    >
      <img
        src={product.thumbnail}
        alt={duplicate ? '' : product.title}
        draggable={false}
        decoding="async"
        {...mediaSizes[product.thumbnail]}
      />
      {product.eva && <img className="flow-card-eva" src="/ultimoturno/Icon EVa.webp" width="381" height="229" alt="" aria-hidden="true" />}
      <span className="flow-card-caption" aria-hidden="true" lang="en"><span className="flow-card-title">{product.icon && <img className={`flow-card-tool${product.lightIcon ? ' flow-card-tool--light' : ''}`} src={product.icon} width="24" height="24" alt="" />}{product.title}</span><span>↗</span></span>
    </a>
  )
})

const FlowRow = memo(function FlowRow({
  items,
  direction,
  x,
  className,
  marqueeActive,
  label,
  speed = 18,
  scrollPauseUntilRef,
}) {
  const { t } = useLanguage()
  const [copiesPerSet, setCopiesPerSet] = useState(1)
  const renderedItems = useMemo(() => Array.from({ length: items.length * copiesPerSet }, (_, index) => ({
    ...items[index % items.length], repeated: index >= items.length,
  })), [items, copiesPerSet])

  const trackRef = useRef(null)
  const viewportRef = useRef(null)
  const firstSetRef = useRef(null)

  const cycleWidthRef = useRef(0)
  const initializedRef = useRef(false)

  const isHoveredRef = useRef(false)
  const isFocusedRef = useRef(false)
  const isDraggingRef = useRef(false)

  const pointerIdRef = useRef(null)
  const lastPointerXRef = useRef(0)
  const pointerStartRef = useRef(null)
  const totalDragRef = useRef(0)

  const resumeAtRef = useRef(0)
  const draggedEnoughRef = useRef(false)
  const shouldBlockClick = useCallback(() => draggedEnoughRef.current, [])

  const trackX = useMotionValue(0)


  /* =========================
     MEDIR UNA VUELTA
     ========================= */

  useLayoutEffect(() => {
    const measure = () => {
      if (
        !trackRef.current ||
        !firstSetRef.current
      ) {
        return
      }

      const styles =
        window.getComputedStyle(trackRef.current)

      const gap =
        parseFloat(styles.gap) || 0

      const cycleWidth =
        firstSetRef.current.offsetWidth +
        gap

      // Repeat only enough cards to cover this viewport, including large desktops.
      const baseCycleWidth = cycleWidth / copiesPerSet
      if (!baseCycleWidth) return
      const requiredCopies = Math.max(1, Math.ceil(viewportRef.current.clientWidth / baseCycleWidth))
      if (requiredCopies !== copiesPerSet) {
        setCopiesPerSet(requiredCopies)
        return
      }

      cycleWidthRef.current = cycleWidth

      /*
        Empezamos siempre sobre
        la copia central.
      */

      if (!initializedRef.current) {
        trackX.set(-cycleWidth)
        initializedRef.current = true
      } else {
        trackX.set(
          wrapTrackX(
            trackX.get(),
            cycleWidth
          )
        )
      }
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(viewportRef.current)
    observer.observe(firstSetRef.current)

    return () => {
      observer.disconnect()
    }
  }, [trackX, copiesPerSet])

  const moveTrack = useCallback((movement) => {
    const cycleWidth = cycleWidthRef.current
    if (!cycleWidth || !Number.isFinite(movement) || movement === 0) return

    trackX.set(wrapTrackX(trackX.get() + movement, cycleWidth))
    resumeAtRef.current = performance.now() + 1200
  }, [trackX])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || !marqueeActive) return

    const handleWheel = (event) => {
      if (event.ctrlKey || event.defaultPrevented || isDraggingRef.current) return

      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      // Vertical trackpad gestures belong to the page, including slight X drift.
      if (!horizontal && !event.shiftKey) return
      const delta = horizontal ? event.deltaX : event.deltaY
      if (!delta) return
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1

      // Only horizontal gestures (or Shift + wheel) control this row.
      if (event.cancelable) event.preventDefault()
      moveTrack(-delta * unit)
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => viewport.removeEventListener('wheel', handleWheel)
  }, [marqueeActive, moveTrack])

  const handleKeyDown = (event) => {
    if (!marqueeActive || event.ctrlKey || event.altKey || event.metaKey) return
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    const step = Math.min(viewportRef.current.clientWidth * 0.6, 600)
    moveTrack(event.key === 'ArrowLeft' ? step : -step)
  }

  /* =========================
     MARQUEE AUTOMÁTICO
     ========================= */

  useAnimationFrame((time, delta) => {
    const cycleWidth =
      cycleWidthRef.current

    if (!cycleWidth) return
    if (!marqueeActive) return
    if (document.hidden) return
    if (performance.now() < scrollPauseUntilRef.current) return
    if (isHoveredRef.current) return
    if (isFocusedRef.current) return
    if (isDraggingRef.current) return

    if (
      performance.now() <
      resumeAtRef.current
    ) {
      return
    }

    const directionMultiplier =
      direction === 'right'
        ? 1
        : -1

    const movement =
      speed *
      (Math.min(delta, 50) / 1000) *
      directionMultiplier

    trackX.set(
      wrapTrackX(
        trackX.get() + movement,
        cycleWidth
      )
    )
  })


  /* =========================
     DRAG MANUAL
     ========================= */

  const handlePointerDown = (event) => {
    if (!marqueeActive) return

    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    isDraggingRef.current = false
    pointerStartRef.current = { x: event.clientX, y: event.clientY }

    pointerIdRef.current =
      event.pointerId

    lastPointerXRef.current =
      event.clientX

    totalDragRef.current = 0
    draggedEnoughRef.current = false

  }


  const handlePointerMove = (event) => {
    if (
      event.pointerId !==
      pointerIdRef.current
    ) {
      return
    }

    if (!isDraggingRef.current) {
      const start = pointerStartRef.current
      if (!start) return
      const dx = Math.abs(event.clientX - start.x)
      const dy = Math.abs(event.clientY - start.y)
      if (Math.max(dx, dy) < 10) return
      if (dy >= dx) {
        pointerIdRef.current = null
        pointerStartRef.current = null
        return
      }
      isDraggingRef.current = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    const deltaX =
      event.clientX -
      lastPointerXRef.current

    lastPointerXRef.current =
      event.clientX

    totalDragRef.current +=
      Math.abs(deltaX)


    /*
      A partir de unos pocos px
      lo consideramos drag y no click.
    */

    if (totalDragRef.current > 6) {
      draggedEnoughRef.current = true
    }


    const cycleWidth =
      cycleWidthRef.current

    if (!cycleWidth) return


    /*
      El usuario puede mover la fila
      hacia CUALQUIER lado y hacemos
      wrap continuamente.
    */

    trackX.set(
      wrapTrackX(
        trackX.get() + deltaX,
        cycleWidth
      )
    )
  }


  const finishPointerDrag = (event) => {
    if (event.pointerId !== pointerIdRef.current) return

    isDraggingRef.current = false

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      )
    }

    pointerIdRef.current = null
    pointerStartRef.current = null


    /*
      Se queda un instante donde
      la dejó el usuario y después
      continúa el marquee.
    */

    resumeAtRef.current =
      performance.now() + 900


    /*
      El click ocurre después del
      pointerup, por eso esperamos
      un poquito antes de resetearlo.
    */

    window.setTimeout(() => {
      draggedEnoughRef.current = false
    }, 120)
  }


  return (
    <motion.div
      className={`flow-row ${className}`}
      style={{ x }}

      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') isHoveredRef.current = true
      }}

      onPointerLeave={() => {
        isHoveredRef.current = false

        if (!isDraggingRef.current) {
          resumeAtRef.current = Math.max(
            resumeAtRef.current,
            performance.now() + 350
          )
        }
      }}
    >
    <div className="flow-row-label">
      <span lang="en">{label}</span>

      <span className="flow-row-label-line" />
    </div>

    <div
      ref={viewportRef}
      className="flow-row-viewport"
      role="region"
      aria-label={t(label)}
      tabIndex={marqueeActive ? 0 : -1}
      onKeyDown={handleKeyDown}
      onFocusCapture={() => {
        isFocusedRef.current = true
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          isFocusedRef.current = false
          resumeAtRef.current = Math.max(resumeAtRef.current, performance.now() + 350)
        }
      }}
    >
      <motion.div
        ref={trackRef}
        className={`flow-track flow-track-${direction}`}
        style={{ x: trackX }}

        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerDrag}
        onPointerCancel={finishPointerDrag}
      >

        {/* COPIA IZQUIERDA */}

        <div
          className="flow-set"
          aria-hidden="true"
        >
          {renderedItems.map((product, index) => (
            <ProjectCard
              key={`before-${index}`}
              product={product}
              duplicate
              interactive={marqueeActive}
              shouldBlockClick={shouldBlockClick}
            />
          ))}
        </div>


        {/* ORIGINAL */}

        <div
          ref={firstSetRef}
          className="flow-set"
        >
          {renderedItems.map((product, index) => (
            <ProjectCard
              key={`original-${index}`}
              product={product}
              duplicate={product.repeated}
              interactive={marqueeActive}
              shouldBlockClick={shouldBlockClick}
            />
          ))}
        </div>


        {/* COPIA DERECHA */}

        <div
          className="flow-set"
          aria-hidden="true"
        >
          {renderedItems.map((product, index) => (
            <ProjectCard
              key={`after-${index}`}
              product={product}
              duplicate
              interactive={marqueeActive}
              shouldBlockClick={shouldBlockClick}
            />
          ))}
        </div>

      </motion.div>

      </div>

    </motion.div>
  )
})


function HeroParallaxBackground() {

  const mobileGallery = useSyncExternalStore(subscribeMobileGallery, isMobileGallery)

  const containerRef = useRef(null)
  const scrollPauseUntilRef = useRef(0)
  const transitionStateRef = useRef({ active: false, soft: true })
  const [marqueeActive, setMarqueeActive] = useState(false)
  const [introSoft, setIntroSoft] = useState(true)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })


  /*
   * HERO -> GALERÍA
   *
   * Al principio todo el plano está inclinado.
   * Con el scroll se vuelve completamente frontal.
   */

  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.6],
    [52, 0]
  )

  const rotateZ = useTransform(
    scrollYProgress,
    [0, 0.6],
    [-18, 0]
  )

  const scale = useTransform(
    scrollYProgress,
    [0, 0.6],
    [1.08, mobileGallery ? 1 : 0.94]
  )

  const stageY = useTransform(
    scrollYProgress,
    [0, 0.6],
    ['0svh', '-12svh']
  )


  /*
   * Las filas arrancan desfasadas,
   * pero TODAS comparten la misma orientación.
   *
   * Al llegar a la segunda pantalla
   * las tres quedan alineadas.
   */

  const rowOneX = useTransform(
    scrollYProgress,
    [0, 0.6],
    [130, 0]
  )

  const rowTwoX = useTransform(
    scrollYProgress,
    [0, 0.6],
    [-90, 0]
  )

  const rowThreeX = useTransform(
    scrollYProgress,
    [0, 0.6],
    [70, 0]
  )


  /*
   * Cuando terminamos la transición
   * por scroll, activamos el marquee.
   */

  useMotionValueEvent(
  scrollYProgress,
  'change',
  (latest) => {
    if (mobileGallery) scrollPauseUntilRef.current = performance.now() + 160
    const active = latest >= 0.62
    const soft = latest < 0.16
    if (active !== transitionStateRef.current.active) setMarqueeActive(active)

    // Solo suavizamos las cards al comienzo del HOME.
    if (soft !== transitionStateRef.current.soft) setIntroSoft(soft)
    transitionStateRef.current = { active, soft }
  }
)


  const rowOffsets = [rowOneX, rowTwoX, rowThreeX]


  return (
    <div
  ref={containerRef}
  data-offscreen={!visible || undefined}
  className={`parallax-background
    ${marqueeActive ? 'marquee-active' : ''}
    ${introSoft ? 'intro-soft' : ''}
  `}
    >   
      <div className="parallax-sticky">

        <div className="parallax-camera">

          <motion.div
            className="parallax-stage"
            style={{
              rotateX,
              rotateZ,
              scale,
              y: stageY,
            }}
          >

            {projectArchiveRows.map((row, index) => <FlowRow key={row.id}
              items={row.cards} direction={index === 1 ? 'left' : 'right'}
              x={rowOffsets[index]} className={`flow-row-${['one', 'two', 'three'][index]}`}
              marqueeActive={marqueeActive && visible} label={row.label} speed={[19, 17, 20][index]}
              scrollPauseUntilRef={scrollPauseUntilRef}
            />)}

          </motion.div>

        </div>

      </div>
    </div>
  )
}

export default HeroParallaxBackground
