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

  const close = overlay.querySelector<HTMLElement>('[data-nav-close]')
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
  close?.addEventListener('click', () => setOpen(false))
}
