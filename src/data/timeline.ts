export type TimelineMoment = {
  id: string
  /** For sorting / `datetime` — ISO `YYYY-MM-DD` */
  dateIso: string
  /** Shown on the card (keep short on mobile) */
  dateLabel: string
  title: string
  text: string
}

/** Edit moments to match your real story. Dates span Jun 2021 → Apr 2026 (~5 years). */
export const TIMELINE_INTRO = {
  title: 'Our journey',
  range: '21 Jun 2021 — Apr 2026',
  subtitle: 'Almost five years of us — and counting.',
}

export const TIMELINE_MOMENTS: TimelineMoment[] = [
  {
    id: 'start',
    dateIso: '2021-06-21',
    dateLabel: '21 Jun 2021',
    title: 'Where it began',
    text: 'The summer day our story started — soft light, nervous smiles, and the quiet feeling that something important had changed.',
  },
  {
    id: 'y1',
    dateIso: '2022-06-21',
    dateLabel: 'Jun 2022',
    title: 'Learning your world',
    text: 'Figuring out each other’s rhythms: the jokes only we find funny, the comfort of ordinary Tuesdays, the way love stopped feeling like a word and started feeling like home.',
  },
  {
    id: 'y2',
    dateIso: '2023-06-21',
    dateLabel: '2023',
    title: 'Deeper roots',
    text: 'Hard days and gentle ones — choosing each other again and again until “us” felt less like luck and more like intention.',
  },
  {
    id: 'y3',
    dateIso: '2024-06-21',
    dateLabel: '2024',
    title: 'Steady hands',
    text: 'The year life asked more of us. We held on anyway — not perfectly, but honestly — and I’m grateful for every mile we walked side by side.',
  },
  {
    id: 'y4',
    dateIso: '2025-06-21',
    dateLabel: '2025',
    title: 'Still my favorite plot twist',
    text: 'Closer than we were at the start, softer in the best places, braver where it counts. You’re still the chapter I reread.',
  },
  {
    id: 'now',
    dateIso: '2026-04-06',
    dateLabel: 'Apr 2026',
    title: 'Almost five years',
    text: 'From that first June to this month — nearly half a decade of you. If the next years are anything like these, I’m already grateful for them.',
  },
]
