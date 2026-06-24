import { useEffect, useRef, useState } from 'react'

export default function Counter({
  to, prefix = '', suffix = '', dur = 1500,
}: { to: number; prefix?: string; suffix?: string; dur?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [v, setV] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting || done.current) return
          done.current = true
          if (reduced) { setV(to); return }
          let start: number | null = null
          const step = (t: number) => {
            if (start === null) start = t
            const p = Math.min((t - start) / dur, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setV(Math.round(to * eased))
            if (p < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }),
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to, dur])

  return <span ref={ref}>{prefix}{v.toLocaleString('en-US')}{suffix}</span>
}
