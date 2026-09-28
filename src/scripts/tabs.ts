/**
 * The surfaces tabs on /industries/[slug]/: four named seats, one panel.
 *
 * NOT AN ISLAND, and not a fifth one either — it is the filter-chip pattern
 * with a single selection, a plain module that finds its markup or returns.
 * Approved island 2 is "filter chips"; this is the same mechanism wearing a
 * different label.
 *
 * All four panels ship in the HTML, so the copy is in the page for a crawler
 * and for anyone without JS, who gets the first panel and four headings. The
 * script only decides which one is visible.
 *
 * Real buttons with aria-selected and a roving tabindex, so the group is one
 * tab stop and the arrow keys move within it. A div with a click handler
 * would leave four unreachable panels.
 */
export function initTabs(): void {
  for (const group of document.querySelectorAll<HTMLElement>('[data-tabs]')) {
    const tabs = Array.from(group.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
    const panels = Array.from(group.querySelectorAll<HTMLElement>('[role="tabpanel"]'))
    if (tabs.length < 2 || tabs.length !== panels.length) return

    const select = (i: number, focus = false) => {
      tabs.forEach((t, n) => {
        const on = n === i
        t.setAttribute('aria-selected', String(on))
        t.tabIndex = on ? 0 : -1
        if (on && focus) t.focus()
      })
      panels.forEach((p, n) => { p.hidden = n !== i })
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i))
      tab.addEventListener('keydown', (e) => {
        const k = (e as KeyboardEvent).key
        if (k !== 'ArrowRight' && k !== 'ArrowLeft' && k !== 'Home' && k !== 'End') return
        e.preventDefault()
        const last = tabs.length - 1
        const next =
          k === 'Home' ? 0
          : k === 'End' ? last
          : k === 'ArrowRight' ? (i === last ? 0 : i + 1)
          : i === 0 ? last : i - 1
        select(next, true)
      })
    })

    select(0)
  }
}
