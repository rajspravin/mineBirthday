import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import styles from './GalleryRomanticBackdrop.module.css'

const HEARTS = ['♥', '♡', '💕', '❤', '♥', '♡', '✦', '♥'] as const

function Balloon({ fill }: { fill: string }) {
  return (
    <svg
      width="48"
      height="72"
      viewBox="0 0 48 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M24 4C14 4 6 12 6 22c0 14 12 22 18 28 6-6 18-14 18-28 0-10-8-18-18-18z"
        fill={fill}
        stroke="rgba(40,25,45,0.35)"
        strokeWidth="1.2"
      />
      <path
        d="M24 50v18"
        stroke="rgba(60,45,70,0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 68l8 4"
        stroke="rgba(60,45,70,0.45)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function GalleryRomanticBackdrop() {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      className={`${styles.root} ${reduced ? styles.static : ''}`}
      aria-hidden
    >
      <div className={styles.skyWash} />
      <div className={styles.stars} />
      <div className={styles.heartsLayer}>
        {HEARTS.map((h, i) => (
          <span key={i} className={styles.heart}>
            {h}
          </span>
        ))}
      </div>
      <div className={styles.balloons}>
        <div className={styles.balloon}>
          <Balloon fill="#ff8fb8" />
        </div>
        <div className={styles.balloon}>
          <Balloon fill="#c4a8ff" />
        </div>
        <div className={styles.balloon}>
          <Balloon fill="#ffb8d8" />
        </div>
        <div className={styles.balloon}>
          <Balloon fill="#9fd4ff" />
        </div>
      </div>
      <div className={styles.coupleWrap}>
        <svg
          className={styles.coupleSvg}
          viewBox="0 0 320 120"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <title>Cartoon couple</title>
          {/* Simple cartoon silhouettes — rounded, holding hands */}
          <ellipse cx="118" cy="98" rx="42" ry="8" fill="rgba(0,0,0,0.12)" />
          <ellipse cx="202" cy="98" rx="42" ry="8" fill="rgba(0,0,0,0.12)" />
          {/* Left figure */}
          <circle cx="105" cy="38" r="22" fill="#ffd6e8" stroke="#c98ba8" strokeWidth="2" />
          <ellipse cx="105" cy="78" rx="20" ry="28" fill="#ffb8d0" stroke="#c98ba8" strokeWidth="2" />
          <ellipse cx="92" cy="72" rx="7" ry="18" fill="#ffd6e8" stroke="#c98ba8" strokeWidth="1.5" />
          <ellipse cx="118" cy="72" rx="7" ry="18" fill="#ffd6e8" stroke="#c98ba8" strokeWidth="1.5" />
          {/* Right figure */}
          <circle cx="215" cy="38" r="22" fill="#d4e8ff" stroke="#7a9cc4" strokeWidth="2" />
          <ellipse cx="215" cy="78" rx="20" ry="28" fill="#b8d8ff" stroke="#7a9cc4" strokeWidth="2" />
          <ellipse cx="202" cy="72" rx="7" ry="18" fill="#d4e8ff" stroke="#7a9cc4" strokeWidth="1.5" />
          <ellipse cx="228" cy="72" rx="7" ry="18" fill="#d4e8ff" stroke="#7a9cc4" strokeWidth="1.5" />
          {/* Hands meeting */}
          <ellipse cx="160" cy="68" rx="14" ry="12" fill="#ffe0ec" stroke="#e8a0b8" strokeWidth="1.8" />
          {/* Small hearts above */}
          <path
            d="M155 12c-4-6-12-6-12 2 0 8 12 14 12 14s12-6 12-14c0-8-8-8-12-2z"
            fill="#ff8fab"
            opacity="0.85"
          />
          <path
            d="M178 8c-3-5-9-5-9 2 0 6 9 11 9 11s9-5 9-11c0-7-6-7-9-2z"
            fill="#ffa8c8"
            opacity="0.75"
          />
        </svg>
      </div>
      <div className={styles.groundLine} />
    </div>
  )
}
