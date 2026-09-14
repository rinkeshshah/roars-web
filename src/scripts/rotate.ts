/**
 * The hero's rotating word. Not an island: a dozen lines in the shared bundle.
 *
 * The first word is rendered server-side, so the heading is complete before
 * any script runs and the LCP element never reflows. Rotation is skipped
 * entirely under prefers-reduced-motion, and the slot is min-width'd in CSS so
 * swapping a longer word cannot shift the line.
 */
export function initRotate(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

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
