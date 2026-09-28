/**
 * The hero receipt on /industries/[slug]/: a clock that runs and an order
 * that moves through its states.
 *
 * NOT AN ISLAND. Same shape as spine and tabs — a plain module that looks for
 * its markup and returns when it is not there. It hydrates nothing; it writes
 * textContent and toggles a class.
 *
 * The export runs both timers for the life of the page. This one runs them
 * only while the ticket is on screen, which on a 6800px page is the first
 * screenful and nothing after it. A clock nobody can see does not need to be
 * right, and a phone should not spend a battery on one.
 *
 * The server renders a real state — `statusIndex` — so the page a crawler
 * reads and the page before this script runs both show an order that makes
 * sense. Under prefers-reduced-motion that rendered state is simply where it
 * stays: a printed ticket is a real thing, not a degraded animation.
 */
const CYCLE = 2600
const FADE = 200

export function initTicket(): void {
  const root = document.querySelector<HTMLElement>('[data-ticket]')
  if (!root) return

  const status = root.querySelector<HTMLElement>('[data-ticket-status]')
  const clock = root.querySelector<HTMLElement>('[data-ticket-clock]')
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-ticket-step]'))

  let states: string[] = []
  try {
    states = JSON.parse(root.dataset.ticket || '[]')
  } catch {
    return
  }
  if (states.length < 2) return

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

  /* Seconds since midnight, seeded from the rendered time so the clock picks
     up where the printed ticket left off rather than jumping to "now". */
  let t = 0
  if (clock) {
    const [h = 0, m = 0, s = 0] = (clock.textContent || '').split(':').map(Number)
    t = h * 3600 + m * 60 + s
  }

  let i = Math.min(states.length - 1, Math.max(0, Number(root.dataset.ticketIndex ?? 0)))

  const paint = () => {
    if (status) status.textContent = states[i]
    steps.forEach((el, k) => el.classList.toggle('is-on', k <= i))
  }

  const pad = (n: number) => String(n).padStart(2, '0')
  const tick = () => {
    t += 1
    if (clock) clock.textContent = `${pad(Math.floor(t / 3600) % 24)}:${pad(Math.floor(t / 60) % 60)}:${pad(t % 60)}`
  }

  const advance = () => {
    i = (i + 1) % states.length
    if (!status) return paint()
    status.style.opacity = '0'
    setTimeout(() => {
      paint()
      status.style.opacity = '1'
    }, FADE)
  }

  let clockId = 0
  let stageId = 0
  const stop = () => {
    clearInterval(clockId)
    clearInterval(stageId)
    clockId = stageId = 0
  }
  const start = () => {
    if (clockId) return
    clockId = window.setInterval(tick, 1000)
    if (!reduce) stageId = window.setInterval(advance, CYCLE)
  }

  if (reduce) return

  status?.style.setProperty('transition', `opacity ${FADE}ms ease`)
  new IntersectionObserver((entries) => {
    entries.some((e) => e.isIntersecting) ? start() : stop()
  }).observe(root)
}
