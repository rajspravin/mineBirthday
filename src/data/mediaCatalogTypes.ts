/** Emitted by the `virtual:media-catalog` Vite plugin from files in `public/assets/`. */

export type CatalogImage = {
  src: string
  alt: string
  /** ISO `YYYY-MM-DD` from filename when parseable */
  dateIso: string
  /** Human label e.g. `17 Oct 2022` */
  dateLabel: string
}

export type CatalogVideo = {
  src: string
  title: string
  description?: string
  poster?: string
}
