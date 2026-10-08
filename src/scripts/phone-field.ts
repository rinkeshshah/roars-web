/**
 * The contact form's WhatsApp number field.
 *
 * WHAT n8n NEEDS. It reads `phone` off the webhook payload and sends the lead
 * a WhatsApp message after we have replied by email, so the value has to be a
 * full E.164 string — "+", country code, national number — not whatever the
 * visitor typed. The KEY MUST STAY `phone`: n8n matches on it.
 *
 * SO THE VISIBLE INPUTS CARRY NO NAME AT ALL. The select and the number box
 * are unnamed, and a hidden input named `phone` carries the composed value.
 * That way there is exactly one `phone` in the FormData no matter what, and
 * the two halves a person types can never reach the webhook as separate keys
 * or as a second `phone` that overwrites the real one.
 *
 * IT IS WRITTEN ON EVERY KEYSTROKE, not only on submit. form.ts falls back to
 * a native browser post when its fetch is refused at the firewall, and a
 * native post sends whatever is in the DOM at that moment. Composing only in
 * the submit handler would mean that fallback silently posted an empty phone.
 *
 * VALIDATION IS DELIBERATELY LOOSE: 6 to 14 digits after the country code, and
 * nothing about whether that number is plausible FOR that country. Knowing
 * that is what libphonenumber is for and it costs a few hundred kilobytes;
 * this is an optional field on a contact form, and a rule tight enough to be
 * useful is also tight enough to reject somebody's real number.
 */
import { DIAL_CODES, findDialCode } from '../lib/dial-codes'

const MIN_DIGITS = 6
const MAX_DIGITS = 14

interface PhoneField {
  form: HTMLFormElement
  code: HTMLSelectElement
  number: HTMLInputElement
  hidden: HTMLInputElement
  error: HTMLElement
}

function parts(f: PhoneField): { code: string; national: string } {
  /* data-dial, NOT the select's value. The value is the ISO code, because +1
     is both the United States and Canada and a non-unique value cannot be set
     reliably from the Country box. */
  const code = (f.code.selectedOptions[0]?.dataset.dial ?? '').replace(/\D/g, '')
  /* One leading zero only. It is the trunk prefix in most of the plan —
     07700 900123 dials as +44 7700 900123 — and stripping more than one would
     eat a real digit from the handful of countries whose numbers start 00. */
  const national = f.number.value.replace(/\D/g, '').replace(/^0/, '')
  return { code, national }
}

/** The E.164 string, or '' when the visitor left the number blank. */
function compose(f: PhoneField): string {
  const { code, national } = parts(f)
  return national ? `+${code}${national}` : ''
}

function setError(f: PhoneField, message: string): void {
  f.error.textContent = message
  const bad = message !== ''
  f.error.hidden = !bad
  f.number.setAttribute('aria-invalid', bad ? 'true' : 'false')
  /* The help text stays described either way: a reader who has just been told
     the number is wrong still wants to know what the field is for. */
  f.number.setAttribute(
    'aria-describedby',
    bad ? 'c-phone-error c-phone-help' : 'c-phone-help',
  )
}

function find(form: HTMLFormElement): PhoneField | null {
  const code = form.querySelector<HTMLSelectElement>('[data-phone-code]')
  const number = form.querySelector<HTMLInputElement>('[data-phone-number]')
  const hidden = form.querySelector<HTMLInputElement>('[data-phone-value]')
  const error = form.querySelector<HTMLElement>('[data-phone-error]')
  if (!code || !number || !hidden || !error) return null
  return { form, code, number, hidden, error }
}

/**
 * Check and compose, called from form.ts's submit handler so the ordering is
 * not a question of which listener was added first.
 *
 * Returns false when the number is present and the wrong length. An empty
 * field is valid and sends `phone` as an empty string, which is what the brief
 * asks for and what n8n already handles.
 */
export function preparePhone(form: HTMLFormElement): boolean {
  const f = find(form)
  if (!f) return true

  const { national } = parts(f)
  if (national && (national.length < MIN_DIGITS || national.length > MAX_DIGITS)) {
    setError(f, `Enter ${MIN_DIGITS} to ${MAX_DIGITS} digits after the country code.`)
    f.number.focus()
    return false
  }

  setError(f, '')
  f.hidden.value = compose(f)
  return true
}

/**
 * Wire the field up: keep the hidden value current, default the country code
 * from the Country box, and clear a stale error as soon as it stops being true.
 */
export function initPhoneField(): void {
  for (const form of document.querySelectorAll<HTMLFormElement>('form[data-contact-form]')) {
    const f = find(form)
    if (!f) continue

    /* Once they touch the select it is theirs. The Country box may still be
       empty at that point, and having it overwrite their choice a moment later
       is the kind of thing that looks like a bug and is impossible to argue
       with. */
    let codeIsTheirs = false
    f.code.addEventListener('change', () => {
      codeIsTheirs = true
      f.hidden.value = compose(f)
    })

    const sync = (): void => {
      f.hidden.value = compose(f)
      /* Only ever clear an error here. Raising one while somebody is partway
         through typing a valid number tells them they are wrong for every
         keystroke up to the sixth. */
      if (f.error.textContent) {
        const { national } = parts(f)
        if (!national || (national.length >= MIN_DIGITS && national.length <= MAX_DIGITS)) {
          setError(f, '')
        }
      }
    }
    f.number.addEventListener('input', sync)
    f.number.addEventListener('blur', sync)

    const country = form.querySelector<HTMLInputElement>('[name="country"]')
    if (country) {
      const guess = (): void => {
        if (codeIsTheirs) return
        const hit = findDialCode(country.value)
        if (hit && DIAL_CODES.some((c) => c.iso === hit.iso)) {
          f.code.value = hit.iso
          f.hidden.value = compose(f)
        }
      }
      country.addEventListener('input', guess)
      country.addEventListener('change', guess)
      /* A browser autofilling the country on load never fires `input`. */
      guess()
    }
  }
}
