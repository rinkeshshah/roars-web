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
      } catch {
        say('Could not reach the server. Please email us instead.', 'error')
        if (submit) submit.disabled = false
      }
    })
  })
}
