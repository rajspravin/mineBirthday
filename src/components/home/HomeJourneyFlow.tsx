import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LoveLetterSection } from '../loveLetter/LoveLetterSection'
import { buildJourneySlidesFromImages } from '../../data/buildJourneySlides'
import {
  HOME_OPENING_SUB,
  HOME_OPENING_TAMIL_QUOTE,
  JOURNEY_SLIDE_MS,
  LOVE_STORY_FINALE_TA,
  SLIDESHOW_SLIDE_MS,
} from '../../data/homeExperience'
import { GALLERY_IMAGES } from '../../data/gallery'
import { LOVE_LETTER_JULIE } from '../../data/loveLetterJulie'
import { VIDEO_CLIPS } from '../../data/videos'
import { useMusicPlayback } from '../../hooks/useMusicPlayback'
import { easingSoft } from '../../motion/presets'
import styles from './HomeJourneyFlow.module.css'

type Phase =
  | 'welcome'
  | 'slideshow'
  | 'videos'
  | 'journey'
  | 'letter'
  | 'finale'

function slideMotion(index: number, reduced: boolean) {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    }
  }
  const k = index % 5
  const ease = easingSoft
  switch (k) {
    case 0:
      return {
        initial: { opacity: 0, scale: 0.88 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.05 },
        transition: { duration: 0.78, ease },
      }
    case 1:
      return {
        initial: { opacity: 0, x: -56 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 40 },
        transition: { duration: 0.72, ease },
      }
    case 2:
      return {
        initial: { opacity: 0, x: 56 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
        transition: { duration: 0.72, ease },
      }
    case 3:
      return {
        initial: { opacity: 0, y: 48, rotate: -2 },
        animate: { opacity: 1, y: 0, rotate: 0 },
        exit: { opacity: 0, y: -28 },
        transition: { duration: 0.76, ease },
      }
    default:
      return {
        initial: { opacity: 0, scale: 1.12 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.92 },
        transition: { duration: 0.8, ease },
      }
  }
}

function journeyMotion(reduced: boolean) {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    }
  }
  return {
    initial: { opacity: 0, y: 28, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 1.02 },
    transition: { duration: 0.68, ease: easingSoft },
  }
}

type HomeJourneyFlowProps = {
  /** Show a way back to the home menu (full journey vs free explore). */
  showMenuEscape?: boolean
  onRequestMenu?: () => void
}

