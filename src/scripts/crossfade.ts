/**
 * Projects: the cards hand over on scroll. Approved island 4 of 4.
 *
 * THE HISTORY, because this has now been built three ways.
 *
 * It started as a true cross-fade, both slides holding opacities that summed
 * to 1 across the range. That was wrong, but not quite for the reason that
 * was recorded: mid-range both slides were partly opaque, so both titles and
 * both dates painted through each other — "02 Oct" through "15 Oct",
 * "Snowman Logistics." through "Parqly." A cross-fade between two pieces of
 * TEXT is always a collision.
 *
 * The fix was to make the switch discrete: one slide visible, the rest
 * visibility:hidden. That removed the collision, and the motion with it. The
 * section became a slideshow that cuts, and the export's actual device — the
 * incoming card riding up over the outgoing one — was gone.
 *
 * So the LAYERS are separated now, which is what the problem wanted all
 * along:
 *
 *   - The CARD moves and fades continuously. Two images overlapping at part
 *     opacity is the effect, not the defect.
 *   - The TEXT switches discretely at the halfway point, and the outgoing
 *     text is visibility:hidden, so it leaves the paint AND the accessibility
 *     tree. Two dates are never on screen together at any opacity.
 *
 * Opacity stays on [data-slide] so neighbouring slides still sum to 1 and the
 * slot is never empty — scripts/test-homepage.mjs asserts exactly that.
 *
 * Geometry is the export's: translateY(-56 * d), scale down by .04, across
 * 620px of scroll, eased p²(3-2p).
 *
 * Never reads scrollY per event: an IntersectionObserver decides whether the
 * section is on screen at all, and only while it is does a rAF-throttled
 * handler sample the rect. Off screen it costs nothing. Under
 * prefers-reduced-motion the first slide simply stays put.
 */

/**
 * THE STAGE IS PINNED NOW, above 1040px.
 *
 * The card sticks in the middle of the viewport and the handover is driven by
 * the scroll that happens while it sits there, so the first project comes to
 * rest, holds, and hands over to the second only when the reader scrolls on.
 *
 * That breaks the obvious way to measure progress. A stuck element's own rect
 * STOPS CHANGING — that is what stuck means — so sampling the stage's top
 * would read the same number for the whole pin and nothing would ever advance.
 * Progress comes off the TRACK instead: the track keeps scrolling normally,
 * and how far its top has travelled past the stage's sticky offset is exactly
 * how far through the pin we are.
 *
 * Below 1040px the CSS drops the pin, and this falls back to the original
 * measurement against the stage's own rect. It decides which by reading the
 * computed position rather than re-testing the media query, so there is one
 * source of truth for whether the pin is on and it is the stylesheet.
 */

/** Scroll distance ONE handover takes, from the export. */
const RANGE = 620
/** How far the outgoing card lifts, from the export. */
const LIFT = 56
/** How far it shrinks, from the export. */
const SHRINK = 0.04

export function initCrossfade(): void {
  const stage = document.querySelector<HTMLElement>('[data-crossfade]')
  if (!stage) return

  const slides = Array.from(stage.querySelectorAll<HTMLElement>('[data-slide]'))
  if (slides.length < 2) return

  /** The discrete half: only the active slide's text exists at all. */
  const setActive = (i: number) => {
    slides.forEach((s, n) => {
      const on = n === i
      s.setAttribute('aria-hidden', String(!on))
      /* A half-faded card must not be clickable, or the link under the cursor
         is whichever one happens to be painted on top. */
      s.style.pointerEvents = on ? '' : 'none'
    })
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    slides.forEach((s, n) => {
      s.style.opacity = n === 0 ? '1' : '0'
      s.style.transform = ''
    })
    setActive(0)
    return
  }

  const track = stage.parentElement?.hasAttribute('data-crossfade-track')
    ? stage.parentElement
    : null

  let active = false
  let frame = 0
  let current = -1

  /* Cached, because getComputedStyle forces style resolution and this would
     otherwise run on every animation frame of every scroll. Only the two
     things that can change it invalidate it. */
  let pin: { top: number; travel: number } | null = null
  const measurePin = () => {
    pin = null
    if (!track) return
    const cs = getComputedStyle(stage)
    if (cs.position !== 'sticky') return
    const top = parseFloat(cs.top)
    /* How far the track can scroll while the stage stays stuck: everything the
       track has that the stage does not. Zero means the CSS reserved nothing,
       so there is no pin to measure against. */
    const travel = track.offsetHeight - stage.offsetHeight
    if (!Number.isFinite(top) || travel <= 0) return
    pin = { top, travel }
  }

  const smooth = (x: number) => x * x * (3 - 2 * x)

  const sample = () => {
    /* Zero when the handover starts, one when it has finished. Pinned, that is
       how far the track has scrolled past the stage's sticky offset. Unpinned,
       it is the original measure: zero when the stage sits at 62% of the
       viewport, one after RANGE more pixels. Either way it is anchored to a
       live rect rather than a page offset, so it stays correct when the
       content above it changes length — the trap the hard-coded pixel bands
       fell into. */
    const raw = pin
      ? (pin.top - track!.getBoundingClientRect().top) / pin.travel
      : (innerHeight * 0.62 - stage.getBoundingClientRect().top) / RANGE
    const p = smooth(Math.min(1, Math.max(0, raw)))
    const pos = p * (slides.length - 1)

    for (let n = 0; n < slides.length; n++) {
      const s = slides[n]
      const d = pos - n
      const away = Math.min(1, Math.abs(d))
      s.style.opacity = String(Math.max(0, 1 - Math.abs(d)))
      s.style.transform =
        `translateY(${(-LIFT * d).toFixed(2)}px) scale(${(1 - SHRINK * away).toFixed(4)})`
    }

    const i = Math.round(pos)
    if (i !== current) { current = i; setActive(i) }
  }

  const onScroll = () => {
    if (!active || frame) return
    frame = requestAnimationFrame(() => { frame = 0; sample() })
  }

  /* The TRACK, not the stage. A stuck stage is on screen for the whole pin, so
     observing it would be the same test; observing the track is what tells us
     the pin has ended and the section is leaving. */
  const io = new IntersectionObserver((entries) => {
    active = entries.some((e) => e.isIntersecting)
    if (active) sample()
  })
  io.observe(track ?? stage)

  measurePin()
  sample()
  addEventListener('scroll', onScroll, { passive: true })
  /* Resize can cross the 1040px breakpoint in either direction, and the sticky
     offset is a function of viewport height, so the pin is re-measured before
     the next sample rather than trusted from load. */
  addEventListener('resize', () => { measurePin(); onScroll() }, { passive: true })
}
