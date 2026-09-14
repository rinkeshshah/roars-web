/**
 * Projects: one project at a time, advanced by scroll. Approved island 4 of 4.
 *
 * This used to hold the two slides at opacities summing to 1 across the
 * section's scroll range, on the reasoning that the slot is then never empty
 * and never double-exposed. It was wrong: at any point mid-range BOTH slides
 * were partly opaque, so both titles and both dates rendered on top of each
 * other. "02 Oct" drew through "15 Oct" and "Snowman Logistics." through
 * "Parqly." A cross-fade between two pieces of text is always a collision.
 *
 * So the switch is now discrete. Exactly one slide is visible at a time; every
 * other slide is visibility:hidden, which takes it out of the paint AND out of
 * the accessibility tree, so nothing can overlap even during the fade.
 *
 * Never reads scrollY per event: an IntersectionObserver decides whether the
 * section is on screen at all, and only while it is does a rAF-throttled
 * handler sample the rect. Off screen it costs nothing. Under
 * prefers-reduced-motion the first slide simply stays put.
 */
export function initCrossfade(): void {
  const stage = document.querySelector<HTMLElement>('[data-crossfade]')
  if (!stage) return

  const slides = Array.from(stage.querySelectorAll<HTMLElement>('[data-slide]'))
  if (slides.length < 2) return

  const show = (i: number) => {
    slides.forEach((s, n) => {
      const on = n === i
      s.style.opacity = on ? '1' : '0'
      s.style.visibility = on ? 'visible' : 'hidden'
      s.setAttribute('aria-hidden', String(!on))
    })
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    show(0)
    return
  }

  let active = false
  let frame = 0
  let current = -1

  const sample = () => {
    const r = stage.getBoundingClientRect()
    /* Progress of the stage through the viewport, 0 as it arrives at the
       bottom, 1 as it leaves the top. */
    const span = r.height + innerHeight
    const p = Math.min(1, Math.max(0, (innerHeight - r.top) / span))
    const i = Math.min(slides.length - 1, Math.floor(p * slides.length))
    if (i !== current) { current = i; show(i) }
  }

  const onScroll = () => {
    if (!active || frame) return
    frame = requestAnimationFrame(() => { frame = 0; sample() })
  }

  const io = new IntersectionObserver((entries) => {
    active = entries.some((e) => e.isIntersecting)
    if (active) sample()
  })
  io.observe(stage)

  show(0)
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onScroll, { passive: true })
}
