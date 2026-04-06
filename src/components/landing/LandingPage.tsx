import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BIRTHDAY_RECIPIENT_NAME } from '../../data/site'
import { useMusicPlayback } from '../../hooks/useMusicPlayback'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useTypingText } from '../../hooks/useTypingText'
import { easingSoft } from '../../motion/presets'
import styles from './LandingPage.module.css'

const INTRO_MS = 820

export default function LandingPage() {
  const navigate = useNavigate()
  const { beginPlaybackFromUserGesture } = useMusicPlayback()
  const reducedMotion = usePrefersReducedMotion()
  const fmReduced = useReducedMotion() ?? false
  const [delayedIntro, setDelayedIntro] = useState(false)
  const trimmedName = BIRTHDAY_RECIPIENT_NAME.trim()
  const hasName = trimmedName.length > 0

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setTimeout(() => setDelayedIntro(true), INTRO_MS)
    return () => window.clearTimeout(id)
  }, [reducedMotion])

  const introDone = reducedMotion || delayedIntro

  const typingEnabled = introDone && hasName && !reducedMotion
  const { displayed, complete } = useTypingText(hasName ? trimmedName : '', {
    msPerChar: 88,
    enabled: typingEnabled,
  })

  const nameVisible = reducedMotion && hasName ? trimmedName : displayed
  const showCursor = hasName && !reducedMotion && introDone && !complete
  const nameComplete = !hasName || reducedMotion || complete
  const showButton = introDone && nameComplete

  return (
    <motion.div
      className={styles.viewport}
      initial={fmReduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: fmReduced ? 0 : 0.85, ease: easingSoft }}
    >
      <div className={styles.bg} aria-hidden />
      <div className={styles.shimmer} aria-hidden />
      <div className={styles.content}>
        <h1 className={styles.title}>Happy Birthday ❤️</h1>
        {hasName ? (
          <p className={styles.nameLine} aria-live="polite">
            {nameVisible}
            {showCursor ? <span className={styles.cursor} aria-hidden /> : null}
          </p>
        ) : null}
        <div
          className={`${styles.cta} ${showButton ? styles.ctaVisible : ''}`}
        >
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              beginPlaybackFromUserGesture()
              navigate('/home')
            }}
          >
            Tap to Start
          </button>
        </div>
      </div>
    </motion.div>
  )
}
