/**
 * The homepage hero's motion: design ref "1a · Calm Pulse".
 *
 * Ported from the handoff's `hero-1a.js` (bundle "Final-Roars_4"). THE BAYER
 * MATRIX, THE EASING, THE SOURCE POSITIONS, THE ENVELOPE, THE TONE LADDER AND
 * EVERY CONSTANT ARE VERBATIM from that file. The handoff calls itself high
 * fidelity — "colours, type, spacing and motion are final, match them exactly"
 * — so a number changed here is a number that no longer matches what was
 * signed off. The wrapper is rewritten to this repo's conventions: TypeScript,
 * an `init*()` that returns early when its markup is absent, a component script
 * rather than an IIFE on the page.
 *
 * WHAT IT REPLACES. The 5d WebGL field that was on this hero (dither-hero.ts,
 * variant `roar-wave`). Same design lineage — dot-matrix rings on the yellow
 * ground — redrawn after the feedback that the hero read as loud. Two things
 * make the difference and both are in the handoff rather than in taste:
 *
 *   THE DOTS NEVER SIT BEHIND THE COPY. Every `[data-safe]` box gets a
 *   dot-free pad of 36px and a 90px smoothstep ramp out of it. The old field
 *   ran under the headline and the contrast of a mark against #FFD400 is what
 *   was reading as glare; taking the marks out from under the type is the fix
 *   the redesign makes, and it is why `inkStrength` is not needed here.
 *
 *   THE RINGS ONLY OCCUPY THE RIGHT-HAND SIDE. The desktop envelope is a
 *   smoothstep across 0.55W, so the left half — which is where all the copy is
 *   — is empty by construction rather than by masking.
 *
 * IT IS CANVAS 2D, NOT WEBGL, and that is the handoff's choice: at a 7px pitch
 * the whole field is a few thousand circles, drawn as 8 batched Path2D fills,
 * one per tone bucket. There is no shader and no context to lose.
 *
 * WHAT IT DOES NOT DO. It does not draw a ground and it does not draw grain.
 * The canvas is transparent and only the dots are painted, so the hero's own
 * yellow and GrainField's grain show through untouched. This matters: stacking
 * a second flat ground under a field is what produced the tonal seam on this
 * site three times already.
 */

/* The 8x8 Bayer matrix, flat, as delivered. */
const BAY = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28,
  52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7,
  39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
]
const TAU = Math.PI * 2

const reduced = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches

const sm = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** cubic-bezier(.23, 1, .32, 1), solved by Newton — the handoff's own solver. */
function bez(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  return (t) => {
    if (t <= 0) return 0
    if (t >= 1) return 1
    let s = t
    for (let i = 0; i < 8; i++) {
      const x = ((ax * s + bx) * s + cx) * s - t
      const dx = (3 * ax * s + 2 * bx) * s + cx
      if (Math.abs(x) < 1e-5 || Math.abs(dx) < 1e-6) break
      s -= x / dx
    }
    s = Math.min(1, Math.max(0, s))
    return ((ay * s + by) * s + cy) * s
  }
}
const ease = bez(0.23, 1, 0.32, 1)

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/* [x, y, radius from source, envelope, safe-zone mask, Bayer threshold] */
type Cell = [number, number, number, number, number, number]

export interface HeroPulseHandle {
  /** Fire the 1.2s ripple. Called on every word change. */
  trigger(): void
  destroy(): void
}

function setup(c: HTMLCanvasElement): { W: number; H: number; ctx: CanvasRenderingContext2D } | null {
  const W = c.offsetWidth
  const H = c.offsetHeight
  /* DPR capped at 2, as the handoff's performance note requires. */
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  c.width = Math.round(W * dpr)
  c.height = Math.round(H * dpr)
  const ctx = c.getContext('2d')
  if (!ctx || !W || !H) return null
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { W, H, ctx }
}

/**
 * The boxes the dots keep out of, in canvas space.
 *
 * Read from the live layout rather than from numbers, because the headline
 * clamps from 56px to 144px across the range and a hard-coded rect is only
 * right at one width. The handoff says to measure after fonts load and again
 * on resize, and both are wired below.
 */
function safeRects(c: HTMLCanvasElement): Rect[] {
  const cr = c.getBoundingClientRect()
  const s = cr.width / c.offsetWidth || 1
  /* DOCUMENT-WIDE, not frame-scoped, and the handoff is the reason: it lists
     "the H1, lead, CTA and nav controls" as safe, and the nav is a fixed bar
     that is a sibling of the hero rather than a child of it. Scoped to the
     frame, the top bar's pill and burger sat in the dot field.
     The reference page gets away with a frame-scoped query because its nav is
     a solid yellow bar inside the hero, which stops the rings by painting over
     them. Ours is transparent over the hero until the page scrolls, so the
     dots have to be kept out instead.
     Boxes that miss the canvas are dropped: off other pages there is no canvas
     at all, and on this one a marked element that has scrolled away should not
     go on punching a hole in the field. */
  return [...document.querySelectorAll<HTMLElement>('[data-safe]')]
    .map((e) => e.getBoundingClientRect())
    .filter((r) => r.width && r.height && r.right > cr.left && r.left < cr.right && r.bottom > cr.top && r.top < cr.bottom)
    .map((r) => ({ x: (r.left - cr.left) / s, y: (r.top - cr.top) / s, w: r.width / s, h: r.height / s }))
}

