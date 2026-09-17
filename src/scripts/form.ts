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
      /* Set by the catch below after a failed fetch: let the browser post the
         form itself rather than intercepting it a second time. */
      if (form.dataset.native === '1') return
      event.preventDefault()
      if (submit?.disabled) return
      if (submit) submit.disabled = true
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
