import './App.css'

import Lanyard from './components/Lanyard/Lanyard'
import HeroParallaxBackground from './components/HeroParallaxBackground/HeroParallaxBackground'
import BubblePage from './components/BubblePage/BubblePage'

const products = [
  {
    title: 'Moonbeam',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/moonbeam.png',
  },
  {
    title: 'Cursor',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/cursor.png',
  },
  {
    title: 'Rogue',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/rogue.png',
  },
  {
    title: 'Editorially',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/editorially.png',
  },
  {
    title: 'Editrix AI',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/editrix.png',
  },

  {
    title: 'Pixel Perfect',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/pixelperfect.png',
  },
  {
    title: 'Algochurn',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/algochurn.png',
  },
  {
    title: 'Aceternity UI',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/aceternityui.png',
  },
  {
    title: 'Tailwind Master Kit',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png',
  },
  {
    title: 'SmartBridge',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/smartbridge.png',
  },

  {
    title: 'Renderwork',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/renderwork.png',
  },
  {
    title: 'Creme Digital',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/cremedigital.png',
  },
  {
    title: 'Golden Bells',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png',
  },
  {
    title: 'Invoker',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/invoker.png',
  },
  {
    title: 'E Free Invoice',
    link: '#',
    thumbnail:
      'https://www.aceternity.com/images/products/thumbnails/new/efreeinvoice.png',
  },
]


function App() {
  return (
    <div className="portfolio">

      <header className="navbar">

        <nav className="navigation">

          <button
            className="language-toggle"
            type="button"
            aria-label="Change language"
          >
            EN/ES
          </button>

          <a href="#projects">
            Work
          </a>

          <a href="#about">
            About me
          </a>

          <a href="#contact">
            Contact
          </a>

        </nav>

      </header>


      <main>

        <section
          className="hero"
          id="home"
        >

          <HeroParallaxBackground
            products={products}
          />


          <div className="hero-content">

            <h1 className="archive-title">

              <span className="archive-top">

                <span className="sols">
                  SOL's
                </span>

                <span className="creative">
                  creative
                </span>

              </span>

              <span className="archive-word">
                ARCHIVE
              </span>

            </h1>


            <h2 className="hero-role">
              Digital & Game Experience Designer
            </h2>


            <p className="hero-description">
              I’m Sol, a multidisciplinary designer creating playful,
              intuitive and visually engaging experiences across digital
              products, games and creative projects.
            </p>

          </div>


          <div
            className="projects-anchor"
            id="projects"
            aria-hidden="true"
          />

          </section>

          <BubblePage />
      </main>


      <div className="lanyard-overlay">

        <Lanyard
          position={[0, 0.1, 11.2]}
          offset={[2.7, 0.5, 0]}
          gravity={[-7, -30, 0]}
          fov={18}
          lanyardWidth={0.7}
          frontImage="/lanyard-front.png"
          backImage="/lanyard-back.png"
          imageFit="cover"
        />

      </div>

    </div>
  )
}

export default App