import { useMemo, type CSSProperties } from 'react'
import { pickAccentGallerySources } from '../../data/gallery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import styles from './LandingBackground.module.css'

function Balloon({ fill, className }: { fill: string; className?: string }) {
  return (
    <svg
      className={className}
      width="52"
      height="78"
      viewBox="0 0 52 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M26 5C14 5 5 14 5 26c0 16 14 26 21 32 7-6 21-16 21-32 0-12-9-21-21-21z"
        fill={fill}
        stroke="rgba(234,176,191,0.35)"
        strokeWidth="1.2"
      />
      <path
        d="M26 54v20"
        stroke="rgba(234,176,191,0.45)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

const ORB_COUNT = 9
const CONFETTI_COUNT = 16
const ACCENT_PHOTO_COUNT = 12
const PLACEHOLDER_FRAMES = 12

type AccentFrame =
  | { kind: 'img'; src: string; key: string }
  | { kind: 'placeholder'; key: string }

const FLOATING_HEARTS = [
  '♥',
  '♡',
  '♥',
  '✦',
  '♡',
  '❥',
  '♥',
  '♡',
  '✦',
  '♥',
  '♡',
  '❥',
] as const

export function LandingBackground({ exiting = false }: { exiting?: boolean }) {
  const reduced = usePrefersReducedMotion()
  const accentFrames = useMemo((): AccentFrame[] => {
    const urls = pickAccentGallerySources(ACCENT_PHOTO_COUNT)
    if (urls.length > 0) {
      return urls.map((src) => ({ kind: 'img' as const, src, key: src }))
    }
    return Array.from({ length: PLACEHOLDER_FRAMES }, (_, i) => ({
      kind: 'placeholder' as const,
      key: `landing-memory-${i}`,
    }))
  }, [])

  return (
    <div
      className={`${styles.layer} ${exiting ? styles.layerExiting : ''} ${reduced ? styles.static : ''}`}
      aria-hidden
    >
      <div className={styles.skyWash} />
      <div className={styles.circleLeft} />
      <div className={styles.circleRight} />
      <div className={styles.circleSoft} />

      <div className={styles.orbLayer}>
        {Array.from({ length: ORB_COUNT }, (_, i) => (
          <div key={i} className={styles.orb} data-i={i} />
        ))}
      </div>

      <div className={styles.balloonCluster} data-side="right">
        <Balloon fill="#8b4a62" className={styles.balloon1} />
        <Balloon fill="#f5d0dc" className={styles.balloon2} />
        <Balloon fill="#c06b84" className={styles.balloon3} />
        <Balloon fill="#e8c4cf" className={styles.balloon4} />
      </div>

      <div className={styles.balloonClusterLeft} data-side="left">
        <Balloon fill="#d896a8" className={styles.bLeft1} />
        <Balloon fill="#6d3d4d" className={styles.bLeft2} />
        <Balloon fill="#eab0bf" className={styles.bLeft3} />
        <Balloon fill="#a85c72" className={styles.bLeft4} />
      </div>

      <div className={styles.heartsLayer}>
        {FLOATING_HEARTS.map((symbol, i) => (
          <span key={i} className={styles.heartFloat} data-h={i}>
            {symbol}
          </span>
        ))}
      </div>

      <div className={styles.confettiLayer}>
        {Array.from({ length: CONFETTI_COUNT }, (_, i) => (
          <span
            key={i}
            className={styles.confetti}
            style={
              {
                left: `${(i * 23) % 88}%`,
                top: `${(i * 31) % 70}%`,
                animationDelay: `${-i * 0.35}s`,
                background:
                  i % 3 === 0 ? '#ffb07a' : i % 3 === 1 ? '#7ec8f5' : '#fff4a8',
                transform: `rotate(${i * 19}deg)`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {accentFrames.map((item, i) => (
        <div
          key={item.key}
          className={`${styles.photoFloat} ${item.kind === 'placeholder' ? styles.photoPlaceholder : ''} ${reduced ? styles.static : styles[`drift${i % 3}`]}`}
          data-slot={i}
          style={
            {
              '--i': i,
              '--rot': `${-5 + (i % 4) * 3}deg`,
            } as CSSProperties
          }
        >
          {item.kind === 'img' ? (
            <img
              src={item.src}
              alt=""
              className={styles.photoImg}
              decoding="async"
            />
          ) : (
            <div className={styles.photoPlaceholderInner} />
          )}
        </div>
      ))}
    </div>
  )
}
