import { X, Check } from 'lucide-react'
import type { Hotspot } from '../data/hotspots'

const fmt = (n: number) => '$' + n.toLocaleString('en-US')

export default function InfoPanel({ hotspot, onClose }: { hotspot: Hotspot; onClose: () => void }) {
  const Icon = hotspot.icon
  return (
    <aside
      role="dialog"
      aria-label={`${hotspot.label} — repair details`}
      className="panel-in fixed z-[90] left-3 right-3 bottom-3 max-h-[64vh] sm:left-auto sm:right-5 sm:top-24 sm:bottom-auto sm:w-[368px] sm:max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-2xl border border-black/10 bg-white/95 backdrop-blur-xl p-6 text-slate-900 shadow-2xl"
    >
      <button
        onClick={onClose}
        aria-label="Close details"
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors"
      >
        <X size={20} />
      </button>

      <p className="text-[11px] tracking-[0.22em] uppercase text-brand font-semibold mb-3">Restored element</p>

      <div className="flex items-center gap-3 mb-5">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/12 text-brand">
          <Icon size={20} />
        </span>
        <h3 className="text-2xl font-playfair text-slate-900">{hotspot.label}</h3>
      </div>

      <div className="mb-5">
        <span className="inline-block text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-[#c2452d]/12 text-[#b53d27] font-semibold mb-2">Before</span>
        <p className="text-sm text-slate-600 leading-relaxed">{hotspot.before}</p>
      </div>

      <div className="mb-6">
        <span className="inline-block text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-[#1f9e74]/12 text-[#1f8f69] font-semibold mb-3">What we did</span>
        <ul className="flex flex-col gap-2.5">
          {hotspot.work.map((w) => (
            <li key={w} className="flex items-start gap-2.5 text-sm text-slate-800">
              <Check size={17} className="mt-0.5 shrink-0 text-[#1f9e74]" strokeWidth={2.6} />
              {w}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-baseline justify-between border-t border-black/10 pt-4">
        <span className="text-xs text-slate-500">Cost of this repair</span>
        <strong className="font-playfair text-2xl text-[#1f8f69]">{fmt(hotspot.cost)}</strong>
      </div>
    </aside>
  )
}
