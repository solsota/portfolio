import {
  useRef,
  useState,
  useEffect
} from 'react'

import {
  useInView,
  motion,
  AnimatePresence
} from 'motion/react'
import AboutProfileVisual from '../AboutProfileVisual/AboutProfileVisual.jsx'
import BubbleMenu from '../BubbleMenu/BubbleMenu.jsx'
import ToolkitSection from '../ToolkitSection/ToolkitSection.jsx'
import DepthCarousel from '../DepthCarousel/DepthCarousel.jsx'
import './BubblePage.css'

import { ChevronDown } from 'lucide-react'



const bubbleItems = [
  {
    label: 'about',
    href: '#about',
    ariaLabel: 'About me',
    rotation: -6,

    hoverStyles: {
      bgColor: '#702a32',
      textColor: '#f3eee8'
    }
  },

  {
    label: 'skills',
    href: '#skills',
    ariaLabel: 'Skills',
    rotation: 5,

    hoverStyles: {
      bgColor: '#8fa5b4',
      textColor: '#321316'
    }
  },

  {
    label: 'experience',
    href: '#experience',
    ariaLabel: 'Experience',
    rotation: 6,

    hoverStyles: {
      bgColor: '#b98d94',
      textColor: '#321316'
    }
  },

  {
    label: 'education',
    href: '#education',
    ariaLabel: 'Education',
    rotation: -5,

    hoverStyles: {
      bgColor: '#c1a098',
      textColor: '#321316'
    }
  },

  {
    label: 'contact',
    href: '#contact',
    ariaLabel: 'Contact',
    rotation: 4,

    hoverStyles: {
      bgColor: '#321316',
      textColor: '#f3eee8'
    }
  }
]

const sectionContent = {
  about: {
    title: 'About me',
    text: 'A little more about who I am, how I work and the ideas behind my creative practice.'
  },

  skills: {
    title: 'Skills',
    text: 'A selection of the creative, visual and interactive skills I use across digital products and games.'
  },

  experience: {
    title: 'Experience',
    text: 'Projects, collaborations and experiences that have shaped the way I design and create.'
  },

  education: {
    title: 'Education',
    text: 'My academic background and the different areas that have influenced my multidisciplinary approach.'
  },

  contact: {
    title: 'Contact',
    text: 'Want to work together? Here you will find the different ways to get in touch with me.'
  }
}

const aboutContainer = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.05
    }
  }
}


const aboutTitleAnimation = {
  hidden: {
    opacity: 0,
    x: -70,
    y: 42,
    rotate: -1.5
  },

  show: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,

    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}


const aboutItemAnimation = {
  hidden: {
    opacity: 0,
    y: 18
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}


function AboutContent() {
  return (
    <motion.div
      className="about-content"
      variants={aboutContainer}
      initial="hidden"
      animate="show"
      exit={{
        opacity: 0,
        y: -10,
        transition: {
          duration: 0.2
        }
      }}
    >

      <motion.span
        className="about-eyebrow"
        variants={aboutItemAnimation}
      >
        03 — ABOUT
      </motion.span>


      <motion.h2
        className="about-title"
        variants={aboutTitleAnimation}
      >
        About me
      </motion.h2>


      <div className="about-copy">

        <motion.p variants={aboutItemAnimation}>
          I grew up surrounded by the internet, visual culture and digital
          tools, so learning, exploring and experimenting with new things
          has always come naturally to me.{' '}
          <strong>
            I’m highly visual, detail-oriented, and I tend to get fully
            invested in everything I create.
          </strong>
        </motion.p>


        <motion.p variants={aboutItemAnimation}>
          Research, experimentation and iteration shape my process.
          I’m drawn to strong visual decisions, but always through the
          lens of <strong>usability and experience.</strong>
        </motion.p>


        <motion.p variants={aboutItemAnimation}>
          I tend to take <strong>ownership early</strong>, bring structure
          to ideas and find the most effective way to turn them into
          something tangible.
        </motion.p>

      </div>


      <motion.button
        type="button"
        className="about-cv-button"
        variants={aboutItemAnimation}
      >
        <span>VIEW RESUME / CV</span>
        <span className="about-cv-arrow">→</span>
      </motion.button>

    </motion.div>
  )
}

const educationContainer = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
}

