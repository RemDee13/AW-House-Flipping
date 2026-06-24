import { X, Check } from 'lucide-react'
import type { Hotspot } from '../data/hotspots'

const fmt = (n: number) => '$' + n.toLocaleString('en-US')

export default function InfoPanel({ hotspot, onClose }: { hotspot: Hotspot; onClose: () => void }) {
  const Icon = hotspot.icon
  return (
    <aside
      role="dialog"
      aria-label={`${hotspot.label} — repair details`}
      className="panel-in fixed z-[90] left-3 right-3 bottom-3 max-h-[64vh] sm:left-auto sm:right-5 sm:top-24 sm:bottom-auto sm:w-[368px] sm:max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-2xl border border-white/15 bg-black/72 backdrop-blur-xl p-6 text-white shadow-2xl"
    >
      <button
        onClick={onClose}
        aria-label="Close details"
        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      <p className="text-[11px] tracking-[0.22em] uppercase text-brand font-medium mb-3">Restored element</p>

      <div className="flex items-center gap-3 mb-5">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/15 text-brand">
          <Icon size={20} />
        </span>
        <h3 className="text-2xl font-playfair">{hotspot.label}</h3>
      </div>

      <div className="mb-5">
        <span className="inline-block text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-[#c2452d]/20 text-[#e98c78] mb-2">Before</span>
        <p className="text-sm text-white/70 leading-relaxed">{hotspot.before}</p>
      </div>

      <div className="mb-6">
        <span className="inline-block text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-[#3fb68b]/20 text-[#3fb68b] mb-3">What we did</span>
        <ul className="flex flex-col gap-2.5">
          {hotspot.work.map((w) => (
            <li key={w} className="flex items-start gap-2.5 text-sm text-white/85">
              <Check size={17} className="mt-0.5 shrink-0 text-[#3fb68b]" strokeWidth={2.6} />
              {w}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
        <span className="text-xs text-white/55">Cost of this repair</span>
        <strong className="font-playfair text-2xl text-[#3fb68b]">{fmt(hotspot.cost)}</strong>
      </div>
    </aside>
  )
}
