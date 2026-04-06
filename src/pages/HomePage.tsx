import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { pickAccentGallerySources } from '../data/gallery'
import { useMusicPlayback } from '../hooks/useMusicPlayback'
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
  const { beginPlaybackFromUserGesture, ensureMusicForHomeView } =
    useMusicPlayback()

  useEffect(() => {
    ensureMusicForHomeView()
  }, [ensureMusicForHomeView])

  const accentPhotos = useMemo(
    () =>
      pickAccentGallerySources(12).map((src) => ({ src, key: src })),
    [],
  )

  const container = {
    hidden: {},
    show: {
      transition: transitionStagger(reduced, 0.1),
    },
  }

  const item = {
    hidden: reduced
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.55, ease: easingSoft },
    },
  }

  const navWrapper = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : 0.5,
        ease: easingSoft,
        staggerChildren: reduced ? 0 : 0.07,
        delayChildren: reduced ? 0 : 0.12,
      },
    },
  }

  const navChip = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.4, ease: easingSoft },
    },
  }

  return (
    <div className={styles.pageShell}>
      <div className={styles.bgMesh} aria-hidden />
      <div className={styles.bgOrbs} aria-hidden />
      <div className={styles.bgHearts} aria-hidden>
        <span className={styles.heartFloat}>♥</span>
        <span className={styles.heartFloat}>♡</span>
        <span className={styles.heartFloat}>✦</span>
        <span className={styles.heartFloat}>❀</span>
      </div>
      {accentPhotos.length > 0 ? (
        <div className={styles.bgPhotos} aria-hidden>
          {accentPhotos.map((photo, i) => (
            <div
              key={photo.key}
              className={styles.photoFloat}
              data-slot={i}
            >
              <img
                src={photo.src}
                alt=""
                className={styles.photoImg}
                decoding="async"
              />
            </div>
          ))}
        </div>
      ) : null}
      <PageContainer className={styles.pageInner}>
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
            Open each piece when you’re ready — photos, videos, our story, a
            letter, and one last surprise.
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
                  onClick={() => beginPlaybackFromUserGesture()}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </PageContainer>
    </div>
  )
}