const educationCardAnimation = {
  hidden: {
    opacity: 0,
    y: 320,
    rotate: 2,
    scale: 0.97
  },

  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,

    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1]
    }
  },

  exit: {
    opacity: 0,
    y: 90,
    scale: 0.98,

    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1]
    }
  }
}

function EducationContent() {
  return (
    <motion.div
      className="education-panels"
      variants={educationContainer}
      initial="hidden"
      animate="show"
      exit="exit"
    >

      {/* =========================
          EDUCATION
      ========================= */}

      <motion.article
        className="education-card"
        variants={educationCardAnimation}

        whileHover={{
            y: -4,
            scale: 1.008,
            boxShadow:
            '0 26px 55px rgba(50, 19, 22, 0.10)'
        }}

        transition={{
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1]
        }}
        >
        <div className="education-card-scroll">

          <section className="education-entry">
            <div className="education-entry-heading">
              CURRENTLY PURSUING
            </div>

            <h3>
              University Technician in Video Game Development & Production
            </h3>

            <p className="education-institution">
              Universidad Tecnológica Nacional — E-learning
            </p>

            <div className="education-tags">
              <span>Game Design</span>
              <span>Production</span>
              <span>Interactive Media</span>
            </div>
          </section>

          <section className="education-entry">
            <div className="education-entry-heading">
              GRADUATED
            </div>

            <h3>
              University Technician in Business Administration
            </h3>

            <p className="education-institution">
              Universidad Tecnológica Nacional — E-learning
            </p>

            <div className="education-tags">
              <span>Management</span>
              <span>Organization</span>
              <span>Team Coordination</span>
            </div>
          </section>

          <section className="education-entry">
            <div className="education-entry-heading">
              ADDITIONAL STUDIES
            </div>

            <h3>
              Industrial Engineering Studies
            </h3>

            <p className="education-institution">
              Universidad Tecnológica Nacional, FRC
            </p>

            <div className="education-tags">
              <span>2 years completed</span>
            </div>
          </section>

        </div>
      </motion.article>


      {/* =========================
          LANGUAGES
      ========================= */}

      <motion.article
        className="education-card education-language-card"
        variants={educationCardAnimation}

        whileHover={{
            y: -4,
            scale: 1.008,
            boxShadow:
            '0 26px 55px rgba(50, 19, 22, 0.10)'
        }}

        transition={{
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1]
        }}
        >
                <div className="education-card-scroll">

          <div className="education-entry-heading">
            LANGUAGES
          </div>

          <section className="language-entry">

            <h3>English</h3>

            <p>B2 / Upper Intermediate</p>

            <strong>
              EF SET · C1 Reading & Listening · 66/100
            </strong>

            <a
              className="education-certificate"
              href="https://cert.efset.org/es/Bvj6Ag"
              target="_blank"
              rel="noreferrer"
            >
              View Certificate
            </a>

          </section>

          <section className="language-entry">

            <h3>Italian</h3>

            <p>B1 — PLIDA Certified</p>

            <strong>
              Società Dante Alighieri · 104/120
            </strong>

            <a
              className="education-certificate"
              href="/certificates/plida-b1.pdf"
              target="_blank"
              rel="noreferrer"
            >
              View Certificate
            </a>

          </section>

        </div>
      </motion.article>

    </motion.div>
  )
}

const experienceContainerAnimation = {
  hidden: {
    opacity: 0,
    y: 55
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08
    }
  },

  exit: {
    opacity: 0,
    y: 35,

    transition: {
      duration: 0.28
    }
  }
}


const experienceCardAnimation = {
  hidden: {
    opacity: 0,
    y: 32
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}


function ExperienceAccordionItem({
  id,
  title,
  role,
  meta,
  isOpen,
  onToggle,
  children
}) {
  return (
    <motion.article
      className={`experience-card ${isOpen ? 'is-open' : ''}`}
      variants={experienceCardAnimation}
      layout
    >

      <button
        type="button"
        className="experience-card-header"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`experience-panel-${id}`}
      >

        <div className="experience-card-heading">

          <h3>
            {title}
          </h3>

          <p className="experience-role">
            {role}
          </p>

          <p className="experience-meta">
            {meta}
          </p>

        </div>


        <motion.span
        className="experience-chevron"
        aria-hidden="true"
        animate={{
            rotate: isOpen ? 180 : 0
        }}
        transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
        }}
        >
        <ChevronDown
            size={18}
            strokeWidth={1.8}
        />
        </motion.span>

      </button>


      <AnimatePresence initial={false}>

        {isOpen && (

          <motion.div
            id={`experience-panel-${id}`}
            className="experience-card-panel"

            initial={{
              height: 0,
              opacity: 0
            }}

            animate={{
              height: 'auto',
              opacity: 1
            }}

            exit={{
              height: 0,
              opacity: 0
            }}

            transition={{
              height: {
                duration: 0.48,
                ease: [0.22, 1, 0.36, 1]
              },

              opacity: {
                duration: 0.3
              }
            }}
          >

            <div className="experience-card-body">
              {children}
            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </motion.article>
  )
}

