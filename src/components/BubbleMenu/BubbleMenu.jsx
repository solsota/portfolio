import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Matter from 'matter-js';

import './BubbleMenu.css';

const DEFAULT_ITEMS = [
  {
    label: 'home',
    href: '#',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'about',
    href: '#',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'projects',
    href: '#',
    ariaLabel: 'Documentation',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'blog',
    href: '#',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  onItemSelect,
  physicsActive = false,
  gravity = 0.65,
  mouseConstraintStiffness = 0.9,
  className,
  style,
  active = false,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#fff',
  menuContentColor = '#111',
  useFixedPosition = false,
  items,
  fallenOrder,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef(null);
  const bubblesRef = useRef([]);
  const labelRefs = useRef([]);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;
  const containerClassName = ['bubble-menu', useFixedPosition ? 'fixed' : 'absolute', className]
    .filter(Boolean)
    .join(' ');

  const handleToggle = () => {
  const nextState = !isMenuOpen;

  if (nextState) {
    setShowOverlay(true);
  }

  setIsMenuOpen(nextState);
  onMenuClick?.(nextState);
};

useEffect(() => {
  if (active) {
    setShowOverlay(true);
  } else if (!physicsActive) {
    setIsMenuOpen(false);
  }
}, [active, physicsActive]);


useEffect(() => {
  if (
    active &&
    showOverlay &&
    !physicsActive
  ) {
    setIsMenuOpen(true);
  }
}, [active, showOverlay, physicsActive]);



  useEffect(() => {
    if (physicsActive) {
    return;
  }

    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);

    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });

        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: 'power3.out'
            },
            `-=${animationDuration * 0.9}`
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in'
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        }
      });
    }
    }, [
      isMenuOpen,
      showOverlay,
      animationEase,
      animationDuration,
      staggerDelay,
      physicsActive
    ]);

    /* =========================
   FÍSICA DE LAS BUBBLES
========================= */

useEffect(() => {
  if (!physicsActive) return;

  const overlay = overlayRef.current;

  const bubbles = bubblesRef.current
    .slice(0, menuItems.length)
    .filter(Boolean);

  if (!overlay || !bubbles.length) return;


  const {
  Engine,
  Runner,
  World,
  Bodies,
  Body,
  Constraint,
  Query,
  Events
} = Matter;


  const overlayRect =
    overlay.getBoundingClientRect();

  const width = overlayRect.width;
  const height = overlayRect.height;

  if (width <= 0 || height <= 0) return;


  /* MOTOR */

  const engine = Engine.create();

  engine.world.gravity.x = 0;
  engine.world.gravity.y = 1;
  engine.world.gravity.scale =
    0.001 * gravity;


  /* PISO Y PAREDES */

  const boundaryOptions = {
    isStatic: true
  };

  const wallThickness = 100;

const floor = Bodies.rectangle(
  width / 2,
  height + wallThickness / 2,
  width + wallThickness * 2,
  wallThickness,
  boundaryOptions
);

const ceiling = Bodies.rectangle(
  width / 2,
  -wallThickness / 2,
  width + wallThickness * 2,
  wallThickness,
  boundaryOptions
);

const leftWall = Bodies.rectangle(
  -wallThickness / 2,
  height / 2,
  wallThickness,
  height + wallThickness * 2,
  boundaryOptions
);

const rightWall = Bodies.rectangle(
  width + wallThickness / 2,
  height / 2,
  wallThickness,
  height + wallThickness * 2,
  boundaryOptions
);

  /* GUARDAMOS ESTILOS ORIGINALES */

  const originalStyles = bubbles.map(bubble => ({
    bubble,
    position: bubble.style.position,
    left: bubble.style.left,
    top: bubble.style.top,
    width: bubble.style.width,
    height: bubble.style.height,
    margin: bubble.style.margin,
    transform: bubble.style.transform,
    transformOrigin: bubble.style.transformOrigin,
    willChange: bubble.style.willChange,
    zIndex: bubble.style.zIndex
  }));


    /* CONVERTIMOS CADA BUBBLE
      EN UN CUERPO DE MATTER */

    const bubbleBodies = bubbles.map(
      (bubble, index) => {

  const rect =
    bubble.getBoundingClientRect();

  /*
    Tamaño REAL del elemento,
    sin contar cuánto crece
    visualmente por la rotación.
  */

  const bubbleWidth =
    bubble.offsetWidth;

  const bubbleHeight =
    bubble.offsetHeight;


  /*
    Para la posición sí usamos
    getBoundingClientRect,
    porque queremos arrancar
    exactamente donde se veía.
  */

  const x =
    rect.left -
    overlayRect.left +
    rect.width / 2;

  const y =
    rect.top -
    overlayRect.top +
    rect.height / 2;


      const body = Bodies.rectangle(
      x,
      y,
      bubbleWidth,
      bubbleHeight,
        {
          restitution: 0.45,
          friction: 0.35,
          frictionAir: 0.025,

          chamfer: {
            radius:
              Math.min(
                bubbleWidth,
                bubbleHeight
              ) / 2
          }
        }
      );


      const startingRotation =
        menuItems[index]?.rotation ?? 0;

      Body.setAngle(
        body,
        startingRotation *
          Math.PI /
          180
      );


      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 1.5,
        y: 0
      });


      Body.setAngularVelocity(
        body,
        (Math.random() - 0.5) * 0.025
      );


      /* Matter toma el control
         de la posición */

      bubble.style.position = 'absolute';
      bubble.style.left = '0';
      bubble.style.top = '0';

      bubble.style.width =
      `${bubbleWidth}px`;

      bubble.style.height =
     `${bubbleHeight}px`;

      bubble.style.margin = '0';

      bubble.style.transformOrigin =
        'center center';

      bubble.style.willChange =
        'transform';

      bubble.style.zIndex = '10';


      return {
        bubble,
        body,
        item: menuItems[index],
        width: bubbleWidth,
        height: bubbleHeight
      };
    }
  );

