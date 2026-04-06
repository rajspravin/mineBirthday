import { useContext } from 'react'
import {
  MusicPlaybackContext,
  type MusicPlaybackContextValue,
} from '../context/musicPlaybackContext'

export function useMusicPlayback(): MusicPlaybackContextValue {
  const ctx = useContext(MusicPlaybackContext)
  if (!ctx) {
    throw new Error(
      'useMusicPlayback must be used within MusicPlaybackProvider',
    )
  }
  return ctx
}