const experienceCarouselItems = {

  adimensional: [
    {
      image: '/experience/adimensional-01.webp',
      alt: 'Adimensional 3D product design'
    },
    {
      image: '/experience/adimensional-02.webp',
      alt: 'Adimensional 3D visual identity'
    },
    {
      image: '/experience/adimensional-03.webp',
      alt: 'Adimensional 3D e-commerce experience'
    }
  ],

  'get-a-game': [
    {
      image: '/experience/getagame-01.webp',
      alt: 'Get a Game puzzle game'
    },
    {
      image: '/experience/getagame-02.webp',
      alt: 'Magic Tap Away interface'
    },
    {
      image: '/experience/getagame-03.webp',
      alt: 'Get a Game visual design'
    }
  ],

  't15-studio': [
    {
      image: '/experience/t15-01.webp',
      alt: 'El Último Turno environment'
    },
    {
      image: '/experience/t15-02.webp',
      alt: 'El Último Turno UI design'
    },
    {
      image: '/experience/t15-03.webp',
      alt: 'T15 Studio visual identity'
    }
  ]

}

function ExperienceContent() {

  const [openExperience, setOpenExperience] = useState(null)

  const [visualExperience, setVisualExperience] = useState('adimensional')


  const toggleExperience = (id) => {

    if (openExperience === id) {

      setOpenExperience(null)
      setVisualExperience('adimensional')

      return
    }

    setOpenExperience(id)
    setVisualExperience(id)
  }


  return (
    <motion.div
      className="experience-layout"
      variants={experienceContainerAnimation}
      initial="hidden"
      animate="show"
      exit="exit"
    >

      {/* ==================================
          IZQUIERDA
          Después agregamos acá
          el componente de imágenes
      ================================== */}

      <div className="experience-media-slot">

  <AnimatePresence mode="wait">

    <motion.div
      key={visualExperience}
      className="experience-carousel-transition"

      initial={{
        opacity: 0,
        x: -24,
        scale: 0.97
      }}

      animate={{
        opacity: 1,
        x: 0,
        scale: 1
      }}

      exit={{
        opacity: 0,
        x: 18,
        scale: 0.98
      }}

      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }}
    >

      <DepthCarousel
        items={experienceCarouselItems[visualExperience]}

        depth={170}
        spread={58}
        tilt={18}
        tiltDirection="right"

        perspective={1350}

        visibleCards={2}

        falloff={0.18}
        blur={4}

        autoplay
        loop

        cardWidth={300}
        cardHeight={385}

        radius={18}

        tint="#321316"

        duration={850}
        ease="power3.out"

        autoplayDelay={5500}

        showControls
        showIndicators
      />

    </motion.div>

  </AnimatePresence>

