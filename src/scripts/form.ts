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
export function initForms(): void {
  const forms = document.querySelectorAll<HTMLFormElement>('[data-contact-form]')

  forms.forEach((form) => {
    const status = form.querySelector<HTMLElement>('[data-form-status]')
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')

    const say = (message: string, state: 'error' | 'ok') => {
      if (!status) return
      status.textContent = message
      status.dataset.state = state
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      if (submit?.disabled) return
      if (submit) submit.disabled = true
      say('Sending…', 'ok')

      const body = new FormData(form)
      body.set('page_url', location.href)
      /* Two signals the lead flow reads. Written here rather than in the
         markup because they describe this submit, not the build.
         `elapsed_ms` is milliseconds from navigation to submit. Someone
         filling in a contact form takes seconds at least; a script posting one
         takes almost none, and n8n scores on the difference. performance.now()
         is monotonic, so a clock change cannot make it lie.
         `page` is the path. `page_url` above is the whole href with its query
         and hash, and n8n wants the path on its own. */
      body.set('elapsed_ms', String(Math.round(performance.now())))
      body.set('page', location.pathname)

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body,
          headers: { Accept: 'application/json' },
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
      } catch {
        say('Could not reach the server. Please email us instead.', 'error')
        if (submit) submit.disabled = false
      }
    })
  })
}
