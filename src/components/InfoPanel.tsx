import { X, Check } from 'lucide-react'
import type { Hotspot } from '../data/hotspots'

const fmt = (n: number) => '$' + n.toLocaleString('en-US')

export default function InfoPanel({ hotspot, onClose }: { hotspot: Hotspot; onClose: () => void }) {
  const Icon = hotspot.icon
  return (
    <aside
      role="dialog"
      aria-label={`${hotspot.label} — repair details`}
      className="panel-in fixed z-[90] inset-x-0 bottom-0 max-h-[78vh] rounded-t-3xl
                 sm:inset-x-auto sm:left-auto sm:right-5 sm:top-20 sm:bottom-auto sm:w-[380px]
                 sm:max-h-[calc(100dvh-6rem)] sm:rounded-2xl
                 flex flex-col overflow-hidden border border-white/40 bg-white/35 backdrop-blur-2xl backdrop-saturate-150
                 text-slate-900 shadow-[0_10px_60px_rgba(0,0,0,0.5)]"
    >
      {/* liquid-glass top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/40 to-transparent" />
      {/* mobile grab handle */}
      <div className="sm:hidden absolute top-2.5 left-1/2 -translate-x-1/2 h-1.5 w-12 rounded-full bg-slate-900/20" />
      {/* big close */}
      <button
        onClick={onClose}
        aria-label="Close details"
        className="absolute top-3.5 right-3.5 z-10 grid place-items-center w-10 h-10 rounded-full bg-slate-900/5 hover:bg-slate-900/12 text-slate-700 transition-colors"
      >
        <X size={22} strokeWidth={2.2} />
      </button>

      <div className="relative overflow-y-auto px-6 pt-9 pb-7 sm:pt-6">
        <p className="text-[11px] tracking-[0.22em] uppercase text-brand font-semibold mb-3">Restored element</p>

        <div className="flex items-center gap-3 mb-5 pr-10">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/15 text-brand shrink-0">
            <Icon size={20} />
          </span>
          <h3 className="text-2xl font-playfair text-slate-900">{hotspot.label}</h3>
        </div>

        <div className="mb-5">
          <span className="inline-block text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-[#c2452d]/15 text-[#a83c28] font-semibold mb-2">Before</span>
          <p className="text-[15px] text-slate-700 leading-relaxed">{hotspot.before}</p>
        </div>

        <div className="mb-6">
          <span className="inline-block text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-[#1f8f69]/15 text-[#177a59] font-semibold mb-3">What we did</span>
          <ul className="flex flex-col gap-2.5">
            {hotspot.work.map((w) => (
              <li key={w} className="flex items-start gap-2.5 text-[15px] text-slate-800">
                <Check size={17} className="mt-1 shrink-0 text-[#1f8f69]" strokeWidth={2.6} />
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-baseline justify-between border-t border-slate-900/10 pt-4">
          <span className="text-xs text-slate-500">Cost of this repair</span>
          <strong className="font-playfair text-2xl text-[#177a59]">{fmt(hotspot.cost)}</strong>
        </div>
      </div>
    </aside>
  )
}