</div>


      {/* ==================================
          DERECHA — EXPERIENCES
      ================================== */}

       <div className="experience-list-shell">

     <div className="experience-list-scroll">


          {/* ==================================
              ADIMENSIONAL
          ================================== */}

          <ExperienceAccordionItem
            id="adimensional"
            title="Adimensional 3D"
            role="Co-Founder · Product & Creative Designer"
            meta="2020 — Present · Córdoba, Argentina"
            isOpen={openExperience === 'adimensional'}
            onToggle={() => toggleExperience('adimensional')}
          >

            <p className="experience-lead">
              Co-founded Adimensional 3D in 2020 and lead its creative
              side across physical product design, brand identity,
              e-commerce UX, visual content and customer experience.
              I take products from trend research and early concepts
              through 3D design, visual presentation and launch,
              continuously iterating based on real customer behavior
              and feedback.
            </p>


            <div className="experience-tags">
              <span>Product Design</span>
              <span>Brand Identity</span>
              <span>E-commerce UX</span>
              <span>Content</span>
              <span>Customer Experience</span>
            </div>


            <section className="experience-detail-section">

              <h4>
                PRODUCT & DESIGN
              </h4>

              <p>
                Researching trends and references, defining new product
                opportunities and developing original products from concept
                and sketch to 3D model, primarily using Blender.
              </p>

            </section>


            <section className="experience-detail-section">

              <h4>
                BRAND & DIGITAL EXPERIENCE
              </h4>

              <p>
                Designed and evolved the brand identity, packaging and
                visual system, while shaping the e-commerce UX, product
                presentation and interface improvements alongside development.
              </p>

              <a
                href="https://www.adimensional3d.com/"
                target="_blank"
                rel="noreferrer"
                className="experience-action-link"
                >
                <span>
                    View Adimensional3d.com
                </span>

                <span aria-hidden="true">
                    →
                </span>
                </a>

            </section>


            <section className="experience-detail-section">

              <h4>
                CONTENT & VISUAL COMMUNICATION
              </h4>

              <p>
                Responsible for product photography, renders, social media
                content, campaigns and the visual presentation of products
                across multiple colors and variations.
              </p>

              <a
                href="https://www.instagram.com/adimensional_3d/"
                target="_blank"
                rel="noreferrer"
                className="experience-action-link"
                >
                <span>
                    View Instagram Profile
                </span>

                <span aria-hidden="true">
                    →
                </span>
                </a>

            </section>


            <section className="experience-detail-section">

              <h4>
                CUSTOMER EXPERIENCE
              </h4>

              <p>
                Managing customer communication since launch, including
                sales inquiries, problem-solving, claims, B2B requests and
                pre/post-purchase support across WhatsApp, Instagram and
                other channels.
              </p>

            </section>


            <section className="experience-related-work">

              <h4>
                EXPLORE RELATED WORK
              </h4>

              <a
                href="#work-adimensional-brand"
                className="experience-action-link"
              >
                <span>
                  Brand Identity & E-commerce UX
                </span>

                <span aria-hidden="true">
                  →
                </span>
              </a>

              <a
                href="#work-adimensional-product"
                className="experience-action-link"
              >
                <span>
                  3D & Product Design
                </span>

                <span aria-hidden="true">
                  →
                </span>
              </a>

            </section>

          </ExperienceAccordionItem>


          {/* ==================================
              GET A GAME
          ================================== */}

          <ExperienceAccordionItem
            id="get-a-game"
            title="Get a Game"
            role="Co-Founder · UI/UX, Game Art & Production"
            meta="2022 — 2023 · Independent Game Development Project"
            isOpen={openExperience === 'get-a-game'}
            onToggle={() => toggleExperience('get-a-game')}
          >

            <p className="experience-lead">
              Co-founded a two-person indie game project focused on small
              2D puzzle games. I worked across UI/UX, game art, visual
              identity, testing, game design support and release assets,
              while development was handled in Unity by my co-founder.
            </p>


            <div className="experience-tags">
              <span>UI/UX</span>
              <span>Game Art</span>
              <span>Game Design</span>
              <span>Testing</span>
              <span>Production</span>
              <span>Branding</span>
            </div>


            <div className="experience-highlight">

              <strong>
                2 Android puzzle games published
              </strong>

              <span>
                Magic Tap Away · 2048
              </span>

            </div>


            <a
              href="#work-get-a-game"
              className="experience-action-link"
            >
              <span>
                View Projects
              </span>

              <span aria-hidden="true">
                →
              </span>
            </a>

          </ExperienceAccordionItem>


          {/* ==================================
              T15 STUDIO
          ================================== */}

          <ExperienceAccordionItem
            id="t15-studio"
            title="T15 Studio"
            role="UI/UX Designer · Game & Technical Art · Production"
            meta="2026 — Present · Game Development Team"
            isOpen={openExperience === 't15-studio'}
            onToggle={() => toggleExperience('t15-studio')}
          >

            <p className="experience-lead">
              Working across UI/UX, game and technical art, Unity
              implementation and production on El Último Turno, a narrative
              horror game developed as a collaborative university project.
              My work focuses on shaping the visual and interactive
              experience through environment art, lighting, character
              integration and animation, interface design, gameplay polish
              and narrative iteration.
            </p>


            <div className="experience-tags">
              <span>UI/UX</span>
              <span>Unity</span>
              <span>Environment Art</span>
              <span>Lighting</span>
              <span>Animation</span>
              <span>Production</span>
            </div>


            <section className="experience-detail-section">

              <h4>
                GAME & TECHNICAL ART
              </h4>

              <p>
                Environment dressing and lighting, 3D asset integration,
                character setup, rigging and animation using Unity,
                Blender and Mixamo.
              </p>

            </section>


            <section className="experience-detail-section">

              <h4>
                UI/UX & IMPLEMENTATION
              </h4>

              <p>
                Designed and implemented the game's complete interface
                and interaction experience in Unity, including HUDs,
                menus, interaction systems and visual feedback.
              </p>

            </section>


            <section className="experience-detail-section">

              <h4>
                DESIGN & PRODUCTION
              </h4>

              <p>
                Contributed to gameplay and narrative iteration, level
                polish, project coordination and the visual communication
                surrounding the game.
              </p>

            </section>


            <section className="experience-achievement">

              <h4>
                SELECTED BY UTN FOR EVA 2026
              </h4>

              <p>
                Currently in mentorship and development, polishing the
                playable demo for its presentation at EVA.
              </p>

            </section>


            <section className="experience-related-work">

              <h4>
                RELATED WORK
              </h4>


              <div className="experience-related-item">

                <a
                  href="#work-el-ultimo-turno"
                  className="experience-action-link"
                >
                  <span>
                    El Último Turno — Game Case Study
                  </span>

                  <span aria-hidden="true">
                    →
                  </span>
                </a>

                <p>
                  UI/UX · Technical Art · Game Design · Unity
                </p>

              </div>


              <div className="experience-related-item">

                <a
                  href="#work-t15-branding"
                  className="experience-action-link"
                >
                  <span>
                    T15 Studio — Visual Identity
                  </span>

                  <span aria-hidden="true">
                    →
                  </span>
                </a>

                <p>
                  Branding · Logo Design · Social Media · Trailer
                </p>

              </div>

            </section>

          </ExperienceAccordionItem>


        </div>

      </div>

    </motion.div>
  )
}

