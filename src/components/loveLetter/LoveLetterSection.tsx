import type { ReactNode } from 'react'
import { LOVE_LETTER } from '../../data/loveLetter'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import styles from './LoveLetterSection.module.css'

type RevealProps = {
  children: ReactNode
  className?: string
  disabled?: boolean
}

function Reveal({ children, className, disabled = false }: RevealProps) {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>({ disabled })
  const shown = disabled || visible

  return (
    <div
      ref={ref}
      className={`${styles.revealWrap} ${shown ? styles.revealWrapVisible : ''} ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

type LoveLetterSectionProps = {
  content?: typeof LOVE_LETTER
}

export function LoveLetterSection({ content = LOVE_LETTER }: LoveLetterSectionProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <section className={styles.section} aria-label="Love letter">
      <div className={styles.card}>
        <div className={styles.inner}>
          <Reveal disabled={reduced}>
            <p className={styles.floral} aria-hidden>
              ✦
            </p>
          </Reveal>

          <Reveal disabled={reduced}>
            <p className={styles.eyebrow}>{content.eyebrow}</p>
          </Reveal>

          <Reveal disabled={reduced}>
            <h2 className={styles.title}>{content.title}</h2>
          </Reveal>

          <div className={styles.bodyStack}>
            {content.paragraphs.map((paragraph, index) => (
              <Reveal
                key={`${index}-${paragraph.slice(0, 48)}`}
                disabled={reduced}
              >
                <p className={styles.body}>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal disabled={reduced}>
            <p className={styles.divider} aria-hidden>
              ···
            </p>
          </Reveal>

          <Reveal disabled={reduced}>
            <p className={styles.closing}>{content.closing}</p>
          </Reveal>

          <Reveal disabled={reduced}>
            <p className={styles.signature}>{content.signature}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
