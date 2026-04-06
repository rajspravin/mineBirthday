/**
 * Background music is served from `public/assets/music/` so the URL is stable
 * and the file is not bundled (good for larger MP3s).
 * Add your track as `public/assets/music/<filename>`.
 */
export const BACKGROUND_MUSIC_FILE = 'background.mp3'

export const BACKGROUND_MUSIC_SRC = `/assets/music/${BACKGROUND_MUSIC_FILE}`