const skillsData = [
  {
    id: 'uiux',
    number: '01',
    title: 'UI/UX & Interaction Design',
    skills: [
      'Interface Design',
      'Game UI/UX',
      'User Flows',
      'HUDs & Menus',
      'Interaction Design',
      'Accessibility',
      'Prototyping',
      'Usability Testing'
    ],
    image: '/skills/uiux.webp',
    alt: 'UI/UX and interaction design work'
  },

  {
    id: 'technical-ui',
    number: '02',
    title: 'Technical UI & Implementation',
    skills: [
      'Unity UI Implementation',
      'Interactive Systems',
      'Gameplay Integration',
      'C# Fundamentals',
      'AI-Assisted Scripting',
      'React / CSS Implementation',
      'Debugging',
      'Git & GitHub'
    ],
    image: '/skills/technical-ui.webp',
    alt: 'Technical UI implementation'
  },

  {
    id: 'technical-art',
    number: '03',
    title: 'Game & Technical Art',
    skills: [
      'Environment Dressing',
      'Lighting',
      'Materials',
      'Texture Setup',
      '3D Asset Integration',
      'Rigging',
      'Animation Integration',
      'Basic Asset Optimization'
    ],
    image: '/skills/technical-art.webp',
    alt: 'Game and technical art work'
  },

  {
    id: 'product-3d',
    number: '04',
    title: '3D & Product Design',
    skills: [
      'Concept Development',
      '3D Modeling',
      'Product Visualization',
      'Design for Manufacturing',
      'Mesh Preparation',
      'Rendering',
      'Asset Modification',
      'Color & Material Direction'
    ],
    image: '/skills/product-3d.webp',
    alt: '3D and product design work'
  },

  {
    id: 'visual-brand',
    number: '05',
    title: 'Visual & Brand Design',
    skills: [
      'Brand Identity',
      'Art Direction',
      'Typography',
      'Layout & Composition',
      'Visual Systems',
      'Image Editing',
      'Product Presentation',
      'Digital Assets'
    ],
    image: '/skills/visual-brand.webp',
    alt: 'Visual and brand design work'
  },

  {
    id: 'game-production',
    number: '06',
    title: 'Game Design & Production',
    skills: [
      'Gameplay Design',
      'Interaction Mechanics',
      'Narrative Integration',
      'Playtesting',
      'Exploratory Testing',
      'Bug Reporting',
      'GDDs & Documentation',
      'Project Coordination'
    ],
    image: '/skills/game-production.webp',
    alt: 'Game design and production work'
  }
]

