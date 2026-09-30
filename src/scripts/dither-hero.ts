/**
 * The dither hero background. WebGL, no dependencies.
 *
 * Ported from the design handoff's `roars-dither-hero.js` (bundle
 * "Final-Roars", 28 Sep). THE SHADER SOURCE AND EVERY CONSTANT IN VARIANTS ARE
 * VERBATIM from that file — the colours, the ring speeds, the dither pitch and
 * the cursor easing are the design, not a reading of it, and a value changed
 * here is a value that no longer matches what was signed off. The wrapper
 * around them is rewritten to this repo's conventions: TypeScript, an
 * `init*()` that returns early when its markup is absent, and a component
 * script rather than a `<script src>` in `public/`.
 *
 * TWO VARIANTS, ONE SYSTEM. `roar-wave` is ink #0B0B0B on Roars yellow;
 * `carbon-heat` is graphite to yellow to warm white on #070706. Same Bayer
 * dither, colours inverted.
 *
 * ONLY `carbon-heat` IS MOUNTED TODAY. It carries every inner hero. `roar-wave`
 * was the homepage, and the homepage now runs design ref 1a "Calm Pulse"
 * instead — src/scripts/hero-pulse.ts — after the feedback that this field read
 * as loud. The variant stays here rather than being deleted: it is half of a
 * system, it is what 1a is measured against, and putting the homepage back on
 * it is a one-line change in src/pages/index.astro. If it is still unmounted
 * when the dust settles, drop it and take its shader string out of the inner
 * pages' bundle with it.
 *
 * WHAT IS NOT VERBATIM, and why:
 *  - `speed` is a mutable local. In the handoff `setSpeed` assigned to
 *    `opts.speed` while the loop read a captured `const`, so it silently did
 *    nothing.
 *  - `pointer-events: none` on the canvas, set from CSS. The canvas sits under
 *    the hero's content and must never take a tap.
 *  - the mount reports whether it got a context, so the caller can leave the
 *    canvas hidden and let the CSS ground show through instead of a flat fill.
 *
 * ONE PER PAGE. Each mount creates its own WebGL context and browsers cap how
 * many a document may hold, so `initDitherHero` mounts the first match and
 * warns about the rest rather than quietly dropping contexts.
 */

const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'

/**
 * ONE DELIBERATE CHANGE TO BOTH DELIVERED SHADERS, in `b2`: `mod(floor(a), 8.)`
 * where the handoff has `floor(a)`. Same fix and same reason as the note in
 * src/scripts/footer-signal.ts, which carries the full account.
 *
 * Short version: b2 is `fract(0.5*a.x + 0.75*a.y*a.y)`, and on a canvas this
 * tall a.y*a.y runs into six figures, where a float's spacing is coarse enough
 * that `fract` stops being a dither threshold and collapses into blocks. What
 * shows is a regular lattice at the Bayer tile's period. b2 is exactly periodic
 * with period 2 per axis and b4/b8 sample it at half and quarter scale, so
 * wrapping at 8 returns the identical value while keeping every intermediate
 * small enough for any GPU to evaluate exactly. Checked against the delivered
 * form across the whole coordinate range: maximum difference 0.
 *
 * These canvases are larger than the footer's, so they were more exposed to
 * this, not less.
 */
