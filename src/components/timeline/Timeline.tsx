import { useMemo } from 'react'
import {
  TIMELINE_INTRO,
  TIMELINE_MOMENTS,
  type TimelineMoment,
} from '../../data/timeline'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import styles from './Timeline.module.css'

type TimelineProps = {
  intro?: typeof TIMELINE_INTRO
  moments?: TimelineMoment[]
}

function TimelineItem({
  moment,
  reduced,
}: {
  moment: TimelineMoment
  reduced: boolean
}) {
  const { ref, visible } = useRevealOnScroll<HTMLLIElement>({ disabled: reduced })
  const shown = reduced || visible

  return (
    <li ref={ref} className={styles.item}>
      <div className={`${styles.reveal} ${shown ? styles.revealVisible : ''}`}>
        <div className={styles.row}>
          <div className={styles.marker} aria-hidden>
            <span className={styles.dot} />
          </div>
          <article className={styles.card}>
            <time className={styles.time} dateTime={moment.dateIso}>
              {moment.dateLabel}
            </time>
            <h3 className={styles.cardTitle}>{moment.title}</h3>
            <p className={styles.cardText}>{moment.text}</p>
          </article>
        </div>
      </div>
    </li>
  )
}

export function Timeline({
  intro = TIMELINE_INTRO,
  moments = TIMELINE_MOMENTS,
}: TimelineProps) {
  const reduced = usePrefersReducedMotion()
  const ordered = useMemo(
    () => [...moments].sort((a, b) => a.dateIso.localeCompare(b.dateIso)),
    [moments],
  )

  return (
    <section className={styles.section} aria-label={intro.title}>
      <header className={styles.intro}>
        <h2 className={styles.introTitle}>{intro.title}</h2>
        <p className={styles.introRange}>{intro.range}</p>
        <p className={styles.introSub}>{intro.subtitle}</p>
      </header>

      <ol className={styles.list}>
        {ordered.map((moment) => (
          <TimelineItem key={moment.id} moment={moment} reduced={reduced} />
        ))}
      </ol>
    </section>
  )
}
