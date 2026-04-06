export type FinaleMedia =
  | { type: 'none' }
  | {
      type: 'image'
      /** e.g. `/assets/images/finale.jpg` in `public/` */
      src: string
      alt: string
    }
  | {
      type: 'video'
      src: string
      poster?: string
      description: string
    }

export const FINALE_CONFIG = {
  /** Main line — keep it short for mobile */
  headline: 'I love you',
  /** Shown after the headline (e.g. heart emoji) */
  headlineAccent: '❤️',
  /** Softer line beneath */
  subline:
    'Happy birthday, my love. Thank you for every day of our journey — I choose you, today and always.',
  /** One celebratory burst when the screen comes into view */
  confetti: true,
  /**
   * Optional hero media. Set `type: 'none'` until you add files under `public/`.
   */
  media: {
    type: 'none',
  } as FinaleMedia,
  // Example once you add assets:
  // media: { type: 'image', src: '/assets/images/finale.jpg', alt: 'Us' },
  // media: { type: 'video', src: '/assets/videos/finale.mp4', poster: '/assets/images/finale-poster.jpg', description: 'One more surprise' },
}
