import { motion, useReducedMotion } from 'framer-motion'
import { easingSoft } from '../../motion/presets'
import { useMusicPlayback } from '../../hooks/useMusicPlayback'
import styles from './MusicToggle.module.css'

export function MusicToggle() {
  const { togglePlayback, isPlaying, hasAttemptedStart } = useMusicPlayback()
  const reduced = useReducedMotion() ?? false

  const label = isPlaying ? 'Pause music' : 'Play music'

  return (
    <motion.div
      className={styles.wrap}
      initial={reduced ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0 : 0.45,
        ease: easingSoft,
        delay: reduced ? 0 : 0.2,
      }}
    >
      <motion.button
        type="button"
        className={styles.button}
        onClick={togglePlayback}
        aria-pressed={isPlaying}
        aria-label={label}
        title={label}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      >
        {hasAttemptedStart ? (isPlaying ? 'Pause' : 'Play') : 'Music'}
      </motion.button>
    </motion.div>
  )
}
