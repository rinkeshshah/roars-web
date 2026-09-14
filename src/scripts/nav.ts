/**
 * Nav overlay. Approved island 1 of 4.
 *
 * Focus trap, Escape to close, focus returned to the trigger, aria-expanded
 * kept in sync, and the page behind is inert to scroll while open.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function initNav(): void {
  const overlay = document.querySelector<HTMLElement>('[data-nav-overlay]')
  const trigger = document.querySelector<HTMLElement>('[data-nav-trigger]')
  if (!overlay || !trigger) return

  /* Two close controls now: the desktop canvas's X and the mobile header's.
     querySelector would wire only the first, which is how a working X on one
     breakpoint and a dead one on the other happens quietly. */
  const closers = Array.from(overlay.querySelectorAll<HTMLElement>('[data-nav-close]'))
  let lastFocused: HTMLElement | null = null

  const focusables = () =>
    Array.from(overlay.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    )

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return }
    if (e.key !== 'Tab') return

    const items = focusables()
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement

    if (e.shiftKey && active === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus() }
  }

  function setOpen(open: boolean): void {
    if (!overlay || !trigger) return
    trigger.setAttribute('aria-expanded', String(open))
    document.documentElement.style.overflow = open ? 'hidden' : ''

    if (open) {
      lastFocused = document.activeElement as HTMLElement
      overlay.hidden = false
      // Next frame so the opacity transition has a starting value to run from.
      requestAnimationFrame(() => overlay.classList.add('is-open'))
      focusables()[0]?.focus()
      document.addEventListener('keydown', onKeydown)
    } else {
      overlay.classList.remove('is-open')
      overlay.hidden = true
      document.removeEventListener('keydown', onKeydown)
      lastFocused?.focus()
    }
  }

  trigger.addEventListener('click', () =>
    setOpen(trigger.getAttribute('aria-expanded') !== 'true'),
  )
  closers.forEach((c) => c.addEventListener('click', () => setOpen(false)))

  /**
   * Mega-menu panel switching. Deliberately separate from the focus trap
   * above: inactive panels stay `hidden`, and focusables() filters on
   * offsetParent, so only the visible panel's links are ever tabbable and the
   * trap does not need to know this exists.
   *
   * Switching on focus as well as hover is what makes it work for a keyboard.
   * Without that, tabbing down the nav would leave the panel showing whatever
   * the mouse last touched.
   */
  const rows = Array.from(overlay.querySelectorAll<HTMLElement>('[data-menu-row]'))
  const rest = overlay.querySelector<HTMLElement>('[data-menu-pane="rest"]')
  const panes = Array.from(
    overlay.querySelectorAll<HTMLElement>('[data-menu-pane]:not([data-menu-pane="rest"])'),
  )
  if (rows.length && rows.length === panes.length) {
    const show = (i: number) => {
      if (rest) rest.hidden = i >= 0
      panes.forEach((pane, n) => { pane.hidden = n !== i })
      rows.forEach((row, n) => row.setAttribute('aria-current', String(n === i)))
    }
    rows.forEach((row, i) => {
      row.addEventListener('pointerenter', () => show(i))
      row.addEventListener('focus', () => show(i))
      // A row with no route reveals its panel rather than navigating.
      if (row.tagName === 'BUTTON') row.addEventListener('click', () => show(i))
    })
    /* Rest state on open: the statement panel, no row current. */
    show(-1)
    overlay.addEventListener('pointerleave', () => show(-1))
  }
}
