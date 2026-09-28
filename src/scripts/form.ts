/**
 * Contact form. A FIFTH island, which CLAUDE.md says needs a reason.
 *
 * The reason: public/api/contact.php returns JSON, Turnstile needs its widget
 * rendered and its token posted, and `generate_lead` has to fire from the
 * server's response rather than the submit handler. None of that is reachable
 * with a plain form POST. It is ~50 lines and loads only where a form exists.
 *
 * The endpoint is the authority on success. This never assumes a submit
 * worked, because a click is not a conversion.
 */

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

/** How long to wait for Cloudflare's script before telling the visitor. */
const TURNSTILE_TIMEOUT = 8000

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string | undefined
  getResponse: (id?: string) => string | undefined
}
const cf = () => (window as unknown as { turnstile?: Turnstile }).turnstile

/**
 * Load Cloudflare's script once per page, whoever asks first.
 *
 * The contact and guide pages carry the tag in their own markup because the
 * form is the point of those pages. The footer's newsletter form is on all
 * 207 pages and must not make every one of them fetch a third-party script
 * for a field almost nobody touches -- so it calls this on first focus
 * instead. Either way the script is fetched at most once, and the promise is
 * shared so two forms on one page cannot start two loads.
 */
let loading: Promise<boolean> | null = null
function loadTurnstile(): Promise<boolean> {
  if (loading) return loading
  loading = new Promise<boolean>((resolve) => {
    if (cf()) { resolve(true); return }
    const existing = document.querySelector<HTMLScriptElement>(`script[src^="${TURNSTILE_SRC}"]`)
    const done = () => resolve(Boolean(cf()))
    if (existing) {
      existing.addEventListener('load', done, { once: true })
      existing.addEventListener('error', () => resolve(false), { once: true })
    } else {
      const tag = document.createElement('script')
      tag.src = TURNSTILE_SRC
      tag.async = true
      tag.defer = true
      tag.addEventListener('load', done, { once: true })
      tag.addEventListener('error', () => resolve(false), { once: true })
      document.head.appendChild(tag)
    }
    /* A script that never loads never fires either event -- an offline
       device, a blocked domain, a corporate filter that black-holes the
       request. Without this the button would stay disabled for ever with no
       explanation. */
    setTimeout(() => resolve(Boolean(cf())), TURNSTILE_TIMEOUT)
  })
  return loading
}

