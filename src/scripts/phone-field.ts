/**
 * The contact form's phone number field.
 *
 * IT IS LABELLED "Phone or WhatsApp number" and not "WhatsApp number". The
 * field is required, and a required field named after one app asks a US
 * visitor for an account plenty of them do not have; Meta also blocks
 * Marketing templates to US numbers, so it would be insisting on a number we
 * could not message. Either kind of number is handled identically here.
 *
 * WHAT n8n NEEDS. It reads `phone` off the webhook payload and messages the
 * lead after we have replied by email, so the value has to be a full E.164
 * string — "+", country code, national number — not whatever the visitor
 * typed. The KEY MUST STAY `phone`: n8n matches on it.
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
 * THE NUMBER IS REQUIRED. It shipped optional, which is what the original
 * brief asked for, and was made mandatory the same day on the owner's call.
 * So an empty field now stops the submit, and `phone` can no longer reach the
 * webhook as an empty string — anything n8n does with the value can assume
 * there is one.
 *
 * VALIDATION IS STILL DELIBERATELY LOOSE: 6 to 14 digits after the country
 * code, and nothing about whether that number is plausible FOR that country.
 * Knowing that is what libphonenumber is for and it costs a few hundred
 * kilobytes. Required raises the stakes on getting it wrong, too: a rule tight
 * enough to be useful is also tight enough to reject somebody's real number,
 * and now that would cost the enquiry rather than just the number.
 */
import { DIAL_CODES, findDialCode } from '../lib/dial-codes'

const MIN_DIGITS = 6
const MAX_DIGITS = 14

const MSG_EMPTY = 'Please add a phone or WhatsApp number so we can follow up.'
const MSG_LENGTH = `Enter ${MIN_DIGITS} to ${MAX_DIGITS} digits after the country code.`
const MSG_CODE = 'Choose the country code for your number.'

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

/**
 * The E.164 string, or '' when either half is missing.
 *
 * NO CODE MEANS NO VALUE, not a bare "+" and a national number. The select
 * starts on an empty placeholder, so a half-filled field is a real state that
 * exists for as long as somebody is typing, and the hidden input is live --
 * form.ts can post it natively if its fetch is refused. "+447700900123" or
 * nothing; never "+7700900123".
 */
function compose(f: PhoneField): string {
  const { code, national } = parts(f)
  return code && national ? `+${code}${national}` : ''
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
 * Returns false when the number is missing or the wrong length, having put the
 * reason under the field and moved focus there.
 *
 * TWO MESSAGES, NOT ONE. "Enter 6 to 14 digits" in front of an empty box reads
 * as an accusation about something the person has not done yet, and does not
 * say the field is needed at all. Empty and wrong are different mistakes and
 * get different sentences.
 */
export function preparePhone(form: HTMLFormElement): boolean {
  const f = find(form)
  if (!f) return true

  const { code, national } = parts(f)
  if (!national) {
    setError(f, MSG_EMPTY)
    f.number.focus()
    return false
  }
  if (national.length < MIN_DIGITS || national.length > MAX_DIGITS) {
    setError(f, MSG_LENGTH)
    f.number.focus()
    return false
  }
  /* Belt and braces behind `required` on the select, for the same reason the
     empty-number check sits behind `required` on the input: a number with no
     country code in front of it is not a number anybody can ring, and sending
     one is worse than refusing it. */
  if (!code) {
    setError(f, MSG_CODE)
    f.code.focus()
    return false
  }

  setError(f, '')
  f.hidden.value = compose(f)
  return true
}

/**
 * Dial codes that more than one country in the table shares, so the table
 * itself says which rather than a hardcoded '1' that goes stale the day
 * Kazakhstan or Jersey is added.
 *
 * A SHARED CODE CANNOT FILL IN THE COUNTRY. +1 is the United States and
 * Canada both; picking it tells us nothing about which, and the select would
 * have to choose — alphabetically Canada, so every American who did not scroll
 * the list would be filed as Canadian in the lead sheet. Better to leave the
 * box empty and let them say.
 */
const AMBIGUOUS = new Set(
  DIAL_CODES.map((c) => c.code).filter((code, i, all) => all.indexOf(code) !== i),
)

/**
 * Wire the field up: keep the hidden value current, keep the country code and
 * the Country box in step in both directions, and clear a stale error as soon
 * as it stops being true.
 */
export function initPhoneField(): void {
  for (const form of document.querySelectorAll<HTMLFormElement>('form[data-contact-form]')) {
    const f = find(form)
    if (!f) continue

    const country = form.querySelector<HTMLInputElement>('[name="country"]')

    /* Once they touch either box it is theirs. The other may still be empty at
       that point, and having it overwrite their answer a moment later is the
       kind of thing that looks like a bug and is impossible to argue with. */
    let codeIsTheirs = false

    /**
     * The other direction: picking a code writes the country, so choosing
     * "India +91" saves typing it out.
     *
     * IT OVERWRITES WHATEVER IS IN THE BOX. The first version only wrote into
     * an EMPTY box, on the reasoning that clobbering what somebody typed is
     * rude. In practice the box is rarely empty -- browsers autofill it, and
     * our own guess() may have put a name there a moment earlier -- so the
     * common case was picking India and watching Country go on saying
     * Iceland. Reported as a bug on the day it shipped, and it was one.
     *
     * Choosing from a dropdown OF COUNTRIES is an unambiguous statement of
     * country; the free-text box is the weaker, derived field. So the pick
     * wins, and anybody who disagrees retypes the box, which is one action
     * and visible. A silent mismatch between the two is not.
     *
     * NEVER FOR A SHARED CODE: +1 cannot say whether it meant the United
     * States or Canada, so it leaves the box alone rather than guessing.
     *
     * Writing .value programmatically fires no `input` event, so this cannot
     * bounce back through the Country listener and start a loop.
     */
    const fillCountry = (): void => {
      if (!country) return
      const picked = DIAL_CODES.find((c) => c.iso === f.code.value)
      if (!picked || AMBIGUOUS.has(picked.code)) return
      country.value = picked.name
    }

    f.code.addEventListener('change', () => {
      codeIsTheirs = true
      fillCountry()
      /* Through sync rather than composing straight into the hidden input, so
         picking a code also clears a "choose the country code" that has just
         stopped being true. */
      sync()
    })

    const sync = (): void => {
      f.hidden.value = compose(f)
      /* Only ever clear an error here, and only once the thing it says has
         stopped being true. Raising one while somebody is partway through
         typing a valid number tells them they are wrong for every keystroke up
         to the sixth.
         WHICH MESSAGE IS SHOWING MATTERS. "Please add your number" stops being
         true at the first digit, long before the number is long enough; left
         to the length rule it would sit there accusing them of an empty field
         while they looked at five digits they had just typed. */
      const showing = f.error.textContent
      if (!showing) return
      const { code, national } = parts(f)
      const inRange = national.length >= MIN_DIGITS && national.length <= MAX_DIGITS
      const stale =
        (showing === MSG_EMPTY && national) || (showing === MSG_CODE && code)
      if ((code && inRange) || stale) setError(f, '')
    }
    f.number.addEventListener('input', sync)
    f.number.addEventListener('blur', sync)

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
      /* A browser autofilling the country on load never fires `input`, so the
         code would otherwise stay on the placeholder beside a filled-in
         country. */
      guess()
    }
  }
}
