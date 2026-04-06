/** Shared easing — soft deceleration, reads “gentle” on mobile */
export const easingSoft = [0.22, 1, 0.36, 1] as const

export const pageVariants = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
} as const

export function transitionPage(reducedMotion: boolean) {
  return {
    duration: reducedMotion ? 0 : 0.5,
    ease: easingSoft,
  }
}

export function transitionStagger(reducedMotion: boolean, stagger: number) {
  return {
    staggerChildren: reducedMotion ? 0 : stagger,
    delayChildren: reducedMotion ? 0 : 0.06,
  }
}
