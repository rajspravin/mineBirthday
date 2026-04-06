import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { BACKGROUND_MUSIC_SRC } from '../data/media'
import { MusicPlaybackContext } from './musicPlaybackContext'

export function MusicPlaybackProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasAttemptedStart, setHasAttemptedStart] = useState(false)

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const el = new Audio(BACKGROUND_MUSIC_SRC)
      el.loop = true
      el.preload = 'auto'
      const syncPlaying = () => setIsPlaying(!el.paused)
      el.addEventListener('play', syncPlaying)
      el.addEventListener('pause', syncPlaying)
      el.addEventListener('ended', syncPlaying)
      audioRef.current = el
    }
    return audioRef.current
  }, [])

  const beginPlaybackFromUserGesture = useCallback(() => {
    const audio = ensureAudio()
    setHasAttemptedStart(true)
    if (!audio.paused) return
    void audio.play().catch(() => {
      setIsPlaying(false)
    })
  }, [ensureAudio])

  const togglePlayback = useCallback(() => {
    const audio = ensureAudio()
    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [ensureAudio])

  useEffect(() => {
    return () => {
      const el = audioRef.current
      if (el) {
        el.pause()
        el.src = ''
        audioRef.current = null
      }
    }
  }, [])

  const value = useMemo(
    () => ({
      beginPlaybackFromUserGesture,
      togglePlayback,
      isPlaying,
      hasAttemptedStart,
    }),
    [
      beginPlaybackFromUserGesture,
      togglePlayback,
      isPlaying,
      hasAttemptedStart,
    ],
  )

  return (
    <MusicPlaybackContext.Provider value={value}>
      {children}
    </MusicPlaybackContext.Provider>
  )
}
