export type GalleryImage = {
  /** Path under site root, e.g. `/assets/images/photo.jpg` (file in `public/assets/images/`) */
  src: string
  alt: string
}

/**
 * List your photos here after adding files to `public/assets/images/`.
 * Keep the list explicit so Vite can ship without bundling large binaries.
 */
export const GALLERY_IMAGES: GalleryImage[] = [
  { src: '/assets/images/1.jpg', alt: 'A moment together' },  
  { src: '/assets/images/2.jpg', alt: 'A moment together' },
  { src: '/assets/images/3.jpg', alt: 'A moment together' },
  { src: '/assets/images/4.jpg', alt: 'A moment together' },
  { src: '/assets/images/5.jpg', alt: 'A moment together' },
  { src: '/assets/images/6.jpg', alt: 'A moment together' },

]