/* =========================
   ORDEN FINAL FÍSICO
========================= */

const settleOrder =
  fallenOrder?.length
    ? fallenOrder
    : menuItems.map(
        item => item.label
      );


const orderedBubbleBodies =
  settleOrder
    .map(label =>
      bubbleBodies.find(
        entry =>
          entry.item?.label === label
      )
    )
    .filter(Boolean);


/*
  Calculamos dónde debería
  quedar el CENTRO de cada bubble.

  Importante:
  no movemos ninguna bubble.
  Solo guardamos su destino X.
*/

const desiredGap = 8;
const sidePadding = 4;


const totalBubbleWidth =
  orderedBubbleBodies.reduce(
    (sum, entry) =>
      sum + entry.width,
    0
  );


const availableGapSpace =
  width -
  sidePadding * 2 -
  totalBubbleWidth;


const physicalGap =
  orderedBubbleBodies.length > 1
    ? Math.max(
        0,
        Math.min(
          desiredGap,
          availableGapSpace /
            (
              orderedBubbleBodies.length -
              1
            )
        )
      )
    : 0;


const rowWidth =
  totalBubbleWidth +
  physicalGap *
    (
      orderedBubbleBodies.length -
      1
    );


let targetCursor =
  (width - rowWidth) / 2;


const targetXByBody =
  new Map();


orderedBubbleBodies.forEach(
  entry => {

    const targetX =
      targetCursor +
      entry.width / 2;

    targetXByBody.set(
      entry.body,
      targetX
    );

    targetCursor +=
      entry.width +
      physicalGap;
  }
);

/* =========================
   DRAG CON POINTER EVENTS
========================= */

let activePointerId = null;
let draggedBody = null;
let dragConstraint = null;

let startClientX = 0;
let startClientY = 0;
let totalDragDistance = 0;

/* =========================
   FUERZA DE ACOMODADO
========================= */

const clamp = (
  value,
  min,
  max
) =>
  Math.min(
    max,
    Math.max(
      min,
      value
    )
  );


