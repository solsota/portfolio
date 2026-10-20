import React, { useRef } from 'react'
import { useInView } from 'motion/react'
import './ProjectMarqueeGallery.css'

function MarqueeRow({ items, direction = 'left', speed = 'slow' }) {
  const duplicatedItems = [...items, ...items]

  return (
    <div className={`marquee-row marquee-row-${direction}`}>
      <div className={`marquee-track marquee-${speed}`}>
        {duplicatedItems.map((item, index) => (
          <a
            key={`${item.title}-${index}`}
            href={item.link}
            className="marquee-card"
          >
            <img src={item.thumbnail} alt={item.title} />
          </a>
        ))}
      </div>
    </div>
  )
}

function ProjectMarqueeGallery({ products }) {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, {
    amount: 0.25,
    once: false,
  })

  const row1 = products.slice(0, 5)
  const row2 = products.slice(5, 10)
  const row3 = products.slice(10, 15)

  return (
    <section
      ref={sectionRef}
      className={`project-marquee-section ${isInView ? 'is-active' : ''}`}
      id="projects"
    >
      <div className="project-marquee-inner">
        <MarqueeRow items={row1} direction="right" speed="slow" />
        <MarqueeRow items={row2} direction="left" speed="medium" />
        <MarqueeRow items={row3} direction="right" speed="slow" />
      </div>
    </section>
  )
}

export default ProjectMarqueeGallery