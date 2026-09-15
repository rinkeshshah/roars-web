/**
 * The testimonial deck. Three pages of four, Prev/Next swaps which is shown.
 *
 * All three pages ship in the DOM and this only flips `hidden`, so there is no
 * fetch, no template, and the eight that are off screen are still in the page
 * for a crawler.
 *
 * IT WRAPS BOTH WAYS. There is no "end" to reach and no disabled state to
 * explain; Next on the last page returns to the first. With three pages a
 * disabled control would be dark two thirds of the time for no gain.
 *
 * The reveal island has already run by the time anyone clicks, so a page that
 * was hidden when it ran comes back with its items still at opacity 0. `.is-in`
 * is forced on show rather than re-observing: these are four boxes that are
 * already on screen, and animating them in on every click would make paging
 * feel slower than it is.
 */
export function initDecks(): void {
  document.querySelectorAll<HTMLElement>('[data-say]').forEach((deck) => {
    const pages = Array.from(deck.querySelectorAll<HTMLElement>('[data-say-page]'))
    if (pages.length < 2) return

    const foot = deck.parentElement
    const prev = foot?.querySelector<HTMLButtonElement>('[data-say-prev]')
    const next = foot?.querySelector<HTMLButtonElement>('[data-say-next]')
    let at = 0

    const show = (i: number) => {
      at = (i + pages.length) % pages.length
      pages.forEach((p, n) => {
        p.hidden = n !== at
        if (n === at) p.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'))
      })
      // Announced rather than drawn: the dots beside the controls are the
      // prototype's marks, not a page indicator, and there are three pages.
      prev?.setAttribute('aria-label', `Previous testimonials, page ${((at - 1 + pages.length) % pages.length) + 1} of ${pages.length}`)
      next?.setAttribute('aria-label', `More testimonials, page ${((at + 1) % pages.length) + 1} of ${pages.length}`)
    }

    prev?.addEventListener('click', () => show(at - 1))
    next?.addEventListener('click', () => show(at + 1))
    show(0)
  })
}
