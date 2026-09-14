/**
 * Accordion. Approved island 2 of 4. One row open at a time.
 *
 * Height is animated from the panel's real content height rather than a fixed
 * open height, then released to auto, so a three-line answer does not clip.
 */
export function initAccordions(): void {
  const groups = document.querySelectorAll<HTMLElement>('[data-accordion]')

  groups.forEach((group) => {
    const triggers = Array.from(group.querySelectorAll<HTMLButtonElement>('[aria-expanded]'))

    const setRow = (trigger: HTMLButtonElement, open: boolean) => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls') || '')
      if (!panel) return
      trigger.setAttribute('aria-expanded', String(open))

      /* A SWAP row, not a panel row. The Services rows change layout between
         states — the open row has six grid tracks, a photo and a client list
         where the closed row has a count — so there is no box whose height
         can be animated. Both states ship in the DOM behind
         `display: contents` and this flips which one the grid sees. The FAQ
         below still animates a real panel; same island, two row kinds. */
      if (panel.hasAttribute('data-svc-row')) {
        panel.setAttribute('data-open', String(open))
        return
      }

      if (open) {
        panel.hidden = false
        panel.style.height = `${panel.scrollHeight}px`
      } else {
        // From the measured height, so the transition has somewhere to go.
        panel.style.height = `${panel.scrollHeight}px`
        requestAnimationFrame(() => { panel.style.height = '0px' })
        panel.addEventListener('transitionend', function onEnd() {
          if (trigger.getAttribute('aria-expanded') === 'false') panel.hidden = true
          panel.removeEventListener('transitionend', onEnd)
        })
      }
    }

    /* A SWAP group always has exactly one row open; a PANEL group may have
       none. The Services rows are swaps: the open row carries the photo, the
       client list and six grid tracks where a closed row carries four and a
       count, so closing the last open one does not collapse a panel, it
       removes a third of the section and drags every row under it upward.
       Clicking the open row there did exactly that. The export has no such
       state — it always draws one row open. The FAQ below is a panel group
       and still closes to nothing, which is what an FAQ should do. */
    const isSwapGroup = triggers.some((t) =>
      document.getElementById(t.getAttribute('aria-controls') || '')?.hasAttribute('data-svc-row'),
    )

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true'
        if (isOpen && isSwapGroup) return
        triggers.forEach((other) => { if (other !== trigger) setRow(other, false) })
        setRow(trigger, !isOpen)
      })
    })
  })
}
