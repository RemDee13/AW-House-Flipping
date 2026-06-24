import { HOTSPOTS, TOTAL_INVESTED } from '../data/hotspots'

const fmt = (n: number) => '$' + n.toLocaleString('en-US')

export default function Transformation() {
  return (
    <section id="services" className="bg-[#0d0e11] border-y border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <div className="reveal-up max-w-2xl">
          <p className="text-xs tracking-[0.28em] uppercase text-brand mb-6">Every repair</p>
          <h2 className="font-playfair text-4xl md:text-6xl leading-[1.04]">From the studs out</h2>
          <p className="mt-5 text-white/60 text-lg leading-relaxed">
            Eleven systems on this home, taken from storm-wrecked to showroom. The same points you can
            uncover on the house above — here in full.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HOTSPOTS.map((h) => {
            const Icon = h.icon
            return (
              <div
                key={h.id}
                className="reveal-up rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06] hover:border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/12 text-brand">
                    <Icon size={20} />
                  </span>
                  <span className="font-playfair text-xl text-[#3fb68b]">{fmt(h.cost)}</span>
                </div>
                <h3 className="font-playfair text-xl mb-2">{h.label}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{h.before}</p>
              </div>
            )
          })}
        </div>

        <div className="reveal-up mt-12 flex items-baseline justify-between border-t border-white/10 pt-6">
          <span className="text-white/45 text-xs uppercase tracking-[0.16em]">Total invested in this flip</span>
          <span className="font-playfair text-3xl md:text-4xl text-brand">{fmt(TOTAL_INVESTED)}</span>
        </div>
      </div>
    </section>
  )
}
