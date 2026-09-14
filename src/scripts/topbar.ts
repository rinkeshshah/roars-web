/**
 * Top bar ink inversion and scroll-progress ring.
 *
 * The prototypes hard-code pixel bands like [[0,900],[3339,4679]]. Those break
 * the moment a section's content length changes, so this observes the actual
 * [data-ground="dark"] sections instead and asks which one the bar is over.
 *
 * Not an island: one observer plus a rAF-throttled scroll read for the ring.
 */
const BAR_PROBE_Y = 60

export function initTopbar(): void {
  const bar = document.querySelector<HTMLElement>('[data-topbar]')
  if (!bar) return

  /* A dark ground is the usual reason the bar needs light ink, but not the
     only one: the homepage hero is a LIGHT section whose right two thirds are
     a photograph, and the bar sits entirely over that. Such a section opts in
     with data-topbar-ink="light" rather than lying about its ground. */
  const darks = Array.from(
    document.querySelectorAll<HTMLElement>('[data-ground="dark"], [data-topbar-ink="light"]'),
  )

  /** Dark sections currently crossing the bar's probe line. */
  const overlapping = new Set<Element>()

  const applyInk = () => {
    // Light styling when the bar is NOT over a dark section.
    bar.classList.toggle('is-light', overlapping.size === 0)
  }

  if (darks.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const r = entry.boundingClientRect
          const crossing = entry.isIntersecting && r.top <= BAR_PROBE_Y && r.bottom > BAR_PROBE_Y
          if (crossing) overlapping.add(entry.target)
          else overlapping.delete(entry.target)
        }
        applyInk()
      },
      // A band across the probe line: an element only "intersects" while it
      // actually covers the bar, which is exactly the question being asked.
      { rootMargin: `-${BAR_PROBE_Y}px 0px -${window.innerHeight - BAR_PROBE_Y - 1}px 0px`, threshold: 0 },
    )
    darks.forEach((d) => io.observe(d))
  }
  applyInk()

  let frame = 0
  const onScroll = () => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      bar.classList.toggle('is-scrolled', window.scrollY > 80)
    })
  }

  onScroll()
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onScroll, { passive: true })
}
