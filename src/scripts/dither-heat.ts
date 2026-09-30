/**
 * The graphic element "9a · Dither heat".
 *
 * Ported from the handoff's `dither-heat.js` (bundle "Final-Roars_2", 30 Sep).
 * THE BAYER MATRIX, THE NOISE, THE FALLOFF MATHS AND EVERY CONSTANT ARE
 * VERBATIM from that file. The handoff calls itself high-fidelity — "colours,
 * falloff maths, dither matrix, cell size and source positions are final" — so
 * a number changed here is a number that no longer matches what was signed
 * off. The wrapper is rewritten to this repo's conventions: TypeScript, an
 * `init*()` that returns early when its markup is absent, a component script
 * rather than a global on `window`.
 *
 * IT REPLACES TWO THINGS, and the handoff is explicit about both:
 *   8a, the hairline rings behind the Projects cards, on every dark section
 *       ground that used them — `mode="bg"`.
 *   7b, the "Sweep" rings over photographs, on every photo hero, banner and
 *       thumbnail that used them — `mode="photo"`.
 * Same effect either way: a graphite 8x8 Bayer dither heat field rising from
 * an off-frame source, turning Roars yellow only at the hottest edge. It comes
 * from the 3a header and sits on the same warm near-black as the 2e footer, so
 * headers, sections, photos and the footer read as one system.
 *
 * NOT ON PRODUCT SCREENSHOTS OR UI IMAGES. On a listing the effect stays on
 * the section ground behind the cards, which was 8a's rule too.
 *
 * A STATIC PAINT, NOT A LOOP. It draws once and costs nothing afterwards —
 * under 20ms at 1440x900 — which is why there is no rAF here and nothing for
 * prefers-reduced-motion to switch off. It repaints only when the box changes:
 * on load, after fonts, and on a debounced resize.
 *
 * ONE CANVAS PIXEL PER CSS PIXEL, deliberately. The dither is meant to read
 * chunky; backing it at devicePixelRatio would smooth it into a gradient and
 * lose the whole point.
 */

/* The 8x8 Bayer matrix, normalised to 0-1 thresholds. */
const BASE = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
]
const B = new Float32Array(64)
for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) B[y * 8 + x] = (BASE[y][x] + 0.5) / 64

const hash = (x: number, y: number): number => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

const vnoise = (x: number, y: number): number => {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  let fx = x - ix
  let fy = y - iy
  fx = fx * fx * (3 - 2 * fx)
  fy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
}

const fbm = (x: number, y: number): number =>
  0.5 * vnoise(x, y) + 0.3 * vnoise(x * 2.1 + 5, y * 2.1 + 9) + 0.2 * vnoise(x * 4.3 + 11, y * 4.3 + 3)

const TOKENS = {
  /** Dot colour on a section ground. */
  graphiteBg: '#35342D',
  /** Lighter, so it still reads over a darkened photograph. */
  graphitePhoto: '#5E5A4B',
  yellow: '#FFD400',
}

function paintOne(c: HTMLCanvasElement): void {
  const host = c.parentElement
  if (!host) return
  const W = host.clientWidth
  const H = host.clientHeight
  if (!W || !H) return

  c.width = W
  c.height = H
  const ctx = c.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)

  const photo = c.dataset.mode === 'photo'
  const px = Number(c.dataset.px) || 4
  const sx = Number(c.dataset.sx) * W
  const sy = Number(c.dataset.sy) * H
  const far = Math.max(
    Math.hypot(sx, sy),
    Math.hypot(W - sx, sy),
    Math.hypot(sx, H - sy),
    Math.hypot(W - sx, H - sy),
  )
  /* Falloff radius as a fraction of the distance to the farthest corner. */
  const R = photo ? 0.32 : 0.33
  const G = photo ? TOKENS.graphitePhoto : TOKENS.graphiteBg

  for (let j = 0; j < H; j += px) {
    for (let i = 0; i < W; i += px) {
      const cx = i + px / 2
      const cy = j + px / 2
      const dn = Math.hypot(cx - sx, cy - sy) / far
      const e = Math.exp(-Math.pow(dn / R, 2))
      /* Noise scale fixed in CSS px, so the texture is the same size at every
         breakpoint rather than stretching with the box. */
      const n = fbm(cx / 170, cy / 170)
      const heat = e * (1.15 + (n - 0.5) * 1.1) - 0.06
      const g = heat * (photo ? 0.7 : 0.85)
      /* Yellow only at the hottest edge, and it wins over graphite. */
      const y = photo ? (heat - 0.95) * 2.2 : (heat - 0.72) * 2.4
      const th = B[((j / px) % 8) * 8 + ((i / px) % 8)]
      if (y > th) ctx.fillStyle = TOKENS.yellow
      else if (g > th) ctx.fillStyle = G
      else continue
      /* px - 1: the 1px gap is what gives the dot-grid read. */
      ctx.fillRect(i, j, px - 1, px - 1)
    }
  }
}

/** Repaint every heat canvas under `root`, or the whole document. */
export function paintDitherHeat(root?: ParentNode): void {
  ;(root ?? document).querySelectorAll<HTMLCanvasElement>('canvas[data-dither-heat]').forEach(paintOne)
}

/**
 * Paint on mount and whenever the boxes can have moved.
 *
 * `load` matters as much as mount: several of these sit under photographs, and
 * an image-driven height is not settled until the image has arrived. Fonts
 * matter for the same reason on a text-driven band. Resize is debounced at
 * 150ms, which is the handoff's own figure.
 */
export function initDitherHeat(): void {
  if (!document.querySelector('canvas[data-dither-heat]')) return

  const paint = (): void => paintDitherHeat()
  paint()

  if (document.readyState !== 'complete') window.addEventListener('load', paint, { once: true })
  if (document.fonts?.ready) void document.fonts.ready.then(paint)

  let t = 0
  window.addEventListener('resize', () => {
    clearTimeout(t)
    t = window.setTimeout(paint, 150)
  })

  /* A band can also change height without the window resizing — a reveal
     landing, a card grid rewrapping — and a heat field painted against the old
     height leaves a hard edge where the canvas stops. */
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const canvas = entry.target.querySelector<HTMLCanvasElement>(':scope > canvas[data-dither-heat]')
        if (canvas) paintOne(canvas)
      }
    })
    document
      .querySelectorAll<HTMLCanvasElement>('canvas[data-dither-heat]')
      .forEach((c) => c.parentElement && ro.observe(c.parentElement))
  }
}
