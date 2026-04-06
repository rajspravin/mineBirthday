import { createContext } from 'react'

export type MusicPlaybackContextValue = {
  /** Plays the intro instrumental (landing → home until a section is opened). */
  startIntroInstrumental: () => void
  /** Stops intro only (e.g. starting the guided flow without slideshow music). */
  stopIntroInstrumental: () => void
  /**
   * Stops intro and plays slideshow music (photo reel). Call from a user gesture.
   * Stopped automatically when `stopSlideshowMusic` runs or main playback begins.
   */
  startSlideshowMusic: () => void
  stopSlideshowMusic: () => void
  /** Call from a click/tap handler so `play()` satisfies browser autoplay rules. */
  beginPlaybackFromUserGesture: () => void
  togglePlayback: () => void
  isPlaying: boolean
  /** True after main background music has been started (e.g. first home section). */
  hasAttemptedStart: boolean
  /**
   * During guided video playback, suppress the header music toggle so it does not
   * start background MP3 over the clips.
   */
  setMusicInteractionGate: (gate: 'videos' | null) => void
  /** After leaving the photo gallery: resume `background.mp3` if it was started earlier. */
  resumeBackgroundIfReady: () => void
  /**
   * When `/home` is shown again: play intro (if session not started) or resume
   * main background if it was paused; stops stray slideshow audio.
   */
  ensureMusicForHomeView: () => void
}

export const MusicPlaybackContext =
  createContext<MusicPlaybackContextValue | null>(null)
