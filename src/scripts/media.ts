/**
 * Hide images that fail to load.
 *
 * Every photograph on the site is served from /wp-content/uploads/ on the
 * webspace, not from this build. Until that directory is uploaded they 404,
 * and a 404'd <img> paints a broken-file icon and its alt text — which is why
 * the Projects card was showing "Parqly." in the corner over a broken glyph.
 *
 * An empty slot is the honest state for a picture that is not there yet. The
 * element keeps its width and height, so nothing reflows when the files land.
 */
/** 1x1 transparent GIF. Swapping the src is what stops the broken-file glyph
 *  and the alt text painting. Hiding the element did that too, but it took
 *  the element's background with it — and several slots are drawn in the
 *  design as a filled circle (the avatar cluster, the founder chip). Those
 *  discs are the composition, not the photograph, so they stay. Slots with no
 *  background still read as empty. */
const BLANK =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export function initMedia(): void {
  const hide = (img: HTMLImageElement) => {
    img.classList.add('is-missing')
    img.src = BLANK
  }
  for (const img of document.querySelectorAll<HTMLImageElement>('img')) {
    if (img.complete && img.naturalWidth === 0) hide(img)
    else img.addEventListener('error', () => hide(img), { once: true })
  }
}
