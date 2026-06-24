const STEPS: [string, string][] = [
  ['Acquire', 'We find distressed homes with good bones and a story worth saving.'],
  ['Assess', 'A line-by-line scope of every defect, with a fixed budget and timeline.'],
  ['Restore', 'Structure, then systems, then surfaces — repaired by licensed trades.'],
  ['Stage', 'Clean lines, warm light and curb appeal that photographs beautifully.'],
  ['Sell', 'Listed, shown and closed — a derelict house becomes someone’s home.'],
]

export default function Process() {
  return (
    <section id="process" className="bg-black">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <p className="text-xs tracking-[0.28em] uppercase text-brand mb-6 reveal-up">How a flip runs</p>
        <h2 className="font-playfair text-4xl md:text-6xl leading-[1.04] reveal-up">Five steps, no surprises</h2>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {STEPS.map(([title, desc], i) => (
            <div key={title} className="reveal-up rounded-2xl border border-white/10 p-6 bg-white/[0.02]">
              <div className="font-playfair text-3xl text-brand mb-3">0{i + 1}</div>
              <h3 className="font-playfair text-lg mb-2">{title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
