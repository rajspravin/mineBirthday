/**
 * All images under `public/assets/images/` are picked up at dev/build time
 * (see `plugins/mediaCatalogPlugin.ts`). Sorted by date in the filename when
 * possible (e.g. `IMG_20221017_150717.jpg` → 2022-10-17).
 */
export type { CatalogImage as GalleryImage } from './mediaCatalogTypes'
export { CATALOG_IMAGES as GALLERY_IMAGES } from 'virtual:media-catalog'
