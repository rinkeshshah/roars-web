/**
 * Country dialling codes for the contact form's WhatsApp field.
 *
 * WHY A LIST AND NOT A LIBRARY. The field needs two things: a select of
 * country codes, and a way to guess one from whatever the visitor typed in the
 * Country box. libphonenumber does both and weighs several hundred kilobytes;
 * this page would be paying that for one field. A table is enough,
 * because nothing here needs to know that a number is valid FOR its country,
 * only that a country has a code and a number has a plausible length.
 *
 * SORTED BY NAME, with no favourites at the top. An office list ordered by
 * where Roars sits reads as a hint about where the visitor should be, and the
 * select is long enough that alphabetical is the only order anyone can scan.
 *
 * `aliases` exist because the Country field is free text, not a select — see
 * the note in contact-us.astro. Somebody types "USA", "U.K.", "Holland" or
 * "UAE", and each should still find its code. Matching is lowercased and
 * stripped of punctuation before it reaches here.
 *
 * NOT EXHAUSTIVE, and deliberately so: this covers the markets the site
 * actually takes enquiries from plus every country large enough to be a
 * surprise. Adding one is a line in this file; the field falls back to the
 * visitor picking from the list, which always works.
 */
export interface DialCode {
  /** ISO 3166-1 alpha-2, used as the option value so the select is stable. */
  iso: string
  /** Display name, as it appears in the select. */
  name: string
  /** Dial code, digits only, no plus. */
  code: string
  /** Extra spellings the Country field might carry. Lowercase, no punctuation. */
  aliases?: string[]
}