const applySettlingForces = () => {

  bubbleBodies.forEach(
    entry => {

      const {
        body
      } = entry;

      if (
        body === draggedBody
      ) {
        return;
      }

      const targetX =
        targetXByBody.get(
          body
        );

      if (
        targetX === undefined
      ) {
        return;
      }

      const startY =
        height * 0.16;

      const fullStrengthY =
        height * 0.62;

      const fallProgress =
        clamp(
          (
            body.position.y -
            startY
          ) /
          (
            fullStrengthY -
            startY
          ),
          0,
          1
        );

      const influence =
        0.18 +
        fallProgress * 0.82;

      const difference =
        targetX -
        body.position.x;

      const springForce =
        difference *
        body.mass *
        0.0000020;

      const dampingForce =
        body.velocity.x *
        body.mass *
        0.000025;

      let forceX =
        (
          springForce -
          dampingForce
        ) *
        influence;

      const maxForce =
        body.mass *
        0.00045 *
        influence;

      forceX =
        clamp(
          forceX,
          -maxForce,
          maxForce
        );

      Body.applyForce(
        body,
        body.position,
        {
          x: forceX,
          y: 0
        }
      );
    }
  );
};


const getPointerPosition = (event) => {
  const rect =
    overlay.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};


const handlePointerDown = (event) => {

  if (
    event.pointerType === 'mouse' &&
    event.button !== 0
  ) {
    return;
  }


  const point =
    getPointerPosition(event);


  /*
    Vemos qué cuerpo físico hay
    exactamente debajo del cursor.
  */

  const bodies =
    bubbleBodies.map(
      entry => entry.body
    );


  const hits =
    Query.point(
      bodies,
      point
    );


  if (!hits.length) {
    return;
  }


  /*
    Si hay dos superpuestas,
    elegimos la última del DOM.
  */

  const selectedEntry =
    [...bubbleBodies]
      .reverse()
      .find(entry =>
        hits.includes(entry.body)
      );


  if (!selectedEntry) {
    return;
  }


  const body =
    selectedEntry.body;


  activePointerId =
    event.pointerId;

  draggedBody =
    body;


  startClientX =
    event.clientX;

  startClientY =
    event.clientY;

  totalDragDistance = 0;


  /*
    Punto exacto donde agarraste
    la bubble.
  */

  const dx =
    point.x -
    body.position.x;

  const dy =
    point.y -
    body.position.y;


  const cos =
    Math.cos(-body.angle);

  const sin =
    Math.sin(-body.angle);


  const localPoint = {
    x:
      dx * cos -
      dy * sin,

    y:
      dx * sin +
      dy * cos
  };


  /*
    Creamos una unión temporal
    entre cursor y bubble.
  */

  dragConstraint =
    Constraint.create({

      pointA: {
        x: point.x,
        y: point.y
      },

      bodyB: body,

      pointB:
        localPoint,

      length: 0,

      stiffness:
        mouseConstraintStiffness,

      damping: 0.22
    });


  World.add(
    engine.world,
    dragConstraint
  );


  Body.setAwake(
    body,
    true
  );


  /*
    CLAVE:
    exactamente como la marquee.

    Aunque el cursor salga de la
    bubble, seguimos teniendo
    control hasta pointerup.
  */

  overlay.setPointerCapture(
    event.pointerId
  );


  event.preventDefault();
};



const handlePointerMove = (event) => {

  if (
    activePointerId === null ||
    event.pointerId !==
      activePointerId ||
    !dragConstraint
  ) {
    return;
  }


  const point =
    getPointerPosition(event);


  dragConstraint.pointA.x =
    point.x;

  dragConstraint.pointA.y =
    point.y;


  const dx =
    event.clientX -
    startClientX;

  const dy =
    event.clientY -
    startClientY;


  totalDragDistance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  event.preventDefault();
};



