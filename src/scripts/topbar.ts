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

  /**
   * The scroll-progress ring around the mark.
   *
   * This was built once before and removed, because it rendered as a pale
   * filled circle behind the mark — the badge that had been explicitly cut —
   * and came back as a complaint three times. It is back by request, drawn
   * correctly this time: a conic gradient with a radial MASK punching its
   * centre out, so it is an annulus and cannot read as a disc whatever ground
   * it sits on. scripts/test-components.mjs asserts the centre stays clear.
   *
   * Invisible at the top and fading in once the page has actually moved, so
   * it reads as progress rather than decoration parked at zero. A page too
   * short to scroll never shows it at all.
   */
  const ring = document.querySelector<HTMLElement>('[data-logo-ring]')

  const setRing = () => {
    if (!ring) return
    const span = document.documentElement.scrollHeight - window.innerHeight
    if (span < 120) { ring.style.opacity = '0'; return }
    const p = Math.min(1, Math.max(0, window.scrollY / span))
    ring.style.setProperty('--p', `${p.toFixed(4)}turn`)
    ring.style.opacity = window.scrollY > 24 ? '1' : '0'
  }

  let frame = 0
  const onScroll = () => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      bar.classList.toggle('is-scrolled', window.scrollY > 80)
      setRing()
    })
  }

  onScroll()
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onScroll, { passive: true })

  initLogoPulse(bar)
}

/**
 * The logo's section-change pulse.
 *
 * Each time a new section reaches the middle of the viewport the mark flashes
 * pink for a second, then yellow for a second, then settles back to the ink
 * its new ground calls for. The colours, and why they are held rather than
 * blended, are in src/components/LogoChip.astro.
 *
 * OPT-IN PER PAGE, through `pulse` on <TopBar />, which writes
 * data-topbar-pulse on the bar. It is on the homepage alone while the effect
 * is being judged; every other page ships the observer-free path, and turning
 * it on elsewhere later is one prop per page rather than a change in here.
 *
 * THE MIDDLE OF THE VIEWPORT, not the top. A zero-height band across the
 * centre — which is what the -50%/-50% rootMargin makes — has exactly one
 * section crossing it at a time on a page whose sections tile the document,
 * so "which section is current" has one answer and a boundary fires once.
 * Probing at the top of the viewport instead would fire twice per boundary,
 * as the old section left and again as the new one arrived.
 */
function initLogoPulse(bar: HTMLElement): void {
  if (!bar.hasAttribute('data-topbar-pulse')) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const mark = document.querySelector<HTMLElement>('[data-logo-mark]')
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main section'))
  if (!mark || sections.length < 2) return

  let current: Element | null = null

  const pulse = () => {
    /* Restart from the top if one is already running. Remove the class, read
       a layout property to flush the style change, then add it back — without
       that read the two changes coalesce into no change at all, and scrolling
       quickly through three sections would animate once. */
    mark.classList.remove('is-pulsing')
    void mark.offsetWidth
    mark.classList.add('is-pulsing')
  }

  mark.addEventListener('animationend', (e) => {
    if ((e as AnimationEvent).animationName.includes('logoPulse')) {
      mark.classList.remove('is-pulsing')
    }
  })

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.target === current) continue
        /* Whatever is under the line when the page loads is not something the
           reader scrolled to, so the first answer sets the state silently. */
        const first = current === null
        current = entry.target
        if (!first) pulse()
      }
    },
    { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
  )
  sections.forEach((s) => io.observe(s))
}