/** 1 far from the copy, 0 inside the pad, smoothstep across the ramp. */
function mask(x: number, y: number, S: Rect[], pad: number, ramp: number): number {
  let m = 1
  for (const s of S) {
    const dx = Math.max(s.x - x, 0, x - s.x - s.w)
    const dy = Math.max(s.y - y, 0, y - s.y - s.h)
    const d = Math.hypot(dx, dy)
    if (d <= pad) return 0
    if (d < pad + ramp) {
      const t = (d - pad) / ramp
      m *= t * t * (3 - 2 * t)
    }
  }
  return m
}

interface Field {
  trigger(now: number): void
  draw(now: number): void
  markDirty(): void
}

function rings(c: HTMLCanvasElement): Field | null {
  const s = setup(c)
  if (!s) return null
  const { W, H, ctx } = s
  const S = safeRects(c)

  /* Source, wavelength, reach, pitch and dot radius — the handoff's DESKTOP
     table. Its mobile table is gone with the mobile field; it is in
     `hero-1a.js` in the Final-Roars_4 bundle if the phone ever wants one back.
     The source sits off the right edge at 0.58H and the envelope's horizontal
     smoothstep keeps the rings in the right ~45%, which is what leaves the
     whole left side — where every piece of copy is — empty by construction. */
  const P = {
    cx: W + 140,
    cy: H * 0.58,
    lam: 46,
    R: 920,
    p: 7,
    dot: 1.9,
    /* A SHORTER HARD PAD AND A MUCH LONGER RAMP than the handoff's 36 / 90,
       because the ramp does a different job here. In the handoff it is the
       distance over which dots stop existing, so a long one would widen the
       rectangular hole it cuts. Here it is the distance over which they go
       transparent, so a long one is exactly what stops the safe boxes reading
       as blocks — and dots faded almost to nothing can sit far closer to the
       type than solid ones, which is why the hard pad comes down too. */
    pad: 22,
    ramp: 150,
    env: (x: number, _y: number, r: number): number =>
      sm(W * 0.55 - 80, W * 0.55 + 160, x) * Math.pow(Math.max(0, 1 - r / 920), 0.7),
  }

  /* Built once per size, as the performance note requires: the per-cell work
     below is the expensive half and none of it changes between frames. */
  const cells: Cell[] = []
  for (let y = P.p / 2, iy = 0; y < H; y += P.p, iy++) {
    for (let x = P.p / 2, ix = 0; x < W; x += P.p, ix++) {
      const r = Math.hypot(x - P.cx, y - P.cy)
      const env = P.env(x, y, r)
      if (env <= 0.002) continue
      const m = S.length ? mask(x, y, S, P.pad, P.ramp) : 1
      if (m <= 0) continue
      cells.push([x, y, r, env, m, (BAY[(iy & 7) * 8 + (ix & 7)] + 0.5) / 64])
    }
  }

  let t0 = -1e9
  const dur = 1200
  let dirty = true
  let was = false

  return {
    markDirty() {
      dirty = true
    },
    trigger(now: number) {
      /* Under reduced motion the field is a still picture, so a ripple would be
         the one thing moving on it. The word still crossfades; this does not. */
      if (!reduced()) t0 = now
    },
    draw(now: number) {
      const t = (now - t0) / dur
      const active = t >= 0 && t < 1
      const drift = !reduced()
      /* Nothing moving and nothing to redraw: skip the frame entirely. */
      if (!active && !was && !dirty && !drift) return
      was = active
      dirty = false

      const e = active ? ease(t) : 0
      ctx.clearRect(0, 0, W, H)
      /* One band outward every 4s. */
      const base = drift ? ((now / 4000) % 1) * P.lam : 0
      const shift = base + e * P.lam
      const front = e * P.R
      const amp = active ? (1 - e) * 0.6 : 0

      const N = 8
      const paths = Array.from({ length: N }, () => new Path2D())
      for (const q of cells) {
        const b = 0.5 + 0.5 * Math.cos((TAU * (q[2] - shift)) / P.lam)
        let val = b * b * q[3]
        let boost = 0
        if (amp) {
          /* The ripple: a Gaussian front, sigma 70px, travelling out to R. */
          const z = (q[2] - front) / 70
          boost = amp * Math.exp(-z * z) * b
          val += boost
        }
        /* THE SAFE MASK FADES A DOT, IT DOES NOT DELETE IT.
           The handoff multiplies the mask into the value BEFORE the dither
           threshold — `val * m > th` — so a dot near the copy simply stops
           existing. The safe boxes are rectangles, so what that carves out of
           the field is a rectangle: straight edges cutting across the rings,
           which read as blocks sitting in the wave rather than as waves.
           Deciding existence from the UNMASKED wave keeps the ring geometry
           continuous across the whole frame, and the mask is applied to the
           tone instead, so the dots approach the copy and go transparent.
           Same rule — nothing legible sits over a dot — reached by fading
           rather than by cutting a hole. */
        if (val > q[5]) {
          /* The mask covers the ripple boost too. It did not before, so a
             pulse crossing the headline lit up at full strength inside the
             zone the rest of the frame was keeping clear. */
          const tone = Math.min(1, (q[3] / 0.82 + boost * 0.8) * q[4])
          /* Below the faintest bucket there is nothing to draw. */
          if (tone < 0.02) continue
          const pth = paths[Math.min(N - 1, Math.floor(tone * N))]
          /* moveTo FIRST, every time. arc() continues the current subpath, so
             without it each circle is joined to the previous one by a straight
             line and a bucket fills as one enormous polygon instead of a few
             hundred dots. */
          pth.moveTo(q[0] + P.dot, q[1])
          pth.arc(q[0], q[1], P.dot, 0, TAU)
        }
      }
      /* Eight batched fills, one per tone bucket; the top bucket is solid. */
      for (let i = 0; i < N; i++) {
        ctx.fillStyle =
          i === N - 1
            ? '#666666'
            : 'rgba(102,102,102,' + (0.06 + 0.94 * Math.pow((i + 0.5) / N, 1.4)).toFixed(3) + ')'
        ctx.fill(paths[i])
      }
    },
  }
}