/* eslint-disable -- shader source, kept byte-for-byte as delivered but for the b2 wrap */
const SHADERS: Record<string, string> = {
  'roar-wave': "precision highp float;\nuniform vec2 R; uniform float T; uniform vec2 M; uniform float MA; uniform vec3 C1; uniform vec3 C2; uniform vec3 C3; uniform vec3 BG;\nfloat h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\nvec2 h2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}\nfloat ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y);}\nfloat fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*ns(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}\nvec3 pal(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(6.28318*(c*t+d));}\nfloat b2(vec2 a){a=mod(floor(a),8.);return fract(dot(a,vec2(.5,a.y*.75)));}\nfloat b4(vec2 a){return b2(.5*a)*.25+b2(a);}\nfloat b8(vec2 a){return b4(.5*a)*.25+b2(a);}\nvoid main(){\n vec2 uv=gl_FragCoord.xy/R; float ar=R.x/R.y; vec2 p=vec2(uv.x*ar,uv.y); vec2 m=vec2(M.x*ar,M.y);\n float md=length(p-m); vec3 col=vec3(0.);\n\n  float px=3.; vec2 g=floor(gl_FragCoord.xy/px)*px/R; vec2 gp=vec2(g.x*ar,g.y); float th=b8(gl_FragCoord.xy/px)+.001;\n  vec2 S=vec2(ar*.79,.47); vec2 S2=mix(vec2(ar*.6,.2+.08*sin(T*.4)),m,MA);\n  float d=length(gp-S)+.035*fbm(gp*3.+T*.2); float d2=length(gp-S2);\n  float amp=.55+.45*sin(d*4.5-T*1.8);\n  float w1=sin(d*44.-T*4.)*amp*exp(-d*1.3); float w2=sin(d2*44.-T*4.4)*exp(-d2*2.4)*(.35+.65*MA);\n  float f=smoothstep(-.1,.85,w1+w2)*.95; f=max(f,step(d,.075)); f=max(f,.5*step(d,.11)*step(.5,sin(d*140.)));\n  f*=smoothstep(.4,.6,uv.x);\n  col=mix(BG,C2,step(th,f));\n col+=(h1(gl_FragCoord.xy+fract(T)*97.)-.5)*.045;\n gl_FragColor=vec4(max(col,0.),1.);\n}",
  'carbon-heat': "precision highp float;\nuniform vec2 R; uniform float T; uniform vec2 M; uniform float MA; uniform vec3 C1; uniform vec3 C2; uniform vec3 C3; uniform vec3 BG;\nfloat h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\nvec2 h2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}\nfloat ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y);}\nfloat fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*ns(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}\nvec3 pal(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(6.28318*(c*t+d));}\nfloat b2(vec2 a){a=mod(floor(a),8.);return fract(dot(a,vec2(.5,a.y*.75)));}\nfloat b4(vec2 a){return b2(.5*a)*.25+b2(a);}\nfloat b8(vec2 a){return b4(.5*a)*.25+b2(a);}\nvoid main(){\n vec2 uv=gl_FragCoord.xy/R; float ar=R.x/R.y; vec2 p=vec2(uv.x*ar,uv.y); vec2 m=vec2(M.x*ar,M.y);\n float md=length(p-m); vec3 col=vec3(0.);\n\n  float px=4.; vec2 g=floor(gl_FragCoord.xy/px)*px/R; vec2 gp=vec2(g.x*ar,g.y);\n  float f=fbm(gp*2.2+vec2(T*.08,-T*.05)); f+=.35*fbm(gp*5.-T*.12);\n  f+=.9*exp(-pow(length(gp-vec2(ar*.74,.42))/.42,2.));\n  f+=MA*1.1*exp(-pow(length(gp-m)/.16,2.));\n  f=clamp((f-.55)*1.1,0.,1.);\n  float th=b8(gl_FragCoord.xy/px);\n  vec3 cool=C1, hot=C2, white=C3;\n  float l1=step(th,f), l2=step(th,f-.45), l3=step(th,f-.8);\n  col=cool*l1; col=mix(col,hot,l2); col=mix(col,white,l3);\n float lx=smoothstep(.02,.46,uv.x); col*=mix(.16,1.,lx);\n col*=mix(.55,1.,smoothstep(1.,.72,uv.y)*.5+.5*lx);\n col*=1.-.35*pow(length(uv-vec2(.62,.45)),2.);\n col+=(h1(gl_FragCoord.xy+fract(T)*97.)-.5)*.045;\n gl_FragColor=vec4(max(col,0.),1.);\n}",
}
/* eslint-enable */

export type DitherVariant = 'roar-wave' | 'carbon-heat'

interface Variant {
  shader: string
  colors: Record<'C1' | 'C2' | 'C3' | 'BG', [number, number, number]>
  cssBackground: string
  stillTime: number
  timeOffset: number
}

/** Linear 0–1 RGB, passed straight to the shader. No gamma conversion. */
export const VARIANTS: Record<DitherVariant, Variant> = {
  'roar-wave': {
    shader: 'roar-wave',
    colors: { C1: [1, 0.831, 0], C2: [0.043, 0.043, 0.043], C3: [0.043, 0.043, 0.043], BG: [1, 0.831, 0] },
    cssBackground: '#FFD400', // yellow; ink #0B0B0B
    stillTime: 6,
    timeOffset: 9 * 3.7, // the prototype's per-mode offset
  },
  'carbon-heat': {
    shader: 'carbon-heat',
    colors: { C1: [0.26, 0.25, 0.22], C2: [1, 0.831, 0], C3: [1, 0.98, 0.86], BG: [1, 0.831, 0] },
    cssBackground: '#070706',
    stillTime: 9,
    timeOffset: 2 * 3.7,
  },
}

