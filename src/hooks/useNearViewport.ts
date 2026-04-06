import { useEffect, useState, type RefObject } from 'react'

/**
 * Flips to `true` once the element is near the viewport (IntersectionObserver).
 * Use to defer loading heavy media like video until the user scrolls close.
 */
export function useNearViewport<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = '180px',
) {
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || near) return

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting)
        if (hit) setNear(true)
      },
      { rootMargin, threshold: 0.01 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [ref, near, rootMargin])

  return near
}
