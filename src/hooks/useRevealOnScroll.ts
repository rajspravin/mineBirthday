import { useEffect, useRef, useState } from 'react'

type UseRevealOnScrollOptions = {
  /** Skip observing and treat content as visible (e.g. reduced motion). */
  disabled?: boolean
  rootMargin?: string
  threshold?: number
}

/**
 * Sets `visible` to true once the element intersects the viewport (one-shot).
 */
export function useRevealOnScroll<T extends Element>(
  options: UseRevealOnScrollOptions = {},
) {
  const {
    disabled = false,
    rootMargin = '0px 0px -8% 0px',
    threshold = 0.14,
  } = options

  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(disabled)

  useEffect(() => {
    if (disabled) return

    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting)
        if (hit) {
          setVisible(true)
          io.unobserve(el)
        }
      },
      { rootMargin, threshold },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [disabled, rootMargin, threshold])

  return { ref, visible }
}
