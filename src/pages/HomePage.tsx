import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { easingSoft, transitionStagger } from '../motion/presets'
import styles from './HomePage.module.css'

const navLinks = [
  { to: '/gallery', label: 'Photo memories', finale: false },
  { to: '/videos', label: 'Video moments', finale: false },
  { to: '/letter', label: 'Love letter', finale: false },
  { to: '/journey', label: 'Our journey', finale: false },
  { to: '/finale', label: 'Final surprise', finale: true },
] as const

export default function HomePage() {
  const reduced = useReducedMotion() ?? false

  const container = {
    hidden: {},
    show: {
      transition: transitionStagger(reduced, 0.11),
    },
  }

  const item = {
    hidden: reduced
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.58, ease: easingSoft },
    },
  }

  const navWrapper = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : 0.52,
        ease: easingSoft,
        staggerChildren: reduced ? 0 : 0.06,
        delayChildren: reduced ? 0 : 0.05,
      },
    },
  }

  const navChip = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 11 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.38, ease: easingSoft },
    },
  }

  return (
    <PageContainer>
      <motion.div
        className={styles.stack}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p className={styles.eyebrow} variants={item}>
          For you
        </motion.p>
        <motion.h1 className={styles.title} variants={item}>
          Happy birthday
        </motion.h1>
        <motion.p className={styles.sub} variants={item}>
          This is the start of your surprise. More moments will appear here
          soon.
        </motion.p>

        <motion.div className={styles.navRow} variants={navWrapper}>
          {navLinks.map(({ to, label, finale }) => (
            <motion.div
              key={to}
              className={styles.navChip}
              variants={navChip}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 440, damping: 30 }}
            >
              <Link
                className={`${styles.navLink}${finale ? ` ${styles.navLinkFinale}` : ''}`}
                to={to}
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </PageContainer>
  )
}
