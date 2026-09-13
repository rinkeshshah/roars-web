/**
 * Filter chips. Approved island 3 of 4.
 *
 * Client-side state only. No crawlable query URLs and no history entries, so
 * a filtered view never becomes its own indexable URL. That is an SEO rule,
 * not a convenience: docs/SEO-SPEC.md keeps filtered views out of the index.
 */
export function initFilters(): void {
  const groups = document.querySelectorAll<HTMLElement>('[data-filter-group]')

  groups.forEach((group) => {
    const chips = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-filter]'))
    const scopeId = group.getAttribute('data-filter-group')
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-filter-item="${scopeId}"]`),
    )
    if (!chips.length || !cards.length) return

    const readout = group.querySelector<HTMLElement>('[data-filter-readout]')
    const empty = document.querySelector<HTMLElement>(`[data-filter-empty="${scopeId}"]`)
    const total = cards.length

    const apply = (key: string) => {
      let shown = 0
      cards.forEach((card) => {
        const cats = ` ${card.getAttribute('data-cats') || ''} `
        const on = key === 'all' || cats.includes(` ${key} `)
        card.hidden = !on
        if (on) shown++
      })

      chips.forEach((c) =>
        c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === key)),
      )
      if (readout) readout.textContent = `${shown} / ${total}`
      if (empty) empty.hidden = shown > 0
    }

    chips.forEach((chip) =>
      chip.addEventListener('click', () => apply(chip.getAttribute('data-filter') || 'all')),
    )
    apply('all')
  })
}
