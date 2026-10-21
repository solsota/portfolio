import { useLanguage } from '../../i18n/LanguageContext'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'

import layer1 from '../../assets/about-profile/layer-1.webp'
import layer2 from '../../assets/about-profile/layer-2.webp'
import layer3 from '../../assets/about-profile/layer-3.webp'

import './AboutProfileVisual.css'


const originalProfileLines = [
  'Sol Masetti',
  'UX UI - Game Designer',
  'Creative thinker & maker',
  'Travel Passionate',
  'Entrepreneur',
  'Argentina',
  'Spanish / English / Italian'
]


export default function AboutProfileVisual({
  active = false
}) {
  const { t } = useLanguage()
  const profileLines = useMemo(() => originalProfileLines.map((line) => t(line)), [t])

  const [typedLines, setTypedLines] =
    useState(
      profileLines.map(() => '')
    )


  /* =========================
     TYPEWRITER
  ========================= */

  useEffect(() => {

    if (!active) {

      const resetId = setTimeout(() => {
        setTypedLines(profileLines.map(() => ''))
      }, 0)

      return () => clearTimeout(resetId)
    }


    let timeoutId
    let startDelayId


    const nextLines =
      profileLines.map(() => '')

    let lineIndex = 0
    let charIndex = 0


    const typeNext = () => {

      if (
        lineIndex >=
        profileLines.length
      ) {
        return
      }


      const currentLine =
        profileLines[lineIndex]


      nextLines[lineIndex] =
        currentLine.slice(
          0,
          charIndex + 1
        )


      setTypedLines([
        ...nextLines
      ])


      charIndex += 1


      if (
        charIndex <
        currentLine.length
      ) {

        timeoutId =
          setTimeout(
            typeNext,
            28
          )

      } else {

        lineIndex += 1
        charIndex = 0

        timeoutId =
          setTimeout(
            typeNext,
            170
          )
      }
    }


    /*
      Esperamos a que aparezcan
      las tres capas antes de
      empezar a escribir.
    */

    startDelayId =
      setTimeout(() => {
        typeNext()
      }, 1050)


    return () => {

      clearTimeout(
        timeoutId
      )

      clearTimeout(
        startDelayId
      )
    }

  }, [active, profileLines])


  return (

    <div className="about-profile-visual">

      <div className="about-profile-stage">


        {/* =========================
            CAPA 1
        ========================= */}

        <motion.img
          src={layer1}
          alt=""
          className="about-profile-layer"

          initial={{
            opacity: 0,
            scale: 0.86,
            y: 28
          }}

          animate={
            active
              ? {
                  opacity: 1,
                  scale: 1,
                  y: 0
                }
              : {
                  opacity: 0,
                  scale: 0.86,
                  y: 28
                }
          }

          transition={{
            duration: 0.5,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1]
          }}
        />


        {/* =========================
            CAPA 2
        ========================= */}

        <motion.img
          src={layer2}
          alt=""
          className="about-profile-layer"

          initial={{
            opacity: 0,
            scale: 0.88,
            y: 25
          }}

          animate={
            active
              ? {
                  opacity: 1,
                  scale: 1,
                  y: 0
                }
              : {
                  opacity: 0,
                  scale: 0.88,
                  y: 25
                }
          }

          transition={{
            duration: 0.52,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1]
          }}
        />


        {/* =========================
            CAPA 3
        ========================= */}

        <motion.div
          className="about-profile-front-wrap"

          initial={{
            opacity: 0,
            scale: 0.9,
            y: 22
          }}

          animate={
            active
              ? {
                  opacity: 1,
                  scale: 1,
                  y: 0
                }
              : {
                  opacity: 0,
                  scale: 0.9,
                  y: 22
                }
          }

          transition={{
            duration: 0.55,
            delay: 0.38,
            ease: [0.22, 1, 0.36, 1]
          }}
        >

          <img
            src={layer3}
            alt={t("Profile archive visual")}
            className="about-profile-layer"
          />


          {/* =========================
              TEXTO SOBRE CAPA 3
          ========================= */}

          <div className="about-profile-typewriter">

            <h3 className="about-profile-heading">{t("MY PROFILE")}</h3>


            <div className="about-profile-lines">

              {typedLines.map(
                (line, index) => (

                  <div
                    key={index}
                    className="about-profile-line"
                  >
                    <span>
                      {line}
                    </span>
                  </div>

                )
              )}

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  )
}
