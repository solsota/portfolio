import { useRef, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import mediaSizes from '../../data/projectMediaSizes.json'

export default function ProjectVideo({ media, label }) {
  const { t } = useLanguage()
  const videoRef = useRef(null)
  const retriedRef = useRef(false)
  const playbackRequestedRef = useRef(false)
  const [failed, setFailed] = useState(false)
  const [nativeHls] = useState(() => {
    const video = document.createElement('video')
    return typeof video.webkitSupportsPresentationMode === 'function' &&
      Boolean(video.canPlayType('application/vnd.apple.mpegurl'))
  })
  // Some Chromium builds report "maybe" for HLS but stall on native playback.
  // WebKit uses its native player; other engines get the compatible MP4.
  const sources = media.sources?.filter(source => source.type !== 'application/vnd.apple.mpegurl' || nativeHls)

  const handleError = () => {
    const video = videoRef.current
    // If a native streaming decoder fails, retry the compatible MP4 once.
    if (!retriedRef.current && media.sources?.length &&
        video.currentSrc !== new URL(media.src, window.location.href).href) {
      retriedRef.current = true
      video.src = media.src
      video.load()
      if (playbackRequestedRef.current) video.play().catch(() => {})
    } else setFailed(true)
  }

  return (
    <div className="project-video">
      <video
        ref={videoRef}
        src={sources?.length ? undefined : media.src}
        controls
        playsInline
        preload="none"
        poster={media.poster}
        {...mediaSizes[media.poster]}
        aria-label={label}
        onPointerDownCapture={() => { playbackRequestedRef.current = true }}
        onLoadedData={() => setFailed(false)}
        onPlay={() => { playbackRequestedRef.current = true }}
        onError={handleError}
      >
        {sources?.map(source => <source key={source.src} src={source.src} type={source.type} />)}
      </video>
      {failed && <a className="project-video-fallback" href={media.src} target="_blank" rel="noopener noreferrer">{t('Open video')}</a>}
    </div>
  )
}
