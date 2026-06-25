import { useEffect, useRef, useState } from 'react'

const BASE = import.meta.env.BASE_URL
// the two hero assets we wait for — the renovated photo and the storm-house video
const ASSETS = [`${BASE}new.jpg`, `${BASE}old.mp4`]

/**
 * Premium loading screen. Streams the hero photo + video and reports real byte
 * progress (each asset weighted equally), so the site never opens before they're
 * cached. No timer — it leaves as soon as both finish. Fails open if a fetch errors.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const targetRef = useRef(0) // real load fraction 0..1
  const shownRef = useRef(0) // animated, lerped toward target
  const finishedRef = useRef(false)

  // stream both assets, accumulate per-asset fractions
  useEffect(() => {
    let cancelled = false
    const fracs = new Array(ASSETS.length).fill(0)
    const recompute = () => {
      targetRef.current = fracs.reduce((a, b) => a + b, 0) / fracs.length
    }

    ASSETS.forEach(async (url, i) => {
      try {
        const res = await fetch(url)
        const len = Number(res.headers.get('Content-Length') || 0)
        if (res.body && len > 0) {
          const reader = res.body.getReader()
          let loaded = 0
          for (;;) {
            const { done, value } = await reader.read()
            if (done || cancelled) break
            loaded += value ? value.length : 0
            fracs[i] = Math.min(1, loaded / len)
            recompute()
          }
        } else {
          // no measurable stream — just wait for the body
          await res.blob()
        }
      } catch {
        // network/CORS error — don't trap the visitor on the loader
      } finally {
        fracs[i] = 1
        recompute()
      }
    })

    return () => { cancelled = true }
  }, [])

  // ease the displayed % toward the real target (gives a smooth sweep even when
  // assets are already cached); finish + fade once it lands on 100
  useEffect(() => {
    let raf = 0
    const tick = () => {
      shownRef.current += (targetRef.current - shownRef.current) * 0.08
      setPct(Math.round(shownRef.current * 100))
      if (!finishedRef.current && targetRef.current >= 1 && shownRef.current >= 0.99) {
        finishedRef.current = true
        setPct(100)
        setLeaving(true)
        window.setTimeout(onDone, 700) // after the fade-out
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[200] grid place-items-center bg-[#0b0b0c] transition-opacity duration-700 ${leaving ? 'opacity-0' : 'opacity-100'}`}
      aria-busy={!leaving}
      role="status"
      aria-label="Loading"
    >
      {/* soft brand glow behind the card */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: 'radial-gradient(60% 50% at 50% 42%, rgba(246,183,60,0.10), transparent 70%)' }}
      />

      <div className="relative flex flex-col items-center gap-8 px-8">
        {/* wordmark */}
        <div className="text-center">
          <p className="font-playfair italic text-3xl sm:text-4xl text-white drop-shadow">Ashwood Revival</p>
          <p className="mt-2.5 text-[10px] sm:text-[11px] tracking-[0.36em] uppercase text-white/45">Full-home restoration</p>
        </div>

        {/* spinner — gold arc over a faint ring */}
        <div className="relative w-14 h-14">
          <svg viewBox="0 0 50 50" className="w-full h-full animate-spin" style={{ animationDuration: '0.9s' }}>
            <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3" />
            <circle
              cx="25" cy="25" r="20" fill="none"
              stroke="#f6b73c" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="80 200"
            />
          </svg>
        </div>

        {/* progress bar + percentage */}
        <div className="w-56 sm:w-72">
          <div className="h-[3px] w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#f6b73c] to-[#e08a2b] transition-[width] duration-150 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase">
            <span className="text-white/40">Loading</span>
            <span className="tabular-nums text-white/75">{pct}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