export function initForms(): void {
  const forms = document.querySelectorAll<HTMLFormElement>('[data-contact-form]')

  forms.forEach((form) => {
    const status = form.querySelector<HTMLElement>('[data-form-status]')
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')
    const widget = form.querySelector<HTMLElement>('.cf-turnstile')
    const sitekey = widget?.dataset.sitekey ?? ''

    const say = (message: string, state: 'error' | 'ok') => {
      if (!status) return
      status.textContent = message
      status.dataset.state = state
    }

    /* ── THE SIGNED STAMP ──────────────────────────────────────────────
       Fetched, not rendered, because this is a static build: a timestamp
       baked into the HTML would be the same for every visitor and hours
       old. See the long note in public/api/roars-spam.php.
       Asked for on the first sign of a human -- a focus or a keystroke --
       so a page nobody interacts with costs no request at all. */
    let stamped = false
    const getStamp = async () => {
      if (stamped) return
      stamped = true
      try {
        const res = await fetch(`${form.action}?stamp=1`, { headers: { Accept: 'application/json' } })
        const { t, sig } = (await res.json()) as { t?: string; sig?: string }
        if (!t || !sig) return
        form.dataset.ts = String(t)
        form.dataset.tsSig = String(sig)
      } catch {
        /* Silence on purpose. A missing stamp is logged server-side and
           treated as a signal, never as a rejection -- losing an enquiry
           because our own request failed is the one outcome worth avoiding
           more than letting a bot through. */
      }
    }

    /* ── THE WIDGET ────────────────────────────────────────────────────
       Everything below is skipped entirely on a form with no widget, so a
       build without a site key behaves exactly as it did before. */
    let ready = !widget
    const gate = (on: boolean) => { if (submit) submit.disabled = !on }

    if (widget) {
      gate(false)
      if (!submit?.dataset.label) {
        submit?.setAttribute('data-label', submit.textContent?.trim() ?? '')
      }

      const arm = () => { ready = true; gate(true); say('', 'ok') }

      const start = async () => {
        widget.hidden = false
        /* SAY WHY IT IS OFF. A greyed-out button with no explanation is the
           thing people report as "the form is broken". The widget usually
           settles in about a second and clears this itself; the line only
           matters when it does not. */
        say('Just checking you are human…', 'ok')
        const ok = await loadTurnstile()
        if (!ok) {
          /* THE SCRIPT DID NOT LOAD, and the button stays disabled: letting
             it through would post a submission with no token, which the
             server refuses with "Verification failed" -- a dead end that
             reads as the visitor's fault. An address they can actually use
             is worth more than a button that cannot work. */
          say('Checks could not load. Please email sales@roarsinc.com and we will pick it up.', 'error')
          return
        }
        /* Rendered explicitly rather than left to the implicit sweep: the
           sweep only runs once, when the script loads, and the footer's
           widget is created after that on pages where the script was
           already there. */
        if (!widget.dataset.rendered) {
          widget.dataset.rendered = '1'
          cf()?.render(widget, {
            sitekey,
            theme: 'light',
            callback: arm,
            'expired-callback': () => { ready = false; gate(false) },
            'error-callback': () => { ready = false; gate(false) },
          })
        }
      }

      if (widget.dataset.lazy === '1') {
        /* The newsletter form, on every page. Nothing is fetched until
           somebody actually goes to use it. */
        form.addEventListener('focusin', () => { void start() }, { once: true })
      } else {
        void start()
      }
    }

    form.addEventListener('focusin', () => { void getStamp() }, { once: true })

    form.addEventListener('submit', async (event) => {
      /* Set by the catch below after a failed fetch: let the browser post the
         form itself rather than intercepting it a second time. */
      if (form.dataset.native === '1') return
      event.preventDefault()
      if (submit?.disabled) return
      if (!ready) {
        say('Please complete the check above first.', 'error')
        return
      }
      if (submit) submit.disabled = true
      form.dataset.sending = '1'
      say('Sending…', 'ok')

      const fields = new FormData(form)
      fields.set('page_url', location.href)
      /* Two signals the lead flow reads. Written here rather than in the
         markup because they describe this submit, not the build.
         `elapsed_ms` is milliseconds from navigation to submit. Someone
         filling in a contact form takes seconds at least; a script posting one
         takes almost none, and n8n scores on the difference. performance.now()
         is monotonic, so a clock change cannot make it lie.
         `page` is the path. `page_url` above is the whole href with its query
         and hash, and n8n wants the path on its own. */
      fields.set('elapsed_ms', String(Math.round(performance.now())))
      fields.set('page', location.pathname)
      /* The server-signed pair. Absent when the fetch above failed or when
         nobody ever focused a field; the endpoint logs that and carries on. */
      if (form.dataset.ts && form.dataset.tsSig) {
        fields.set('ts', form.dataset.ts)
        fields.set('ts_sig', form.dataset.tsSig)
      }

      /* URL-ENCODED, NOT MULTIPART. A FormData body makes fetch send
         multipart/form-data with a generated boundary, which is what a file
         upload needs and this form has none of. It is also the shape a
         mod_security or Imunify rule is most likely to inspect byte by byte
         and refuse, and a refusal at that layer arrives as a dropped
         connection -- which reaches this code as a thrown fetch and not as a
         response we could read. Every value here is a string, so urlencoded
         carries the same data in fewer bytes and through a quieter path. */
      const body = new URLSearchParams()
      for (const [k, v] of fields) body.append(k, String(v))

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        })
        const data = await res.json().catch(() => null)

        if (!res.ok || !data?.ok) {
          // The endpoint returns fixed strings; it never echoes input back.
          say(data?.error || 'Something went wrong. Please email us instead.', 'error')
          if (submit) submit.disabled = false
          return
        }

        // Server confirmed the write. Only now is this a lead.
        if (data.event) {
          ;(window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({
            event: data.event,
            form_name: data.form,
            page_path: location.pathname,
          })
        }

        form.reset()
        say('Thanks. We reply within 24 hours.', 'ok')
        form.dataset.sent = '1'

        /* EVERY FORM LANDS ON /thankyou/. The in-place message above is what a
           human reads for the half second before the navigation happens; it
           stays because a failed or slow navigation must not leave the form
           looking untouched.
           The redirect is what makes the submit measurable: an in-place
           message is not a pageview, so a GA4 destination goal has nothing to
           fire on. `form` rides along as a query parameter so one goal can
           still be broken down by which form produced it — the page is
           noindex, so a parameterised URL costs nothing in search.
           `replace`, not `assign`: Back should return to the page they came
           from, not re-submit the form they just sent. */
        const to = new URL('/thankyou/', location.origin)
        if (data.form) to.searchParams.set('form', String(data.form))
        /* The enquiry number, so /thankyou/ can print the same one the
           acknowledgement's subject carries. searchParams encodes the '#'. */
        if (data.ref) to.searchParams.set('ref', String(data.ref))
        location.replace(to.toString())
      } catch (err) {
        /* THE REQUEST NEVER COMPLETED. Not a rejection from the endpoint -- a
           rejection would have been a response we could read. This is the
           connection itself: blocked by an extension, refused by a WAF, cut
           mid-flight, offline.
           SO FALL BACK TO THE FORM. A native post reaches the same endpoint
           without fetch in the way, and contact.php answers one with a 303 to
           /thankyou/ -- the same destination, the same conversion, the enquiry
           not lost. `data-native` stops this handler intercepting the submit
           it is about to trigger, so there is no second attempt and no loop.
           The real error goes to the console, because "could not reach the
           server" is all a visitor needs and none of what we need. */
        console.error('[roars] form submit failed, falling back to a native post:', err)
        if (form.dataset.native === '1') {
          say('Could not reach the server. Please email us instead.', 'error')
          if (submit) submit.disabled = false
          return
        }
        form.dataset.native = '1'
        say('Sending…', 'ok')
        form.submit()
      }
    })
  })
}