export function HomeJourneyFlow({
  showMenuEscape = false,
  onRequestMenu,
}: HomeJourneyFlowProps = {}) {
  const fmReduced = useReducedMotion() ?? false
  const {
    startSlideshowMusic,
    stopSlideshowMusic,
    stopIntroInstrumental,
    beginPlaybackFromUserGesture,
    setMusicInteractionGate,
  } = useMusicPlayback()

  const [phase, setPhase] = useState<Phase>('welcome')
  const [slideIndex, setSlideIndex] = useState(0)
  const [videoIndex, setVideoIndex] = useState(0)
  const [journeyIndex, setJourneyIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const images = GALLERY_IMAGES
  const videos = VIDEO_CLIPS

  const journeySlides = useMemo(
    () => buildJourneySlidesFromImages(images),
    [images],
  )

  const startLetterWithBackgroundMusic = useCallback(() => {
    stopSlideshowMusic()
    beginPlaybackFromUserGesture()
    setPhase('letter')
  }, [stopSlideshowMusic, beginPlaybackFromUserGesture])

  const enterJourneyWithRajaMusic = useCallback(() => {
    startSlideshowMusic()
    setJourneyIndex(0)
    setPhase('journey')
  }, [startSlideshowMusic])

  const afterSlideshow = useCallback(() => {
    if (videos.length > 0) {
      stopSlideshowMusic()
      setVideoIndex(0)
      setPhase('videos')
      return
    }
    if (journeySlides.length > 0) {
      setJourneyIndex(0)
      setPhase('journey')
      return
    }
    stopSlideshowMusic()
    startLetterWithBackgroundMusic()
  }, [
    stopSlideshowMusic,
    videos.length,
    journeySlides.length,
    startLetterWithBackgroundMusic,
  ])

  const afterVideos = useCallback(() => {
    if (journeySlides.length > 0) {
      enterJourneyWithRajaMusic()
      return
    }
    startLetterWithBackgroundMusic()
  }, [
    journeySlides.length,
    enterJourneyWithRajaMusic,
    startLetterWithBackgroundMusic,
  ])

  const handleStart = useCallback(() => {
    if (images.length > 0) {
      startSlideshowMusic()
      setSlideIndex(0)
      setPhase('slideshow')
      return
    }
    stopIntroInstrumental()
    if (videos.length === 0) {
      if (journeySlides.length > 0) enterJourneyWithRajaMusic()
      else startLetterWithBackgroundMusic()
      return
    }
    setVideoIndex(0)
    setPhase('videos')
  }, [
    images.length,
    startSlideshowMusic,
    stopIntroInstrumental,
    videos.length,
    journeySlides.length,
    enterJourneyWithRajaMusic,
    startLetterWithBackgroundMusic,
  ])

  useEffect(() => {
    if (phase === 'videos') setMusicInteractionGate('videos')
    else setMusicInteractionGate(null)
  }, [phase, setMusicInteractionGate])

  useEffect(() => {
    const lock = phase === 'slideshow' || phase === 'videos' || phase === 'journey'
    if (!lock) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'slideshow' || images.length === 0) return
    const id = window.setTimeout(() => {
      if (slideIndex >= images.length - 1) {
        afterSlideshow()
      } else {
        setSlideIndex((i) => i + 1)
      }
    }, SLIDESHOW_SLIDE_MS)
    return () => window.clearTimeout(id)
  }, [phase, slideIndex, images.length, afterSlideshow])

  useEffect(() => {
    if (phase !== 'videos' || videos.length === 0) return
    const v = videoRef.current
    const run = () => void v?.play().catch(() => {})
    const t = window.setTimeout(run, 0)
    return () => window.clearTimeout(t)
  }, [phase, videoIndex, videos.length])

  useEffect(() => {
    if (phase !== 'journey' || journeySlides.length === 0) return
    const id = window.setTimeout(() => {
      if (journeyIndex >= journeySlides.length - 1) {
        startLetterWithBackgroundMusic()
      } else {
        setJourneyIndex((i) => i + 1)
      }
    }, JOURNEY_SLIDE_MS)
    return () => window.clearTimeout(id)
  }, [phase, journeyIndex, journeySlides.length, startLetterWithBackgroundMusic])

  const handleVideoEnded = useCallback(() => {
    if (videoIndex < videos.length - 1) {
      setVideoIndex((i) => i + 1)
    } else {
      afterVideos()
    }
  }, [videoIndex, videos.length, afterVideos])

  const activeVideo = videos[videoIndex]
  const journeySlide = journeySlides[journeyIndex]
  const activeSlideImage = images[slideIndex]

  return (
    <div className={styles.root}>
      <div className={styles.ambient} aria-hidden />

      {phase === 'welcome' ? (
        <motion.div
          className={styles.content}
          initial={fmReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: easingSoft }}
        >
          <p className={styles.welcomeQuote}>{HOME_OPENING_TAMIL_QUOTE}</p>
          <p className={styles.welcomeSub}>{HOME_OPENING_SUB}</p>
          <button type="button" className={styles.startBtn} onClick={handleStart}>
            Start
          </button>
          {showMenuEscape && onRequestMenu ? (
            <button
              type="button"
              className={styles.menuEscape}
              onClick={onRequestMenu}
            >
              Or choose photos, videos &amp; more yourself
            </button>
          ) : null}
        </motion.div>
      ) : null}

      {phase === 'slideshow' && activeSlideImage ? (
        <div className={styles.mediaStage} aria-live="polite">
          <div className={styles.mediaFrame}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlideImage.src}
                {...slideMotion(slideIndex, fmReduced)}
                style={{ textAlign: 'center' }}
              >
                <img
                  className={styles.slideImg}
                  src={activeSlideImage.src}
                  alt={activeSlideImage.alt}
                  decoding="async"
                />
                <p className={styles.caption}>
                  {activeSlideImage.dateLabel} · {slideIndex + 1} / {images.length}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : null}

      {phase === 'videos' && activeVideo ? (
        <div className={styles.mediaStage}>
          <div className={styles.mediaFrame}>
            <div className={styles.videoShell}>
              <video
                ref={videoRef}
                key={activeVideo.src}
                className={styles.videoEl}
                src={activeVideo.src}
                poster={activeVideo.poster}
                controls
                playsInline
                preload="auto"
                onLoadedData={() => {
                  void videoRef.current?.play().catch(() => {})
                }}
                onEnded={handleVideoEnded}
              />
            </div>
            <h2 className={styles.videoTitle}>{activeVideo.title}</h2>
            {activeVideo.description ? (
              <p className={styles.videoMeta}>{activeVideo.description}</p>
            ) : null}
            <p className={styles.progress}>
              {videoIndex + 1} / {videos.length}
            </p>
          </div>
        </div>
      ) : null}

      {phase === 'journey' && journeySlide ? (
        <div className={styles.mediaStage}>
          <div className={styles.mediaFrame}>
            <AnimatePresence mode="wait">
              <motion.article
                key={journeySlide.id}
                className={styles.journeyCard}
                {...journeyMotion(fmReduced)}
              >
                <time
                  className={styles.journeyDate}
                  dateTime={journeySlide.dateIso}
                >
                  {journeySlide.year === 9999
                    ? journeySlide.dateLabel
                    : `${journeySlide.year} · ${journeySlide.dateLabel}`}
                </time>
                <h2 className={styles.journeyTitle}>{journeySlide.titleTa}</h2>
                <img
                  className={styles.journeyImg}
                  src={journeySlide.imageSrc}
                  alt=""
                  decoding="async"
                />
                <p className={styles.journeyQuote}>{journeySlide.quoteTa}</p>
              </motion.article>
            </AnimatePresence>
            <p className={styles.progress}>
              {journeyIndex + 1} / {journeySlides.length}
            </p>
          </div>
        </div>
      ) : null}

      {phase === 'letter' ? (
        <motion.div
          className={styles.content}
          initial={fmReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easingSoft }}
        >
          <div className={styles.letterWrap}>
            <LoveLetterSection
              content={LOVE_LETTER_JULIE}
              tamilTypography
            />
          </div>
          <button
            type="button"
            className={styles.nextBtn}
            onClick={() => setPhase('finale')}
          >
            அடுத்து — இறுதி அதிசயம்
          </button>
        </motion.div>
      ) : null}

      {phase === 'finale' ? (
        <motion.div
          className={`${styles.content} ${styles.finale}`}
          initial={fmReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easingSoft }}
        >
          <p className={styles.finaleFloral} aria-hidden>
            ✦
          </p>
          <h2 className={styles.finaleTitle}>நம்முடைய காதல் கதை — சுருக்கமாக</h2>
          <div className={styles.finaleBody}>
            {LOVE_STORY_FINALE_TA.map((para) => (
              <p key={para.slice(0, 48)} className={styles.finaleP}>
                {para}
              </p>
            ))}
          </div>
          <p className={styles.finaleSign}>
            பிறந்தநாள் வாழ்த்துகள், ஜூலி — என் Koiyanganni ❤️
          </p>
        </motion.div>
      ) : null}
    </div>
  )
}