function SkillsContent() {

  const [openSkill, setOpenSkill] =
    useState(null)

  const [visualSkill, setVisualSkill] =
    useState('uiux')


  const currentSkill =
    skillsData.find(
      item => item.id === visualSkill
    ) || skillsData[0]


  const toggleSkill = (id) => {

    setVisualSkill(id)

    setOpenSkill(
      current =>
        current === id
          ? null
          : id
    )
  }


  return (
    <motion.div
      className="skills-layout"

      initial={{
        opacity: 0,
        y: 35
      }}

      animate={{
        opacity: 1,
        y: 0
      }}

      exit={{
        opacity: 0,
        y: 20
      }}

      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1]
      }}
    >

      {/* =========================
          LEFT — SKILLS
      ========================= */}

      <div className="skills-accordion">

        {skillsData.map(item => {

          const isActive =
            openSkill === item.id

          return (

            <motion.article
              key={item.id}

              className={`
                skills-card
                ${isActive ? 'is-active' : ''}
              `}

              layout
            >

              <button
                type="button"
                className="skills-card-header"

                onClick={() => {
                  toggleSkill(item.id)
                }}

                aria-expanded={isActive}
              >

                <span className="skills-card-title">

                  <strong>
                    {item.number}
                  </strong>

                  <span>
                    —
                  </span>

                  <span>
                    {item.title}
                  </span>

                </span>


                <motion.span
                className="skills-card-arrow"
                animate={{
                    rotate: isActive ? 180 : 0
                }}
                transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1]
                }}
                >
                <ChevronDown
                    size={17}
                    strokeWidth={1.8}
                />
                </motion.span>

              </button>


              <AnimatePresence initial={false}>

                {isActive && (

                  <motion.div
                    className="skills-card-content"

                    initial={{
                      height: 0,
                      opacity: 0
                    }}

                    animate={{
                      height: 'auto',
                      opacity: 1
                    }}

                    exit={{
                      height: 0,
                      opacity: 0
                    }}

                    transition={{
                      height: {
                        duration: 0.42,
                        ease: [0.22, 1, 0.36, 1]
                      },

                      opacity: {
                        duration: 0.25
                      }
                    }}
                  >

                    <div className="skills-grid">

                      {item.skills.map(skill => (

                        <span
                          key={skill}
                          className="skills-item"
                        >
                          {skill}
                        </span>

                      ))}

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

            </motion.article>

          )

        })}

      </div>


      {/* =========================
          RIGHT — VISUAL
      ========================= */}

      <div className="skills-visual">

        <AnimatePresence mode="wait">

          <motion.div
            key={currentSkill.id}
            className="skills-visual-inner"

            initial={{
              opacity: 0,
              x: 28,
              scale: 0.97
            }}

            animate={{
              opacity: 1,
              x: 0,
              scale: 1
            }}

            exit={{
              opacity: 0,
              x: -18,
              scale: 0.98
            }}

            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1]
            }}
          >

            <img
              src={currentSkill.image}
              alt={currentSkill.alt}
              className="skills-visual-image"
            />


            <div className="skills-visual-caption">

              <span>
                {currentSkill.number}
              </span>

              <span>
                {currentSkill.title}
              </span>

            </div>

          </motion.div>

        </AnimatePresence>

      </div>

    </motion.div>
  )
}

