/** Shared easing — soft deceleration, reads “gentle” on mobile */
export const easingSoft = [0.22, 1, 0.36, 1] as const

/** Default in-app page cross-fade — soft lift, scale, tiny tilt */
export const pageVariants = {
  initial: { opacity: 0, y: 36, scale: 0.93, rotate: -0.6 },
  animate: { opacity: 1, y: 0, scale: 1, rotate: 0 },
  exit: { opacity: 0, y: -28, scale: 0.97, rotate: 0.35 },
} as const

export function transitionPage(reducedMotion: boolean) {
  return {
    duration: reducedMotion ? 0 : 0.64,
    ease: easingSoft,
  }
}

export function transitionStagger(reducedMotion: boolean, stagger: number) {
  return {
    staggerChildren: reducedMotion ? 0 : stagger,
    delayChildren: reducedMotion ? 0 : 0.06,
  }
}
