/**
 * Accordion. Approved island 2 of 4. One row open at a time, none required.
 *
 * Height is animated from the panel's real content height rather than a fixed
 * open height, then released to auto, so a three-line answer does not clip.
 *
 * IT USED TO SERVE TWO ROW KINDS. The homepage Services band was a "swap" row:
 * the open row had six grid tracks, a photo and a client list where a closed
 * row had four tracks and a count, so there was no box whose height could be
 * animated and both states shipped in the DOM behind `display: contents`. That
 * band is now a plain list of twelve links — a row goes to its service page
 * rather than opening — so the swap branch and the one-must-stay-open rule
 * that went with it are gone. The FAQ is the only caller left, and an FAQ
 * should be able to close everything.
 */
export function initAccordions(): void {
  const groups = document.querySelectorAll<HTMLElement>('[data-accordion]')

  groups.forEach((group) => {
    const triggers = Array.from(group.querySelectorAll<HTMLButtonElement>('[aria-expanded]'))

    const setRow = (trigger: HTMLButtonElement, open: boolean) => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls') || '')
      if (!panel) return
      trigger.setAttribute('aria-expanded', String(open))

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

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true'
        triggers.forEach((other) => { if (other !== trigger) setRow(other, false) })
        setRow(trigger, !isOpen)
      })
    })
  })
}