function BubblePage() {

    const sectionRef = useRef(null)

    const hasEnteredPageRef = useRef(false)

    const [selectedSection, setSelectedSection] = useState(null)

    const [physicsActive, setPhysicsActive] = useState(false)

    const [bubbleResetKey, setBubbleResetKey] = useState(0)

    const [isPagePresent, setIsPagePresent] = useState(false)

 const isInView = useInView(sectionRef, {
  amount: 0.18,
  once: false
})

useEffect(() => {

  const section = sectionRef.current

  if (!section) return


  const observer = new IntersectionObserver(
    ([entry]) => {

      /*
        Consideramos que página 3
        sigue presente mientras todavía
        haya al menos un poquito visible.
      */

      setIsPagePresent(
        entry.intersectionRatio > 0.02
      )
    },
    {
      threshold: [0, 0.02]
    }
  )


  observer.observe(section)


  return () => {
    observer.disconnect()
  }

}, [])

/*
  Registramos que realmente
  entramos a página 3.
*/

useEffect(() => {

  if (isInView) {
    hasEnteredPageRef.current = true
  }

}, [isInView])


/*
  RESET ÚNICAMENTE CUANDO
  PÁGINA 3 YA NO ESTÁ EN PANTALLA.
*/

useEffect(() => {

  /*
    Todavía se ve página 3:
    NO tocamos absolutamente nada.
  */

  if (isPagePresent) {
    return
  }


  /*
    Todavía nunca entramos:
    tampoco hacemos nada.
  */

  if (!hasEnteredPageRef.current) {
    return
  }


  /*
    Ahora sí:
    abandonamos completamente
    página 3.
  */

  setSelectedSection(null)

  setPhysicsActive(false)

  setBubbleResetKey(
    previous => previous + 1
  )

  hasEnteredPageRef.current = false

}, [isPagePresent])

const handleBubbleSelect = (item) => {

  /*
    Cambia la sección mostrada.
  */

  setSelectedSection(item.label)


  /*
    Solo activamos la física
    la PRIMERA vez que tocamos
    una bubble.

    Si ya están caídas,
    permanecen exactamente
    donde están.
  */

  if (!physicsActive) {
    setPhysicsActive(true)
  }
}
    const fallenBubbleOrder = [
    'about',
    'education',
    'skills',
    'contact',
    'experience'
    ]
  return (
    <section
      ref={sectionRef}
      className="bubble-page"
      id="explore"
    >
        <ToolkitSection />

        {selectedSection === 'about' && (
  <AboutProfileVisual
    active={selectedSection === 'about'}
  />
)}

      <AnimatePresence mode="wait">

  {selectedSection === 'about' ? (

    <AboutContent key="about-content" />

  ) : (

    <motion.div
      key={selectedSection || 'explore'}
      className="bubble-page-heading"

      initial={{
        opacity: 0,
        y: 14
      }}

      animate={{
        opacity: 1,
        y: 0
      }}

      exit={{
        opacity: 0,
        y: -8
      }}

      transition={{
        duration: 0.35
      }}
    >

      <span>
        03 — {selectedSection
          ? selectedSection.toUpperCase()
          : 'EXPLORE'}
      </span>

      <h2>
        {selectedSection
          ? sectionContent[selectedSection].title
          : 'Inside the archive'}
      </h2>

        {selectedSection &&
        selectedSection !== 'education' &&
        selectedSection !== 'experience' &&
        selectedSection !== 'skills' && (
    <p className="bubble-section-description">
        {sectionContent[selectedSection].text}
    </p>
    )}

    </motion.div>

  )}

      </AnimatePresence>


      {/* =========================
          EDUCATION CONTENT
      ========================= */}

      <AnimatePresence>
        {selectedSection === 'education' && (
          <EducationContent key="education-content" />
        )}
      </AnimatePresence>

      {/* =========================
            SKILLS CONTENT
        ========================= */}

        <AnimatePresence>
        {selectedSection === 'skills' && (
            <SkillsContent key="skills-content" />
        )}
        </AnimatePresence>

      {/* =========================
            EXPERIENCE CONTENT
        ========================= */}

        <AnimatePresence>
        {selectedSection === 'experience' && (
            <ExperienceContent key="experience-content" />
        )}
        </AnimatePresence>


      <BubbleMenu
        key={bubbleResetKey}

        active={isInView}

        onItemSelect={
          handleBubbleSelect
        }

        physicsActive={
          physicsActive
        }

        gravity={2.2}

        mouseConstraintStiffness={0.55}

        logo={
          <span className="bubble-sol-logo">
            SOL.
          </span>
        }

        items={bubbleItems}

        fallenOrder={fallenBubbleOrder}

        menuAriaLabel="Explore portfolio"

        menuBg="#f3eee8"

        menuContentColor="#321316"

        useFixedPosition={false}

        animationEase="back.out(1.5)"

        animationDuration={0.55}

        staggerDelay={0.1}
      />

    </section>
  )
}

export default BubblePage