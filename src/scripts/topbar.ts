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

  initLogoFlash(bar)
}

/**
 * The logo's section-change flash: pink as a boundary sweeps past the probe
 * line, yellow just either side of it, the ground ink everywhere else.
 *
 * DRIVEN BY POSITION, NOT BY A TIMER. The first version fired a 1180ms
 * animation when a new section became current. Firing at the boundary was
 * right; everything after it was not, because the animation then ran on its
 * own clock and put the pink-to-yellow and yellow-to-black changes wherever
 * the reader had scrolled to by the time the timer reached them — typically
 * several hundred pixels deep into the next section. The colour has to be a
 * function of where the page IS, so here it is measured rather than timed:
 * every scroll frame asks how far the probe line is from the nearest section
 * boundary and the answer picks the colour. Stop halfway and it holds. Scroll
 * back up and it runs in reverse. It cannot drift, because there is nothing
 * running to drift.
 *
 * THE BANDS are deliberately tight — 34px of pink, 96px of yellow either side
 * of it. At an ordinary scroll of roughly 1000px a second that is a flash of
 * about 70ms and a total of under 200ms, which is what "faster" asked for;
 * widen them and the flash slows down without any duration being edited.
 *
 * OPT-IN PER PAGE, through `pulse` on <TopBar />, which writes
 * data-topbar-pulse on the bar. Homepage only while the effect is judged.
 *
 * THE PROBE IS THE MIDDLE OF THE VIEWPORT. A boundary passing behind the
 * fixed top bar cannot be seen, so a probe at the top would flash the mark for
 * something the reader has no way to observe. The middle is where a boundary
 * is most legible, so that is where the flash is anchored to.
 */
function initLogoFlash(bar: HTMLElement): void {
  if (!bar.hasAttribute('data-topbar-pulse')) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const mark = document.querySelector<HTMLElement>('[data-logo-mark]')
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main section'))
  if (!mark || sections.length < 2) return

  const PINK = 34
  const AMBER = 96

  /* Boundaries in document coordinates: the top edge of every section after
     the first. The first section's top is the top of the page, which is not a
     boundary between two sections and would flash the mark at a scroll
     position nobody scrolled through. */
  let bounds: number[] = []
  const measure = () => {
    bounds = sections.slice(1).map((s) => s.getBoundingClientRect().top + window.scrollY)
  }

  let pink = false
  let amber = false

  const paint = () => {
    const line = window.scrollY + window.innerHeight / 2
    let near = Infinity
    for (const b of bounds) {
      const d = Math.abs(b - line)
      if (d < near) near = d
    }
    const nextPink = near <= PINK
    const nextAmber = !nextPink && near <= AMBER
    /* Only touch the DOM when the answer changes. This runs on every scroll
       frame, and two classList writes a frame for a value that is the same as
       last frame is work for nothing. */
    if (nextPink !== pink) { mark.classList.toggle('is-flash-pink', nextPink); pink = nextPink }
    if (nextAmber !== amber) { mark.classList.toggle('is-flash-amber', nextAmber); amber = nextAmber }
  }

  let frame = 0
  const onScroll = () => {
    if (frame) return
    frame = requestAnimationFrame(() => { frame = 0; paint() })
  }

  measure()
  paint()
  addEventListener('scroll', onScroll, { passive: true })
  /* Section offsets move when the viewport does — the pinned Projects track
     and every clamp on the page are height-dependent — so they are measured
     again rather than trusted from load. */
  addEventListener('resize', () => { measure(); onScroll() }, { passive: true })
}
