/**
 * Projects cross-fade. Approved island 4 of 4.
 *
 * One parameter p in [0,1] across the section's scroll range, eased with the
 * smoothstep p*p*(3-2p). Opacities always sum to 1, so the slot is never empty
 * and never double-exposed.
 *
 * Never reads scrollY per event: an IntersectionObserver decides whether the
 * section is on screen at all, and only while it is does a rAF-throttled
 * handler sample the rect. Off screen it costs nothing. Skipped entirely under
 * prefers-reduced-motion, where the first slide simply stays put.
 */
export function initCrossfade(): void {
  const stage = document.querySelector<HTMLElement>('[data-crossfade]')
  if (!stage) return

  const slides = Array.from(stage.querySelectorAll<HTMLElement>('[data-slide]'))
  if (slides.length < 2) return

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    slides.forEach((s, i) => { s.style.opacity = i === 0 ? '1' : '0' })
    return
  }

  let active = false
  let frame = 0

  const smoothstep = (p: number) => p * p * (3 - 2 * p)

  const sample = () => {
    frame = 0
    const rect = stage.getBoundingClientRect()
    // 0 when the stage's top reaches the viewport bottom, 1 when its bottom
    // reaches the viewport top. Clamped, so the ends hold rather than snap.
    const span = rect.height + window.innerHeight
    const raw = (window.innerHeight - rect.top) / Math.max(1, span)
    const p = smoothstep(Math.min(1, Math.max(0, raw)))

    // Two slides: the pair's opacities are p and 1-p, which always sum to 1.
    // With more, p walks the sequence and only the neighbouring pair blends.
    const scaled = p * (slides.length - 1)
    const index = Math.min(slides.length - 2, Math.floor(scaled))
    const local = scaled - index

    slides.forEach((slide, i) => {
      let opacity = 0
      if (i === index) opacity = 1 - local
      else if (i === index + 1) opacity = local
      slide.style.opacity = String(opacity)
      slide.setAttribute('aria-hidden', opacity < 0.5 ? 'true' : 'false')
    })
  }

  const onScroll = () => {
    if (!active || frame) return
    frame = requestAnimationFrame(sample)
  }

  const io = new IntersectionObserver(
    (entries) => {
      active = entries.some((e) => e.isIntersecting)
      if (active) sample()
    },
    { threshold: 0 },
  )
  io.observe(stage)

  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onScroll, { passive: true })
  sample()
}
