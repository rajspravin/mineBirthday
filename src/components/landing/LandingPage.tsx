import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BIRTHDAY_RECIPIENT_NAME } from '../../data/site'
import { useMusicPlayback } from '../../hooks/useMusicPlayback'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useTypingText } from '../../hooks/useTypingText'
import { easingSoft } from '../../motion/presets'
import { LandingBackground } from './LandingBackground'
import styles from './LandingPage.module.css'

const INTRO_MS = 820
const EXIT_MS = 520

export default function LandingPage() {
  const navigate = useNavigate()
  const { startIntroInstrumental } = useMusicPlayback()
  const reducedMotion = usePrefersReducedMotion()
  const fmReduced = useReducedMotion() ?? false
  const [delayedIntro, setDelayedIntro] = useState(false)
  const [exiting, setExiting] = useState(false)
  const trimmedName = BIRTHDAY_RECIPIENT_NAME.trim()
  const hasName = trimmedName.length > 0

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setTimeout(() => setDelayedIntro(true), INTRO_MS)
    return () => window.clearTimeout(id)
  }, [reducedMotion])

  useEffect(() => {
    startIntroInstrumental()
  }, [startIntroInstrumental])

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

  const goHome = () => {
    if (reducedMotion || fmReduced) {
      navigate('/home')
      return
    }
    setExiting(true)
    window.setTimeout(() => navigate('/home'), EXIT_MS)
  }

  return (
    <motion.div
      className={`${styles.viewport} ${exiting ? styles.viewportExiting : ''}`}
      initial={fmReduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: fmReduced ? 0 : 0.85, ease: easingSoft }}
    >
      {/* .bg must render first so opaque gradient sits *under* LandingBackground (same z-index = paint order). */}
      <div className={styles.bg} aria-hidden />
      <LandingBackground exiting={exiting} />
      <div className={styles.shimmer} aria-hidden />
      <div className={styles.content}>
        <div className={styles.heroPlate}>
          <h1 className={styles.title}>Happy Birthday ❤️</h1>
          {hasName ? (
            <p className={styles.nameLine} aria-live="polite">
              {nameVisible}
              {showCursor ? <span className={styles.cursor} aria-hidden /> : null}
            </p>
          ) : null}
        </div>
        <div
          className={`${styles.cta} ${showButton ? styles.ctaVisible : ''}`}
        >
          <div className={styles.podium} aria-hidden />
          <motion.button
            type="button"
            className={styles.button}
            disabled={exiting}
            onClick={goHome}
            whileHover={
              fmReduced || exiting
                ? undefined
                : { scale: 1.03, boxShadow: '0 0 36px rgba(234, 176, 191, 0.35)' }
            }
            whileTap={fmReduced || exiting ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          >
            Tap to Start
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
