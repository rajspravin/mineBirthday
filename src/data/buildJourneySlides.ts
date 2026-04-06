import type { CatalogImage } from './mediaCatalogTypes'
import { getJourneyCopyForYear } from './journeyYearCopy'

export type BuiltJourneySlide = {
  id: string
  year: number
  dateIso: string
  dateLabel: string
  imageSrc: string
  titleTa: string
  quoteTa: string
}

/** One slide per calendar year that appears in the catalog, earliest photo per year. */
export function buildJourneySlidesFromImages(
  images: CatalogImage[],
): BuiltJourneySlide[] {
  if (images.length === 0) return []

  const noDate = images.filter((i) => i.dateIso.startsWith('9999'))
  const dated = images.filter((i) => !i.dateIso.startsWith('9999'))

  const byYear = new Map<number, CatalogImage[]>()

  for (const img of dated) {
    const y = Number(img.dateIso.slice(0, 4))
    if (!Number.isFinite(y)) continue
    const list = byYear.get(y) ?? []
    list.push(img)
    byYear.set(y, list)
  }

  for (const img of noDate) {
    const y = 9999
    const list = byYear.get(y) ?? []
    list.push(img)
    byYear.set(y, list)
  }

  const years = [...byYear.keys()].sort((a, b) => a - b)

  return years.map((year) => {
    const list = byYear.get(year)!
    list.sort((a, b) => a.dateIso.localeCompare(b.dateIso))
    const pick = list[0]!
    const copy =
      year === 9999
        ? {
            titleTa: 'நினைவுகளின் தொகுப்பு',
            quoteTa:
              'தேதி பதிவு இல்லாத புகைப்படங்களும் எங்கள் கதையின் ஒரு பகுதி — ஒவ்வொன்றும் ஒரு கதை சொல்லும்.',
          }
        : getJourneyCopyForYear(year)

    return {
      id: String(year),
      year,
      dateIso: pick.dateIso,
      dateLabel:
        year === 9999
          ? pick.dateLabel
          : String(year),
      imageSrc: pick.src,
      titleTa: copy.titleTa,
      quoteTa: copy.quoteTa,
    }
  })
}
