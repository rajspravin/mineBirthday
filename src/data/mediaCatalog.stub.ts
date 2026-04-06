/**
 * TypeScript uses this file for `virtual:media-catalog` during `tsc`.
 * Vite replaces it at dev/build with a scan of `public/assets/images` and `videos`.
 */
import type { CatalogImage, CatalogVideo } from './mediaCatalogTypes'

export const CATALOG_IMAGES: CatalogImage[] = []
export const CATALOG_VIDEOS: CatalogVideo[] = []