export const DIAL_CODES: DialCode[] = [
  { iso: 'AF', name: 'Afghanistan', code: '93' },
  { iso: 'AL', name: 'Albania', code: '355' },
  { iso: 'DZ', name: 'Algeria', code: '213' },
  { iso: 'AR', name: 'Argentina', code: '54' },
  { iso: 'AU', name: 'Australia', code: '61' },
  { iso: 'AT', name: 'Austria', code: '43' },
  { iso: 'BH', name: 'Bahrain', code: '973' },
  { iso: 'BD', name: 'Bangladesh', code: '880' },
  { iso: 'BE', name: 'Belgium', code: '32' },
  { iso: 'BR', name: 'Brazil', code: '55' },
  { iso: 'BG', name: 'Bulgaria', code: '359' },
  { iso: 'KH', name: 'Cambodia', code: '855' },
  { iso: 'CA', name: 'Canada', code: '1' },
  { iso: 'CL', name: 'Chile', code: '56' },
  { iso: 'CN', name: 'China', code: '86' },
  { iso: 'CO', name: 'Colombia', code: '57' },
  { iso: 'HR', name: 'Croatia', code: '385' },
  { iso: 'CY', name: 'Cyprus', code: '357' },
  { iso: 'CZ', name: 'Czechia', code: '420', aliases: ['czech republic'] },
  { iso: 'DK', name: 'Denmark', code: '45' },
  { iso: 'EG', name: 'Egypt', code: '20' },
  { iso: 'EE', name: 'Estonia', code: '372' },
  { iso: 'ET', name: 'Ethiopia', code: '251' },
  { iso: 'FI', name: 'Finland', code: '358' },
  { iso: 'FR', name: 'France', code: '33' },
  { iso: 'DE', name: 'Germany', code: '49', aliases: ['deutschland'] },
  { iso: 'GH', name: 'Ghana', code: '233' },
  { iso: 'GR', name: 'Greece', code: '30' },
  { iso: 'HK', name: 'Hong Kong', code: '852' },
  { iso: 'HU', name: 'Hungary', code: '36' },
  { iso: 'IS', name: 'Iceland', code: '354' },
  { iso: 'IN', name: 'India', code: '91', aliases: ['bharat'] },
  { iso: 'ID', name: 'Indonesia', code: '62' },
  { iso: 'IQ', name: 'Iraq', code: '964' },
  { iso: 'IE', name: 'Ireland', code: '353', aliases: ['eire', 'republic of ireland'] },
  { iso: 'IL', name: 'Israel', code: '972' },
  { iso: 'IT', name: 'Italy', code: '39', aliases: ['italia'] },
  { iso: 'JP', name: 'Japan', code: '81' },
  { iso: 'JO', name: 'Jordan', code: '962' },
  { iso: 'KE', name: 'Kenya', code: '254' },
  { iso: 'KW', name: 'Kuwait', code: '965' },
  { iso: 'LV', name: 'Latvia', code: '371' },
  { iso: 'LB', name: 'Lebanon', code: '961' },
  { iso: 'LT', name: 'Lithuania', code: '370' },
  { iso: 'LU', name: 'Luxembourg', code: '352' },
  { iso: 'MY', name: 'Malaysia', code: '60' },
  { iso: 'MT', name: 'Malta', code: '356' },
  { iso: 'MX', name: 'Mexico', code: '52' },
  { iso: 'MA', name: 'Morocco', code: '212' },
  { iso: 'NP', name: 'Nepal', code: '977' },
  { iso: 'NL', name: 'Netherlands', code: '31', aliases: ['holland', 'the netherlands'] },
  { iso: 'NZ', name: 'New Zealand', code: '64' },
  { iso: 'NG', name: 'Nigeria', code: '234' },
  { iso: 'NO', name: 'Norway', code: '47' },
  { iso: 'OM', name: 'Oman', code: '968' },
  { iso: 'PK', name: 'Pakistan', code: '92' },
  { iso: 'PE', name: 'Peru', code: '51' },
  { iso: 'PH', name: 'Philippines', code: '63' },
  { iso: 'PL', name: 'Poland', code: '48' },
  { iso: 'PT', name: 'Portugal', code: '351' },
  { iso: 'QA', name: 'Qatar', code: '974' },
  { iso: 'RO', name: 'Romania', code: '40' },
  { iso: 'SA', name: 'Saudi Arabia', code: '966' },
  { iso: 'RS', name: 'Serbia', code: '381' },
  { iso: 'SG', name: 'Singapore', code: '65' },
  { iso: 'SK', name: 'Slovakia', code: '421' },
  { iso: 'SI', name: 'Slovenia', code: '386' },
  { iso: 'ZA', name: 'South Africa', code: '27' },
  { iso: 'KR', name: 'South Korea', code: '82', aliases: ['korea'] },
  { iso: 'ES', name: 'Spain', code: '34', aliases: ['espana'] },
  { iso: 'LK', name: 'Sri Lanka', code: '94' },
  { iso: 'SE', name: 'Sweden', code: '46' },
  { iso: 'CH', name: 'Switzerland', code: '41' },
  { iso: 'TW', name: 'Taiwan', code: '886' },
  { iso: 'TZ', name: 'Tanzania', code: '255' },
  { iso: 'TH', name: 'Thailand', code: '66' },
  { iso: 'TR', name: 'Turkey', code: '90', aliases: ['turkiye'] },
  { iso: 'UG', name: 'Uganda', code: '256' },
  { iso: 'UA', name: 'Ukraine', code: '380' },
  {
    iso: 'AE',
    name: 'United Arab Emirates',
    code: '971',
    aliases: ['uae', 'dubai', 'abu dhabi', 'emirates'],
  },
  {
    iso: 'GB',
    name: 'United Kingdom',
    code: '44',
    aliases: ['uk', 'england', 'scotland', 'wales', 'northern ireland', 'great britain', 'britain'],
  },
  {
    iso: 'US',
    name: 'United States',
    code: '1',
    aliases: ['usa', 'us', 'united states of america', 'america'],
  },
  { iso: 'VN', name: 'Vietnam', code: '84' },
  { iso: 'ZW', name: 'Zimbabwe', code: '263' },
]

/** Lowercase, drop punctuation and collapse spaces, so "U.K." matches "uk". */
export function normaliseCountry(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Best guess at a country from free text. Exact name or alias only — no fuzzy
 * matching, because "nig" should not quietly become Nigeria while somebody is
 * still typing "Nigeria" and watching the code change under them.
 */
export function findDialCode(raw: string): DialCode | undefined {
  const q = normaliseCountry(raw)
  if (!q) return undefined
  return DIAL_CODES.find(
    (c) => normaliseCountry(c.name) === q || c.aliases?.includes(q),
  )
}
