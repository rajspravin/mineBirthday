import confetti from 'canvas-confetti'
import { useEffect, useRef, useState } from 'react'
import { FINALE_CONFIG, type FinaleMedia } from '../../data/finale'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import styles from './FinaleSection.module.css'

const CONFETTI_COLORS = [
  '#eab0bf',
  '#ffffff',
  '#f5cad6',
  '#d896a8',
  '#c47a90',
  '#fce8ee',
]

function fireFinaleConfetti() {
  void confetti({
    particleCount: 48,
    angle: 65,
    spread: 52,
    startVelocity: 38,
    origin: { x: 0.08, y: 0.72 },
    colors: CONFETTI_COLORS,
    ticks: 220,
    gravity: 0.95,
    scalar: 0.95,
  })
  void confetti({
    particleCount: 48,
    angle: 115,
    spread: 52,
    startVelocity: 38,
    origin: { x: 0.92, y: 0.72 },
    colors: CONFETTI_COLORS,
    ticks: 220,
    gravity: 0.95,
    scalar: 0.95,
  })
  window.setTimeout(() => {
    void confetti({
      particleCount: 85,
      spread: 95,
      startVelocity: 32,
      origin: { x: 0.5, y: 0.38 },
      colors: CONFETTI_COLORS,
      ticks: 260,
      gravity: 0.9,
      scalar: 1,
    })
  }, 200)
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  )
}

function FinaleMediaBlock({ media }: { media: FinaleMedia }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoStarted, setVideoStarted] = useState(false)

  if (media.type === 'none') return null

  if (media.type === 'image') {
    if (!media.src) return null
    return (
      <figure className={styles.mediaFrame}>
        <img
          className={styles.image}
          src={media.src}
          alt={media.alt}
          loading="lazy"
          decoding="async"
        />
      </figure>
    )
  }

  if (!media.src) return null

  return (
    <figure className={styles.mediaFrame}>
      <div className={styles.videoShell}>
        <video
          ref={videoRef}
          className={styles.video}
          src={media.src}
          poster={media.poster}
          preload="none"
          playsInline
          controls={videoStarted}
          onPlay={() => setVideoStarted(true)}
        />
        <button
          type="button"
          className={`${styles.videoOverlay} ${videoStarted ? styles.videoOverlayHidden : ''}`}
          onClick={() => {
            void videoRef.current?.play()
          }}
          aria-label={`Play video: ${media.description}`}
        >
          <span className={styles.playCircle}>
            <PlayIcon />
          </span>
        </button>
      </div>
      {media.description ? (
        <figcaption className={styles.mediaCaption}>{media.description}</figcaption>
      ) : null}
    </figure>
  )
}

type FinaleSectionProps = {
  config?: typeof FINALE_CONFIG
}

export function FinaleSection({ config = FINALE_CONFIG }: FinaleSectionProps) {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(() => reduced)
  const confettiFired = useRef(false)

  useEffect(() => {
    if (reduced) return

    const el = rootRef.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting)
        if (hit) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.22, rootMargin: '0px 0px -6% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  useEffect(() => {
    if (!revealed || reduced || !config.confetti || confettiFired.current) return
    confettiFired.current = true
    const id = window.setTimeout(() => fireFinaleConfetti(), 420)
    return () => window.clearTimeout(id)
  }, [revealed, reduced, config.confetti])

  const showMedia =
    config.media.type === 'image' || config.media.type === 'video'

  return (
    <section
      ref={rootRef}
      className={styles.root}
      aria-labelledby="finale-headline"
    >
      <div className={styles.glow} aria-hidden />
      <div className={styles.sparkles} aria-hidden />
      <div className={styles.inner}>
        <p
          className={`${styles.eyebrow} ${revealed ? styles.eyebrowIn : ''}`}
        >
          One last thing
        </p>

        <h1
          id="finale-headline"
          className={`${styles.headlineRow} ${revealed ? styles.headlineRowIn : ''}`}
          aria-label={
            [config.headline, config.headlineAccent].filter(Boolean).join(' ') ||
            config.headline
          }
        >
          {config.headline}
          {config.headlineAccent ? (
            <span className={styles.accent} aria-hidden>
              {' '}
              {config.headlineAccent}
            </span>
          ) : null}
        </h1>

        <p className={`${styles.subline} ${revealed ? styles.sublineIn : ''}`}>
          {config.subline}
        </p>

        {showMedia ? (
          <div
            className={`${styles.mediaWrap} ${revealed ? styles.mediaWrapIn : ''}`}
          >
            <FinaleMediaBlock media={config.media} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
