/**
 * One IntersectionObserver for every [data-reveal] on the page.
 *
 * Not an island. This is a plain module imported by the layout, so it costs
 * one small script and no framework runtime. The four approved islands are
 * the nav overlay, filter chips, accordion and the projects cross-fade;
 * reveal is deliberately not one of them.
 *
 * Elements are unobserved once shown, so this does no work after first paint.
 */
export function initReveal(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document
      .querySelectorAll<HTMLElement>('[data-reveal]')
      .forEach((el) => el.classList.add('is-in'))
    return
  }

  const items = document.querySelectorAll<HTMLElement>('[data-reveal]')
  if (!items.length) return

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        io.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.04 },
  )

  items.forEach((el) => io.observe(el))
}
