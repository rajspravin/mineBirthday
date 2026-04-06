/**
 * All images under `public/assets/images/` are picked up at dev/build time
 * (see `plugins/mediaCatalogPlugin.ts`). Sorted by date in the filename when
 * possible (e.g. `IMG_20221017_150717.jpg` → 2022-10-17).
 */
import { CATALOG_IMAGES } from 'virtual:media-catalog'

export type { CatalogImage as GalleryImage } from './mediaCatalogTypes'
export { CATALOG_IMAGES as GALLERY_IMAGES }

/** Evenly spaced unique image URLs for decorative backgrounds (home, landing). */
export function pickAccentGallerySources(maxCount: number): string[] {
  const all = CATALOG_IMAGES
  if (all.length === 0 || maxCount <= 0) return []
  const cap = Math.min(maxCount, all.length)
  const out: string[] = []
  const seen = new Set<string>()
  const step = Math.max(1, Math.floor(all.length / cap))

  for (let i = 0; i < cap; i++) {
    const idx = Math.min(i * step, all.length - 1)
    const item = all[idx]
    if (item && !seen.has(item.src)) {
      seen.add(item.src)
      out.push(item.src)
    }
  }

  for (const item of all) {
    if (out.length >= cap) break
    if (!seen.has(item.src)) {
      seen.add(item.src)
      out.push(item.src)
    }
  }

  return out
}