const releaseActiveDrag = ({
  event = null,
  allowClick = false,
  releaseCapture = true
} = {}) => {

  /*
    Si ya fue liberado por otro evento,
    no hacemos nada.
  */

  if (
    activePointerId === null &&
    !dragConstraint
  ) {
    return;
  }


  const pointerId =
    activePointerId;

  const body =
    draggedBody;


  const wasClick =
    allowClick &&
    totalDragDistance < 6;


  /* =========================
     1. SOLTAR MATTER
  ========================= */

  if (dragConstraint) {

    World.remove(
      engine.world,
      dragConstraint
    );

    dragConstraint = null;
  }


  /*
    MUY IMPORTANTE:
    reseteamos el estado ANTES
    de releasePointerCapture.

    releasePointerCapture puede
    disparar lostpointercapture.
  */

  activePointerId = null;
  draggedBody = null;
  totalDragDistance = 0;


  /* =========================
     2. SOLTAR POINTER
  ========================= */

  if (
    releaseCapture &&
    pointerId !== null
  ) {

    try {

      if (
        overlay.hasPointerCapture(
          pointerId
        )
      ) {
        overlay.releasePointerCapture(
          pointerId
        );
      }

    } catch {
      // Si ya perdió el capture,
      // simplemente continuamos.
    }
  }


  /* =========================
     3. CLICK CORTO
  ========================= */

  if (
    wasClick &&
    body
  ) {

    const bubbleData =
      bubbleBodies.find(
        entry =>
          entry.body === body
      );


    if (bubbleData?.item) {

      onItemSelect?.(
        bubbleData.item
      );
    }
  }
};

const handlePointerUp = (event) => {

  if (
    activePointerId === null ||
    event.pointerId !== activePointerId
  ) {
    return;
  }


  releaseActiveDrag({
    event,
    allowClick: true,
    releaseCapture: true
  });
};


const handlePointerCancel = (event) => {

  if (
    activePointerId === null ||
    event.pointerId !== activePointerId
  ) {
    return;
  }


  releaseActiveDrag({
    event,
    allowClick: false,
    releaseCapture: true
  });
};


const handleLostPointerCapture = (event) => {

  if (
    activePointerId === null ||
    event.pointerId !== activePointerId
  ) {
    return;
  }


  releaseActiveDrag({
    event,
    allowClick: false,
    releaseCapture: false
  });
};


/*
  Si el navegador pierde foco
  mientras estás arrastrando,
  también liberamos la bubble.
*/

const handleWindowBlur = () => {

  releaseActiveDrag({
    allowClick: false,
    releaseCapture: false
  });
};


overlay.addEventListener(
  'pointerdown',
  handlePointerDown
);

overlay.addEventListener(
  'pointermove',
  handlePointerMove
);

overlay.addEventListener(
  'pointerup',
  handlePointerUp
);

overlay.addEventListener(
  'pointercancel',
  handlePointerCancel
);

overlay.addEventListener(
  'lostpointercapture',
  handleLostPointerCapture
);

window.addEventListener(
  'blur',
  handleWindowBlur
);  
World.add(
  engine.world,
  [
    floor,
    ceiling,
    leftWall,
    rightWall,

    ...bubbleBodies.map(
      item => item.body
    )
  ]
);

  

  /* MATTER → HTML */

  const syncDOM = () => {

    bubbleBodies.forEach(
  ({
    bubble,
    body,
    width: bubbleWidth,
    height: bubbleHeight
  }) => {

    /* -------------------------
       LIMITAR VELOCIDAD
    ------------------------- */

    const maxSpeed = 24;

    const speed = Math.hypot(
      body.velocity.x,
      body.velocity.y
    );

    if (speed > maxSpeed) {
      const ratio = maxSpeed / speed;

      Body.setVelocity(body, {
        x: body.velocity.x * ratio,
        y: body.velocity.y * ratio
      });
    }


    /* -------------------------
       LIMITAR ROTACIÓN
    ------------------------- */

    const maxAngularVelocity = 0.08;

    if (
      Math.abs(body.angularVelocity) >
      maxAngularVelocity
    ) {
      Body.setAngularVelocity(
        body,
        Math.sign(body.angularVelocity) *
          maxAngularVelocity
      );
    }


    bubble.style.transform = `
      translate3d(
        ${body.position.x - bubbleWidth / 2}px,
        ${body.position.y - bubbleHeight / 2}px,
        0
      )
      rotate(${body.angle}rad)
    `;
  }
);
  };
  Events.on(
  engine,
  'beforeUpdate',
  applySettlingForces
  );

  Events.on(
    engine,
    'afterUpdate',
    syncDOM
  );


  const runner = Runner.create();

  Runner.run(
    runner,
    engine
  );


