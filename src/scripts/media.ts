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
export function initMedia(): void {
  const hide = (img: HTMLImageElement) => img.classList.add('is-missing')
  for (const img of document.querySelectorAll<HTMLImageElement>('img')) {
    if (img.complete && img.naturalWidth === 0) hide(img)
    else img.addEventListener('error', () => hide(img), { once: true })
  }
}
