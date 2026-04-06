import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { GalleryImage } from '../../data/gallery'
import { GALLERY_IMAGES } from '../../data/gallery'
import { easingSoft } from '../../motion/presets'
import styles from './PhotoGallery.module.css'

type PhotoGalleryProps = {
  images?: GalleryImage[]
  title?: string
}

/** Cycled entrance / exit motion as each frame scrolls in and out of view. */
const STORY_VARIANTS = [
  {
    hidden: {
      opacity: 0,
      y: 72,
      scale: 0.9,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    },
  },
  {
    hidden: { opacity: 0, x: -80, rotate: -2.5 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  {
    hidden: { opacity: 0, x: 80, rotate: 2.5 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  {
    hidden: { opacity: 0, scale: 1.12, y: 56 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  {
    hidden: {
      opacity: 0,
      clipPath: 'inset(14% 10% 18% 10% round 1.25rem)',
    },
    visible: {
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 0% round 1.25rem)',
    },
  },
] as const

function StoryFrame({
  img,
  index,
  reduced,
  total,
}: {
  img: GalleryImage
  index: number
  reduced: boolean
  total: number
}) {
  const blockRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ['start end', 'end start'],
  })

  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [56, -56],
  )
  const imgScale = useTransform(
    scrollYProgress,
    [0, 0.48, 1],
    reduced ? [1, 1, 1] : [1.1, 1, 1.05],
  )
  const frameGlow = useTransform(
    scrollYProgress,
    [0, 0.35, 0.55, 1],
    [0.25, 0.85, 0.75, 0.35],
  )

  const variants = STORY_VARIANTS[index % STORY_VARIANTS.length]!

  return (
    <motion.section
      ref={blockRef}
      className={styles.storyBlock}
      aria-label={`Memory ${index + 1} of ${total}`}
    >
      <div className={styles.storyGlowLine} aria-hidden />
      <motion.div
        className={styles.storyCard}
        variants={variants}
        initial={reduced ? false : 'hidden'}
        animate={reduced ? 'visible' : undefined}
        whileInView={reduced ? undefined : 'visible'}
        viewport={
          reduced
            ? { once: true, amount: 0.15 }
            : {
                once: false,
                amount: 0.38,
                margin: '0px 0px -18% 0px',
              }
        }
        transition={{
          duration: reduced ? 0 : 0.88,
          ease: easingSoft,
        }}
      >
        <motion.div
          className={styles.frameGlow}
          style={{ opacity: reduced ? 0.5 : frameGlow }}
          aria-hidden
        />
        <div className={styles.imgFrame}>
          <motion.img
            className={styles.storyImg}
            src={img.src}
            alt={img.alt}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            style={{ y: imgY, scale: imgScale }}
          />
        </div>
        <div className={styles.captionBlock}>
          <span className={styles.memoryIndex}>
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <p className={styles.caption}>{img.alt}</p>
          <time className={styles.dateTag} dateTime={img.dateIso}>
            {img.dateLabel}
          </time>
        </div>
      </motion.div>
      <p className={styles.scrollCue} aria-hidden>
        {index < total - 1 ? '↓' : '♥'}
      </p>
    </motion.section>
  )
}

export function PhotoGallery({
  images = GALLERY_IMAGES,
  title = 'Memories',
}: PhotoGalleryProps) {
  const reduced = useReducedMotion() ?? false

  useEffect(() => {
    if (images.length === 0 || reduced) return
    const el = document.documentElement
    const prev = el.style.scrollSnapType
    el.style.scrollSnapType = 'y proximity'
    return () => {
      el.style.scrollSnapType = prev
    }
  }, [images.length, reduced])

  if (images.length === 0) {
    return (
      <section className={styles.section} aria-label={title}>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        <p className={styles.empty}>
          Add images under <code>public/assets/images/</code> — they are listed
          automatically at dev/build (see <code>plugins/mediaCatalogPlugin.ts</code>
          ).
        </p>
      </section>
    )
  }

  return (
    <div className={styles.scrollRoot}>
      <header className={styles.intro}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.introSub}>
          Scroll slowly — each photo blooms into view, then yields to the next.
        </p>
      </header>
      <div className={styles.storyList}>
        {images.map((img, index) => (
          <StoryFrame
            key={img.src}
            img={img}
            index={index}
            reduced={reduced}
            total={images.length}
          />
        ))}
      </div>
      <p className={styles.endNote} aria-hidden>
        ✦ All caught up ✦
      </p>
    </div>
  )
}