export interface DitherOptions {
  variant?: DitherVariant
  /**
   * How far the mark colour goes toward its full strength, 0-1. 1 is the
   * design: ink #0B0B0B on yellow for roar-wave. Lower values lerp the mark
   * toward the ground, so the dots soften instead of thinning out — the
   * dither pattern, its density and its motion are all unchanged, only the
   * contrast of each cell drops.
   *
   * Done in the colour uniform rather than with CSS opacity on the canvas,
   * because the canvas is opaque and sits over GrainField: fading the element
   * would blend the shader with a different yellow underneath and lighten the
   * ground as well as the ink.
   */
  inkStrength?: number
  /** Whose pointer drives the cursor rings. Defaults to the canvas's parent. */
  hoverTarget?: HTMLElement
  /** Animation multiplier. 1 is the design. */
  speed?: number
  /** CSS pixels per drawing-buffer pixel. 1.5 is the design; lower is finer. */
  pixelScale?: number
  interactive?: boolean
  /** Force a single still frame. Defaults to prefers-reduced-motion. */
  static?: boolean
}

export interface DitherHandle {
  /** False when WebGL was unavailable and nothing is being drawn. */
  live: boolean
  setSpeed(x: number): void
  destroy(): void
}

export function mountDitherHero(canvas: HTMLCanvasElement, opts: DitherOptions = {}): DitherHandle {
  const v = VARIANTS[opts.variant ?? 'roar-wave']
  if (!v) throw new Error('Unknown dither variant ' + opts.variant)

  const PIXEL_SCALE = opts.pixelScale ?? 1.5
  const inkStrength = Math.min(1, Math.max(0, opts.inkStrength ?? 1))
  let speed = opts.speed ?? 1
  const interactive = opts.interactive ?? true
  const reduced = opts.static ?? matchMedia('(prefers-reduced-motion: reduce)').matches
  const hoverTarget: HTMLElement = opts.hoverTarget ?? canvas.parentElement ?? canvas

  canvas.style.imageRendering = 'pixelated'

  /* Set BEFORE the context is asked for, as the handoff does: with no WebGL
     the flat CSS colour is the fallback the design specifies. */
  canvas.style.background = v.cssBackground

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false })
  if (!gl) return { live: false, setSpeed() {}, destroy() {} }

  let prog: WebGLProgram
  let U: (n: string) => WebGLUniformLocation | null

  const build = (): void => {
    const sh = (type: number, src: string): WebGLShader => {
      const o = gl.createShader(type)!
      gl.shaderSource(o, src)
      gl.compileShader(o)
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o))
      return o
    }
    prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, SHADERS[v.shader]))
    gl.linkProgram(prog)
    gl.useProgram(prog)
    const b = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, b)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    U = (n) => gl.getUniformLocation(prog, n)
    /* The mark colours ease toward the ground; BG is the ground and stays put. */
    const toward = (c: [number, number, number]): [number, number, number] =>
      inkStrength >= 1
        ? c
        : [
            v.colors.BG[0] + (c[0] - v.colors.BG[0]) * inkStrength,
            v.colors.BG[1] + (c[1] - v.colors.BG[1]) * inkStrength,
            v.colors.BG[2] + (c[2] - v.colors.BG[2]) * inkStrength,
          ]
    for (const k of ['C1', 'C2', 'C3'] as const) gl.uniform3fv(U(k), toward(v.colors[k]))
    gl.uniform3fv(U('BG'), v.colors.BG)
  }
  build()

  /* The buffer is sized from CSS pixels on purpose, not devicePixelRatio: that
     is what keeps a dither cell the same physical size on every screen. */
  const resize = (): void => {
    const r = canvas.getBoundingClientRect()
    const w = Math.max(1, Math.round(r.width / PIXEL_SCALE))
    const h = Math.max(1, Math.round(r.height / PIXEL_SCALE))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    gl.viewport(0, 0, w, h)
  }

  /* Cursor in 0–1 UV space, y up. `m` eases toward `mt`, influence toward `mat`. */
  const st = {
    m: [0.72, 0.45],
    mt: [0.72, 0.45],
    ma: 0,
    mat: 0,
    t: 0,
    last: performance.now(),
    vis: true,
    raf: 0,
  }

  const draw = (t: number): void => {
    gl.uniform2f(U('R'), canvas.width, canvas.height)
    gl.uniform1f(U('T'), t)
    gl.uniform2f(U('M'), st.m[0], st.m[1])
    gl.uniform1f(U('MA'), st.ma)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  const onMove = (e: PointerEvent): void => {
    const r = hoverTarget.getBoundingClientRect()
    st.mt = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height]
    st.mat = 1
  }
  const onLeave = (): void => {
    st.mat = 0
  }
  if (interactive && !reduced) {
    hoverTarget.addEventListener('pointermove', onMove)
    hoverTarget.addEventListener('pointerleave', onLeave)
  }

  const loop = (now: number): void => {
    const dt = Math.min(0.05, (now - st.last) / 1000)
    st.last = now
    if (st.vis) {
      st.t += dt * speed
      st.m[0] += (st.mt[0] - st.m[0]) * 0.08
      st.m[1] += (st.mt[1] - st.m[1]) * 0.08
      st.ma += (st.mat - st.ma) * 0.05
      draw(st.t + v.timeOffset)
    }
    st.raf = requestAnimationFrame(loop)
  }

  const ro = new ResizeObserver(() => {
    resize()
    if (reduced) draw(v.stillTime)
  })
  ro.observe(canvas)
  /* The loop keeps its cadence but skips drawing off-screen. */
  const io = new IntersectionObserver((es) => es.forEach((en) => (st.vis = en.isIntersecting)), {
    rootMargin: '100px',
  })
  io.observe(canvas)
  const onVis = (): void => {
    st.last = performance.now()
  }
  document.addEventListener('visibilitychange', onVis)
  const onLost = (e: Event): void => {
    e.preventDefault()
    cancelAnimationFrame(st.raf)
  }
  const onRestored = (): void => {
    build()
    resize()
    if (reduced) draw(v.stillTime)
    else st.raf = requestAnimationFrame(loop)
  }
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)

  resize()
  draw(v.stillTime) // a frame before the loop, so the hero is never blank
  if (!reduced) st.raf = requestAnimationFrame(loop)

  return {
    live: true,
    setSpeed(x) {
      speed = x
    },
    destroy() {
      cancelAnimationFrame(st.raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      hoverTarget.removeEventListener('pointermove', onMove)
      hoverTarget.removeEventListener('pointerleave', onLeave)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}

/** Mount the first `[data-dither-hero]` on the page. */
export function initDitherHero(): DitherHandle | null {
  const nodes = document.querySelectorAll<HTMLCanvasElement>('canvas[data-dither-hero]')
  if (!nodes.length) return null
  if (nodes.length > 1) {
    console.warn(`dither-hero: ${nodes.length} on this page, mounting the first. One context per document.`)
  }

  const canvas = nodes[0]
  const variant = (canvas.dataset.ditherHero || 'roar-wave') as DitherVariant
  const scale = Number(canvas.dataset.pixelScale)
  const ink = Number(canvas.dataset.inkStrength)
  const noHover = canvas.dataset.interactive === 'false'

  /* STILL FRAME BELOW 1040, ANIMATED ABOVE IT.
   *
   * The loop is a requestAnimationFrame that never stops, redrawing a full
   * fragment shader for a background nobody is looking at. On a desktop that
   * is free; on a phone it is battery, and it is the movement that makes the
   * field compete with the copy on a narrow screen rather than sit behind it.
   * A still frame keeps the dither, the colour and the composition and costs
   * one draw.
   *
   * 1040 is the same breakpoint the canvas is reframed at, so a band either
   * gets the mobile treatment entire or none of it. `static` is the module's
   * own option and already means exactly this — it is what
   * prefers-reduced-motion switches on — so nothing new is being invented,
   * and a reader who wants motion off everywhere still gets it.
   *
   * Decided at mount, not watched: a phone does not cross 1040 in practice,
   * and a desktop window dragged narrow keeps animating, which is harmless.
   */
  const stillFrame = matchMedia('(max-width: 1040px)').matches

  const handle = mountDitherHero(canvas, {
    variant,
    pixelScale: Number.isFinite(scale) && scale > 0 ? scale : undefined,
    inkStrength: Number.isFinite(ink) ? ink : undefined,
    interactive: noHover ? false : undefined,
    static: stillFrame || undefined,
  })
  return handle
}
