import React, {
  useLayoutEffect,
  useRef,
  useState
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

function ProjectCard({
  product,
  duplicate = false,
  shouldBlockClick
}) {
  return (
    <a
      href={product.link}
      className="flow-card"
      draggable={false}
      aria-hidden={duplicate ? 'true' : undefined}
      tabIndex={duplicate ? -1 : undefined}
      onClick={(event) => {
        if (
          product.link === '#' ||
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
      />
    </a>
  )
}

function FlowRow({
  items,
  direction,
  x,
  className,
  marqueeActive,
  label,
  speed = 18,
}) {
  const trackRef = useRef(null)
  const firstSetRef = useRef(null)

  const cycleWidthRef = useRef(0)
  const initializedRef = useRef(false)

  const isHoveredRef = useRef(false)
  const isDraggingRef = useRef(false)

  const pointerIdRef = useRef(null)
  const lastPointerXRef = useRef(0)
  const totalDragRef = useRef(0)

  const resumeAtRef = useRef(0)
  const draggedEnoughRef = useRef(false)

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

    window.addEventListener(
      'resize',
      measure
    )

    return () => {
      window.removeEventListener(
        'resize',
        measure
      )
    }
  }, [trackX])


  /* =========================
     MARQUEE AUTOMÁTICO
     ========================= */

  useAnimationFrame((time, delta) => {
    const cycleWidth =
      cycleWidthRef.current

    if (!cycleWidth) return
    if (!marqueeActive) return
    if (isHoveredRef.current) return
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
      (delta / 1000) *
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

    isDraggingRef.current = true

    pointerIdRef.current =
      event.pointerId

    lastPointerXRef.current =
      event.clientX

    totalDragRef.current = 0
    draggedEnoughRef.current = false

    event.currentTarget.setPointerCapture(
      event.pointerId
    )
  }


  const handlePointerMove = (event) => {
    if (!isDraggingRef.current) return

    if (
      event.pointerId !==
      pointerIdRef.current
    ) {
      return
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
    if (!isDraggingRef.current) return

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

      onMouseEnter={() => {
        isHoveredRef.current = true
      }}

      onMouseLeave={() => {
        isHoveredRef.current = false

        if (!isDraggingRef.current) {
          resumeAtRef.current =
            performance.now() + 350
        }
      }}
    >
    <div className="flow-row-label">
      <span>{label}</span>

      <span className="flow-row-label-line" />
    </div>

    <div className="flow-row-viewport">
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
          {items.map((product) => (
            <ProjectCard
              key={`before-${product.title}`}
              product={product}
              duplicate
              shouldBlockClick={() =>
                draggedEnoughRef.current
              }
            />
          ))}
        </div>


        {/* ORIGINAL */}

        <div
          ref={firstSetRef}
          className="flow-set"
        >
          {items.map((product) => (
            <ProjectCard
              key={product.title}
              product={product}
              shouldBlockClick={() =>
                draggedEnoughRef.current
              }
            />
          ))}
        </div>


        {/* COPIA DERECHA */}

        <div
          className="flow-set"
          aria-hidden="true"
        >
          {items.map((product) => (
            <ProjectCard
              key={`after-${product.title}`}
              product={product}
              duplicate
              shouldBlockClick={() =>
                draggedEnoughRef.current
              }
            />
          ))}
        </div>

      </motion.div>

      </div>

    </motion.div>
  )
}


function HeroParallaxBackground({ products }) {
  const containerRef = useRef(null)
  const [marqueeActive, setMarqueeActive] = useState(false)
  const [introSoft, setIntroSoft] = useState(true)

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
    [1.08, 0.94]
  )

  const stageY = useTransform(
    scrollYProgress,
    [0, 0.6],
    [0, -120]
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
    setMarqueeActive(latest >= 0.62)

    // Solo suavizamos las cards al comienzo del HOME.
    setIntroSoft(latest < 0.16)
  }
)


  const rowOne = products.slice(0, 5)
  const rowTwo = products.slice(5, 10)
  const rowThree = products.slice(10, 15)


  return (
    <div
  ref={containerRef}
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

            <FlowRow
            items={rowOne}
            direction="right"
            x={rowOneX}
             className="flow-row-one"
             marqueeActive={marqueeActive}
             label="DIGITAL / UX·UI"
            speed={19}
            />

            <FlowRow
            items={rowTwo}
            direction="left"
            x={rowTwoX}
            className="flow-row-two"
            marqueeActive={marqueeActive}
            label="GAME EXPERIENCES"
            speed={17}
            />

            <FlowRow
            items={rowThree}
            direction="right"
            x={rowThreeX}
             className="flow-row-three"
            marqueeActive={marqueeActive}
            label="3D & PRODUCT DESIGN"
            speed={20}
            />

          </motion.div>

        </div>

      </div>
    </div>
  )
}

export default HeroParallaxBackground