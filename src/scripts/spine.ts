/**
 * The process spine on /approach/: a vertical rule that fills with the accent
 * as the section is read, lighting each phase node as it passes.
 *
 * NOT AN ISLAND. Like reveal and the top bar, this is a plain module with one
 * IntersectionObserver and a rAF-throttled handler — it ships no framework and
 * does no work while the section is off screen. CLAUDE.md's four-island rule
 * is about hydration, not about scroll listeners.
 *
 * The read line is 55% down the viewport rather than the top or the middle:
 * the fill should be level with the phase you are actually looking at, and a
 * phase reads as "reached" slightly after its heading crosses the centre.
 *
 * Never reads scrollY per event. The fill is a height rather than a transform
 * because the rule is 1px wide and a scaled transform blurs a hairline.
 *
 * Under prefers-reduced-motion the spine renders as the export leaves it at
 * rest: hairline, first node lit, nothing tracking. That is a real state, not
 * a degraded one.
 */
export function initSpine(): void {
  const spine = document.querySelector<HTMLElement>('[data-spine]')
  if (!spine) return

  const fill = spine.querySelector<HTMLElement>('[data-spine-fill]')
  const nodes = Array.from(spine.querySelectorAll<HTMLElement>('[data-spine-node]'))
  if (!fill) return

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  let active = false
  let frame = 0

  const sample = () => {
    const r = spine.getBoundingClientRect()
    if (!r.height) return
    const readLine = innerHeight * 0.55
    const p = Math.min(1, Math.max(0, (readLine - r.top) / r.height))
    const px = p * r.height
    fill.style.height = `${px.toFixed(1)}px`
    /* offsetTop is relative to the spine, which is the positioned ancestor,
       so this needs no second rect read per node per frame. */
    for (const n of nodes) n.classList.toggle('is-on', n.offsetTop <= px + 1)
  }

  const onScroll = () => {
    if (!active || frame) return
    frame = requestAnimationFrame(() => { frame = 0; sample() })
  }

  const io = new IntersectionObserver((entries) => {
    active = entries.some((e) => e.isIntersecting)
    if (active) sample()
  })
  io.observe(spine)

  sample()
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onScroll, { passive: true })
}
