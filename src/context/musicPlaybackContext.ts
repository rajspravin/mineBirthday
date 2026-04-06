import { createContext } from 'react'

export type MusicPlaybackContextValue = {
  /** Call from a click/tap handler so `play()` satisfies browser autoplay rules. */
  beginPlaybackFromUserGesture: () => void
  togglePlayback: () => void
  isPlaying: boolean
  /** True after Tap to Start (or any explicit start attempt). */
  hasAttemptedStart: boolean
}

export const MusicPlaybackContext =
  createContext<MusicPlaybackContextValue | null>(null)
