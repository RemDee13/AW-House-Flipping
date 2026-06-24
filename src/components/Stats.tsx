import Counter from './Counter'

const STATS = [
  { to: 71350, prefix: '$', suffix: '', label: 'Invested in this flip' },
  { to: 14, prefix: '', suffix: ' wks', label: 'Start to sold' },
  { to: 11, prefix: '', suffix: '', label: 'Elements restored' },
  { to: 340, prefix: '$', suffix: 'K', label: 'After-repair value' },
]

export default function Stats() {
  return (
    <section className="border-y border-white/10 bg-[#0d0e11]">
      <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {STATS.map((s) => (
          <div key={s.label} className="reveal-up text-center">
            <div className="font-playfair text-4xl md:text-5xl text-brand">
              <Counter to={s.to} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-[11px] tracking-[0.16em] uppercase text-white/45">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
