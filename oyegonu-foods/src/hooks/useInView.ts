import { useEffect, useState, type RefObject } from 'react'

/** True while the element is (nearly) on screen — used to pause WebGL render loops. */
export function useInView(ref: RefObject<Element | null>, rootMargin = '120px') {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}
