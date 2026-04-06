import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  BACKGROUND_MUSIC_SRC,
  INTRO_INSTRUMENTAL_SRC,
  SLIDESHOW_MUSIC_SRC,
} from '../data/media'
import { MusicPlaybackContext } from './musicPlaybackContext'

export function MusicPlaybackProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const introAudioRef = useRef<HTMLAudioElement | null>(null)
  const slideshowAudioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasAttemptedStart, setHasAttemptedStart] = useState(false)
  const musicInteractionGateRef = useRef<'videos' | null>(null)

  const setMusicInteractionGate = useCallback((gate: 'videos' | null) => {
    musicInteractionGateRef.current = gate
  }, [])

  const syncPlaying = useCallback(() => {
    const bg = audioRef.current
    const intro = introAudioRef.current
    const slide = slideshowAudioRef.current
    setIsPlaying(
      Boolean(
        (bg && !bg.paused) ||
          (intro && !intro.paused) ||
          (slide && !slide.paused),
      ),
    )
  }, [])

  const stopIntroInstrumental = useCallback(() => {
    const el = introAudioRef.current
    if (el) {
      el.pause()
      el.src = ''
      introAudioRef.current = null
      syncPlaying()
    }
  }, [syncPlaying])

  const ensureIntroAudio = useCallback(() => {
    if (!introAudioRef.current) {
      const el = new Audio(INTRO_INSTRUMENTAL_SRC)
      el.loop = true
      el.preload = 'auto'
      el.addEventListener('play', syncPlaying)
      el.addEventListener('pause', syncPlaying)
      el.addEventListener('ended', syncPlaying)
      introAudioRef.current = el
    }
    return introAudioRef.current
  }, [syncPlaying])

  const startIntroInstrumental = useCallback(() => {
    const el = ensureIntroAudio()
    void el.play().catch(() => {})
  }, [ensureIntroAudio])

  const stopSlideshowMusic = useCallback(() => {
    const el = slideshowAudioRef.current
    if (el) {
      el.pause()
      el.src = ''
      slideshowAudioRef.current = null
      syncPlaying()
    }
  }, [syncPlaying])

  const ensureSlideshowAudio = useCallback(() => {
    if (!slideshowAudioRef.current) {
      const el = new Audio(SLIDESHOW_MUSIC_SRC)
      el.loop = true
      el.preload = 'auto'
      el.addEventListener('play', syncPlaying)
      el.addEventListener('pause', syncPlaying)
      el.addEventListener('ended', syncPlaying)
      slideshowAudioRef.current = el
    }
    return slideshowAudioRef.current
  }, [syncPlaying])

  const startSlideshowMusic = useCallback(() => {
    const bg = audioRef.current
    if (bg && !bg.paused) bg.pause()
    stopIntroInstrumental()
    const el = ensureSlideshowAudio()
    void el.play().catch(() => {})
  }, [ensureSlideshowAudio, stopIntroInstrumental])

  const resumeBackgroundIfReady = useCallback(() => {
    if (!hasAttemptedStart) return
    const a = audioRef.current
    if (!a) return
    void a.play().catch(() => setIsPlaying(false))
  }, [hasAttemptedStart])

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const el = new Audio(BACKGROUND_MUSIC_SRC)
      el.loop = true
      el.preload = 'auto'
      el.addEventListener('play', syncPlaying)
      el.addEventListener('pause', syncPlaying)
      el.addEventListener('ended', syncPlaying)
      audioRef.current = el
    }
    return audioRef.current
  }, [syncPlaying])

  const ensureMusicForHomeView = useCallback(() => {
    if (slideshowAudioRef.current) {
      stopSlideshowMusic()
    }
    if (hasAttemptedStart) {
      const a = ensureAudio()
      if (!a.paused) return
      void a.play().catch(() => setIsPlaying(false))
      return
    }
    const intro = introAudioRef.current
    if (intro && !intro.paused) return
    startIntroInstrumental()
  }, [
    hasAttemptedStart,
    ensureAudio,
    stopSlideshowMusic,
    startIntroInstrumental,
  ])

  const beginPlaybackFromUserGesture = useCallback(() => {
    stopIntroInstrumental()
    stopSlideshowMusic()
    const audio = ensureAudio()
    setHasAttemptedStart(true)
    if (!audio.paused) return
    void audio.play().catch(() => {
      setIsPlaying(false)
    })
  }, [ensureAudio, stopIntroInstrumental, stopSlideshowMusic])

  const togglePlayback = useCallback(() => {
    if (musicInteractionGateRef.current === 'videos') return
    const slide = slideshowAudioRef.current
    if (slide) {
      if (slide.paused) {
        void slide.play().catch(() => setIsPlaying(false))
      } else {
        slide.pause()
      }
      return
    }
    if (!hasAttemptedStart) {
      const intro = introAudioRef.current
      if (intro) {
        if (intro.paused) {
          void intro.play().catch(() => setIsPlaying(false))
        } else {
          intro.pause()
        }
        return
      }
    }
    const audio = ensureAudio()
    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [ensureAudio, hasAttemptedStart])

  useEffect(() => {
    return () => {
      stopIntroInstrumental()
      stopSlideshowMusic()
      const el = audioRef.current
      if (el) {
        el.pause()
        el.src = ''
        audioRef.current = null
      }
    }
  }, [stopIntroInstrumental, stopSlideshowMusic])

  const value = useMemo(
    () => ({
      startIntroInstrumental,
      stopIntroInstrumental,
      startSlideshowMusic,
      stopSlideshowMusic,
      beginPlaybackFromUserGesture,
      togglePlayback,
      isPlaying,
      hasAttemptedStart,
      setMusicInteractionGate,
      resumeBackgroundIfReady,
      ensureMusicForHomeView,
    }),
    [
      startIntroInstrumental,
      stopIntroInstrumental,
      startSlideshowMusic,
      stopSlideshowMusic,
      beginPlaybackFromUserGesture,
      togglePlayback,
      isPlaying,
      hasAttemptedStart,
      setMusicInteractionGate,
      resumeBackgroundIfReady,
      ensureMusicForHomeView,
    ],
  )

  return (
    <MusicPlaybackContext.Provider value={value}>
      {children}
    </MusicPlaybackContext.Provider>
  )
}