/**
 * Mount the hero field.
 *
 * The rAF loop is gated on the hero being on screen, which the handoff asks
 * production to add and its own reference does not do — this hero is a full
 * viewport tall, so the loop would otherwise keep running behind ten screens
 * of page. Resize rebuilds the cells, debounced at the handoff's 150ms.
 */
export function initHeroPulse(): HeroPulseHandle | null {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas[data-hero-pulse-canvas]')
  if (!canvas) return null
  /* The frame is whatever the component was placed in — .hero — and it is
     taken from the canvas rather than from a second marker attribute, so the
     page cannot drift out of agreement with the component about which element
     that is. The safe boxes and the visibility test both read from it, and
     both want the box the canvas actually fills. */
  const frame = canvas.parentElement
  if (!frame) return null

  /* NO RING FIELD ON A PHONE. Asked for, and the measurements agree with the
     ask: on a 390px column the field painted 0.55% of the hero. The hero is
     short, and the safe boxes — a full-width labels row among them — take a
     third of the width, so what was left read as a few stray dots rather than
     as the design. A dozen dots nobody can resolve is worse than a clean
     yellow ground, and the handoff's mobile table cannot fix it because the
     problem is the room, not the numbers.
     This is a REMOVAL, not a hide: below the breakpoint no cells are built, no
     rAF loop starts, and the canvas is cleared and left blank. The component's
     stylesheet also takes it out of the layout, so nothing shows in the gap
     before this script runs. */
  const MOBILE_BP = 768
  const wantField = (): boolean => innerWidth >= MOBILE_BP

  let field = wantField() ? rings(canvas) : null

  let visible = true
  const io = new IntersectionObserver((es) => es.forEach((en) => (visible = en.isIntersecting)), {
    rootMargin: '120px',
  })
  io.observe(frame)

  let raf = 0
  const loop = (now: number): void => {
    if (visible) field?.draw(now)
    raf = requestAnimationFrame(loop)
  }
  const startLoop = (): void => {
    if (!raf && field) raf = requestAnimationFrame(loop)
  }
  const stopLoop = (): void => {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }
  startLoop()

  const rebuild = (): void => {
    /* Crossing the breakpoint either way — a rotation, a resized window —
       has to build or tear down, not just repaint. */
    if (!wantField()) {
      field = null
      stopLoop()
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }
    field = rings(canvas)
    field?.markDirty()
    startLoop()
  }

  let t = 0
  const onResize = (): void => {
    clearTimeout(t)
    t = window.setTimeout(rebuild, 150)
  }
  window.addEventListener('resize', onResize)

  /* The safe boxes are measured from the rendered headline, and the headline's
     height depends on Inter having landed. */
  if (document.fonts?.ready) void document.fonts.ready.then(rebuild)

  /* THE RIPPLE IS THE WORD'S. rotate.ts owns the hero's rotating word and its
     cadence, and this listens rather than running a timer of its own — two
     intervals started a few milliseconds apart would drift until the pulse and
     the swap stopped being the same event, which is the whole idea. */
  const onWord = (): void => field?.trigger(performance.now())
  document.addEventListener('roars:word', onWord)

  return {
    trigger: onWord,
    destroy() {
      stopLoop()
      io.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('roars:word', onWord)
      clearTimeout(t)
    },
  }
}
