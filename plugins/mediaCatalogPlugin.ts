import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:media-catalog'
const RESOLVED = '\0' + VIRTUAL_ID

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp)$/i
const VIDEO_EXT = /\.(mp4|webm|mov|m4v|mkv)$/i

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

function parseYmdFromFilename(name: string): {
  y: number
  m: number
  d: number
} | null {
  const base = path.basename(name, path.extname(name))
  const m1 = base.match(
    /^(?:IMG|VID|MVIMG|PXL|WP|DSC|JPEG)_(\d{4})(\d{2})(\d{2})/i,
  )
  if (m1) {
    const y = Number(m1[1])
    const mo = Number(m1[2])
    const d = Number(m1[3])
    if (y >= 1990 && y <= 2100 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31)
      return { y, m: mo, d }
  }
  const m2 = base.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (m2) {
    const y = Number(m2[1])
    const mo = Number(m2[2])
    const d = Number(m2[3])
    if (y >= 1990 && y <= 2100 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31)
      return { y, m: mo, d }
  }
  return null
}

function toIso(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function formatLabel(y: number, m: number, d: number): string {
  return `${d} ${MONTHS[m - 1]} ${y}`
}

function listSortedImages(imagesDir: string) {
  if (!fs.existsSync(imagesDir)) return []

  const names = fs.readdirSync(imagesDir).filter((n) => IMAGE_EXT.test(n))

  type Row = {
    name: string
    sortKey: string
        dateIso: string
        dateLabel: string
      }

  const rows: Row[] = names.map((name) => {
    const ymd = parseYmdFromFilename(name)
    if (ymd) {
      const dateIso = toIso(ymd.y, ymd.m, ymd.d)
      return {
        name,
        sortKey: dateIso + name,
        dateIso,
        dateLabel: formatLabel(ymd.y, ymd.m, ymd.d),
      }
    }
    return {
      name,
      sortKey: `9999-12-31-${name}`,
      dateIso: '9999-12-31',
      dateLabel: name,
    }
  })

  rows.sort((a, b) => a.sortKey.localeCompare(b.sortKey))

  return rows.map((r) => ({
    src: `/assets/images/${r.name}`,
    alt: r.dateLabel !== r.name ? `நினைவு — ${r.dateLabel}` : r.name,
    dateIso: r.dateIso,
    dateLabel: r.dateLabel,
  }))
}

function listSortedVideos(videosDir: string) {
  if (!fs.existsSync(videosDir)) return []

  const names = fs.readdirSync(videosDir).filter((n) => VIDEO_EXT.test(n))

  type Row = { name: string; sortKey: string; title: string }

  const rows: Row[] = names.map((name) => {
    const ymd = parseYmdFromFilename(name)
    const sortKey = ymd
      ? toIso(ymd.y, ymd.m, ymd.d) + name
      : `9999-12-31-${name}`
    const title = ymd
      ? `தருணம் — ${formatLabel(ymd.y, ymd.m, ymd.d)}`
      : path.basename(name, path.extname(name))
    return { name, sortKey, title }
  })

  rows.sort((a, b) => a.sortKey.localeCompare(b.sortKey))

  return rows.map((r) => ({
    src: `/assets/videos/${r.name}`,
    title: r.title,
  }))
}

function generateModule(root: string): string {
  const imagesDir = path.join(root, 'public', 'assets', 'images')
  const videosDir = path.join(root, 'public', 'assets', 'videos')

  const images = listSortedImages(imagesDir)
  const videos = listSortedVideos(videosDir)

  return `export const CATALOG_IMAGES = ${JSON.stringify(images, null, 0)};
export const CATALOG_VIDEOS = ${JSON.stringify(videos, null, 0)};
`
}

export function mediaCatalogPlugin(): Plugin {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const projectRoot = path.join(__dirname, '..')

  return {
    name: 'media-catalog',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED
    },
    load(id) {
      if (id !== RESOLVED) return null
      return generateModule(projectRoot)
    },
    configureServer(server) {
      server.watcher.add(path.join(projectRoot, 'public', 'assets', 'images'))
      server.watcher.add(path.join(projectRoot, 'public', 'assets', 'videos'))
    },
  }
}
