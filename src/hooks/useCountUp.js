import { useEffect, useRef, useState } from 'react'

/**
 * Smoothly animates a number from 0 → `end` once the element
 * scrolls into view. Used by the animated stats section.
 *
 * @param {number} end       target value
 * @param {number} duration  animation length in ms
 * @returns {[number, React.RefObject]} current value + ref to attach
 */
export default function useCountUp(end, duration = 1800) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true

        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          // easeOutCubic for a satisfying deceleration
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(Math.round(eased * end))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [end, duration])

  return [value, ref]
}