return () => {

  Events.off(
  engine,
  'beforeUpdate',
  applySettlingForces
  );

Events.off(
    engine,
    'afterUpdate',
    syncDOM
  );

  Runner.stop(runner);


  overlay.removeEventListener(
    'pointerdown',
    handlePointerDown
  );

  overlay.removeEventListener(
    'pointermove',
    handlePointerMove
  );

  overlay.removeEventListener(
    'pointerup',
    handlePointerUp
  );

  overlay.removeEventListener(
    'pointercancel',
    handlePointerCancel
  );

  overlay.removeEventListener(
    'lostpointercapture',
    handleLostPointerCapture
  );

  window.removeEventListener(
    'blur',
    handleWindowBlur
  );


  if (dragConstraint) {
    World.remove(
      engine.world,
      dragConstraint
    );

    dragConstraint = null;
  }


  World.clear(
    engine.world,
    false
  );

  Engine.clear(engine);


  originalStyles.forEach(
    ({
      bubble,
      ...styles
    }) => {

      Object.assign(
        bubble.style,
        styles
      );
    }
  );
};

}, [
  physicsActive,
  gravity,
  mouseConstraintStiffness,
  menuItems,
  fallenOrder
]);

  useEffect(() => {
      if (physicsActive) {
    return;
    }
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean);
        const isDesktop = window.innerWidth >= 900;

        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? (item.rotation ?? 0) : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };

window.addEventListener(
  'resize',
  handleResize
);

return () =>
  window.removeEventListener(
    'resize',
    handleResize
  );
  
  }, [
  isMenuOpen,
  menuItems,
  physicsActive
  ]);

  return (
    <>
      <nav className={containerClassName} style={style} aria-label="Main navigation">
        <div className="bubble logo-bubble" aria-label="Logo" style={{ background: menuBg }}>
          <span className="logo-content">
            {typeof logo === 'string' ? <img src={logo} alt="Logo" className="bubble-logo" /> : logo}
          </span>
        </div>

        <button
          type="button"
          className={`bubble toggle-bubble menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span className="menu-line" style={{ background: menuContentColor }} />
          <span className="menu-line short" style={{ background: menuContentColor }} />
        </button>
      </nav>
      {showOverlay && (
        <div
          ref={overlayRef}
          className={`
            bubble-menu-items
            ${useFixedPosition ? 'fixed' : 'absolute'}
            ${physicsActive ? 'physics-active' : ''}
          `}
          aria-hidden={!isMenuOpen}
        >
          <ul className="pill-list" role="menu" aria-label="Menu links">
            {menuItems.map((item, idx) => (
              <li key={idx} role="none" className="pill-col">
               <button
                type="button"
                role="menuitem"
                aria-label={item.ariaLabel || item.label}
                className="pill-link"
                onClick={() => {
                  if (!physicsActive) {
                    onItemSelect?.(item);
                  }
                }}
                  style={{
                    '--item-rot': `${item.rotation ?? 0}deg`,
                    '--pill-bg': menuBg,
                    '--pill-color': menuContentColor,
                    '--hover-bg': item.hoverStyles?.bgColor || '#f3f4f6',
                    '--hover-color': item.hoverStyles?.textColor || menuContentColor
                  }}
                  ref={el => {
                    if (el) bubblesRef.current[idx] = el;
                  }}
                >
                  <span
                    className="pill-label"
                    ref={el => {
                      if (el) labelRefs.current[idx] = el;
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
