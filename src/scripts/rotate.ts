/**
 * Timed rotation. Two users, one place: the hero's rotating word, and the two
 * lead cards on /our-journal/. Not an island — a few dozen lines in the shared
 * bundle, and a second file for the same concern would be a fifth island for
 * no gain.
 *
 * The hero's first word and the journal's first slide are both rendered
 * server-side, so the page is complete and correct before any script runs and
 * the LCP element never reflows. Under prefers-reduced-motion nothing rotates
 * at all: the word and the newest post simply stay put, which is a whole
 * answer rather than a degraded one.
 */
export function initRotate(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  rotateWords()
  rotateSlides()
}

/** The hero's rotating word. The slot is min-width'd in CSS, so swapping in a
 *  longer word cannot shift the line. */
function rotateWords(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-rotate]')) {
    const words = (el.dataset.words || '').split('|').filter(Boolean)
    if (words.length < 2) continue
    let i = words.indexOf(el.textContent?.trim() || '')
    if (i < 0) i = 0
    setInterval(() => {
      i = (i + 1) % words.length
      el.style.opacity = '0'
      setTimeout(() => {
        el.textContent = words[i]
        el.style.opacity = '1'
      }, 260)
    }, 2600)
  }
}

/**
 * The journal's two lead cards, cross-fading in place.
 *
 * WHY THE HIDDEN SLIDE LEAVES THE TAB ORDER. Both slides are links sitting on
 * top of each other. Left alone, a keyboard user tabs into a card they cannot
 * see and follows it, and a screen reader announces two lead stories where the
 * page shows one. `tabindex="-1"` and `aria-hidden` move with the fade — both,
 * because either on its own still leaves the hidden card reachable one way or
 * the other — and the CSS drops pointer-events on the same class, so it cannot
 * be clicked either.
 */
function rotateSlides(): void {
  for (const box of document.querySelectorAll<HTMLElement>('[data-jf]')) {
    const slides = [...box.querySelectorAll<HTMLElement>('[data-jf-slide]')]
    const pips = [...box.querySelectorAll<HTMLElement>('[data-jf-pip]')]
    if (slides.length < 2) continue

    let i = slides.findIndex((s) => s.classList.contains('is-on'))
    if (i < 0) i = 0
    let held = false

    const show = (n: number) => {
      slides.forEach((s, k) => {
        const on = k === n
        s.classList.toggle('is-on', on)
        if (on) {
          s.removeAttribute('aria-hidden')
          s.removeAttribute('tabindex')
        } else {
          s.setAttribute('aria-hidden', 'true')
          s.setAttribute('tabindex', '-1')
        }
      })
      pips.forEach((p, k) => p.classList.toggle('is-on', k === n))
    }

    /* Paused while a reader is on the card. Swapping it out from under a
       cursor on its way to clicking is how somebody lands on a post they did
       not choose. */
    const hold = () => { held = true }
    const free = () => { held = false }
    box.addEventListener('pointerenter', hold)
    box.addEventListener('pointerleave', free)
    box.addEventListener('focusin', hold)
    box.addEventListener('focusout', free)

    setInterval(() => {
      /* Not while held, and not in a background tab — otherwise the card has
         silently moved on by the time they look at it again. */
      if (held || document.hidden) return
      i = (i + 1) % slides.length
      show(i)
    }, 6000)
  }
}
