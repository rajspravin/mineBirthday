export type VideoClip = {
  /** Served from `public/assets/videos/` → `/assets/videos/...` */
  src: string
  title: string
  description?: string
  /** Optional poster in `public/` (e.g. `/assets/images/video-poster.jpg`) */
  poster?: string
}

/**
 * Add clips after placing files in `public/assets/videos/`.
 * Keep entries explicit so nothing heavy is bundled by Vite.
 */
export const VIDEO_CLIPS: VideoClip[] = [
  // {
  //   src: '/assets/videos/moment-01.mp4',
  //   title: 'A little moment',
  //   poster: '/assets/images/moment-01-poster.jpg',
  // },
]
