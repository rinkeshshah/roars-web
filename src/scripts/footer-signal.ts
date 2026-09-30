/**
 * The footer ground: design ref "2e · Signal line".
 *
 * Ported from the handoff's `footer-signal.js` (bundle
 * "Final-Roars_1", 30 Sep). THE SHADER SOURCE, THE CANVAS-2D DRAW AND EVERY
 * CONSTANT ARE VERBATIM from that file. The handoff calls itself
 * high-fidelity — "colours, the shader maths, timing and the line position
 * are final, match them exactly" — so a number changed here is a number that
 * no longer matches what was signed off. The wrapper around them is rewritten
 * to this repo's conventions: TypeScript, an `init*()` that returns early when
 * its markup is absent, and a component script rather than a global on
 * `window`.
 *
 * WHAT IT DRAWS. A warm near-black ground, and one dotted waveform running
 * between the "roars" wordmark and the legal row. The line hums under the
 * wordmark and turns Roars yellow there; a pointer crossing it spikes it like
 * an oscilloscope. It is the quiet companion to the two header fields — same
 * dither, same graphite-to-yellow ladder, deliberately much subtler.
 *
 * TWO RENDERERS, ONE DESIGN. At 768px and up it is a WebGL fragment shader,
 * drawn at 2/3 of CSS size and upscaled so each dither cell lands near 4.5
 * CSS px. Below 768 it is Canvas 2D at devicePixelRatio capped at 2, re-tuned
 * for a 390px column. WebGL missing falls back to the 2D path. A canvas can
 * hold only one context type, so switching modes swaps the element.
 *
 * THE LINE IS MEASURED, NEVER HARD-CODED. Its y is the midpoint between the
 * wordmark's bottom and the legal row's top; the wave's x centre is the
 * wordmark's centre. Both are read live, which is what makes it land
 * correctly at every width. It re-measures on resize and again after
 * `document.fonts.ready`, because the wordmark's height depends on Inter
 * having loaded.
 */

const MOBILE_BP = 768

/**
 * THE DOTTED WAVEFORM IS OFF. `SIGNAL_MARKS = false` below, and that is a
 * deliberate departure from the handoff, asked for repeatedly and in those
 * words: the dots in the footer should not be there.
 *
 * It is worth writing down WHY it was argued about, so nobody re-adds them
 * reading the design ref. Our render was faithful — the handoff's own
 * `footer-2e-reference.html` puts the same band of dots under the wordmark,
 * spreading most of the page width, because the glow term below
 * (`f = max(f, .3 * exp(-dd * 55 / K) * ...)`) keeps firing dither cells far
 * from the line itself. So this is not a bug being fixed. The design was seen
 * and rejected.
 *
 * THE GROUND IS UNTOUCHED. Everything that makes the footer's warm near-black
 * and its two radial pools is in `bg`, and `bg` still paints exactly as
 * delivered. Only the two `col = mix(...)` lines that lay graphite and yellow
 * marks over it are gated. Flip SIGNAL_MARKS back to true to restore the
 * handoff's footer verbatim — nothing else has to change.
 */
const SIGNAL_MARKS = false

/* eslint-disable -- shader source, kept byte-for-byte as delivered but for SIG */
const FS = `precision highp float;
uniform vec2 R; uniform float T; uniform vec2 M; uniform float MA; uniform float Y0; uniform float WX; uniform float K; uniform float SIG;
float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float b2(vec2 a){a=floor(a);return fract(dot(a,vec2(.5,a.y*.75)));}
float b4(vec2 a){return b2(.5*a)*.25+b2(a);}
float b8(vec2 a){return b4(.5*a)*.25+b2(a);}
void main(){
 float ar=R.x/R.y; float px=3.;
 vec2 g=floor(gl_FragCoord.xy/px)*px/R; float th=b8(gl_FragCoord.xy/px)+.001;
 vec2 u0=gl_FragCoord.xy/R; vec2 p0=vec2(u0.x*ar,u0.y);
 vec3 bg=vec3(.036,.035,.032);
 bg+=vec3(.05,.044,.022)*exp(-pow(length(p0-vec2(ar*.1,1.05))/.75,2.));
 bg+=vec3(.038,.032,.014)*exp(-pow(length(p0-vec2(ar*(WX+.02),.38))/.55,2.));
 bg*=1.-.28*smoothstep(.45,1.1,length((u0-vec2(.5,.55))*vec2(1.,1.3)));
 bg+=vec3(.06,.052,.024)*exp(-pow(length(p0-vec2(ar*.08,1.1))/.9,2.));
 bg+=vec3(.07,.058,.018)*exp(-pow((u0.y-Y0)/(.16*K),2.))*exp(-pow((u0.x-WX)/.34,2.));
 bg+=vec3(.03,.026,.012)*smoothstep(.6,1.,u0.x)*smoothstep(.3,1.,u0.y);
 bg+=(h1(gl_FragCoord.xy)-.5)*.006;
 float x=g.x; float env=exp(-pow((x-WX)/.2,2.));
 float y=Y0+K*(.018*env*sin(x*60.-T*2.2)*(.6+.4*sin(T*.7))+.006*sin(x*23.+T*.9));
 y+=K*MA*.05*exp(-pow((x-M.x)/.05,2.))*sin(x*140.-T*6.);
 float dd=abs(g.y-y);
 float f=.95*smoothstep(.006*K,0.,dd)*(.35+.65*env+MA*exp(-pow((x-M.x)/.08,2.)));
 f=max(f,.3*exp(-dd*55./K)*(.4+.6*env));
 f*=smoothstep(0.,.12,x)*smoothstep(1.,.88,x);
 f*=SIG;
 vec3 col=bg;
 col=mix(col,vec3(.19,.185,.16),step(th,f));
 col=mix(col,vec3(1.,.831,0.),step(th,f-.5));
 gl_FragColor=vec4(col,1.);
}`
/* eslint-enable */

const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'

/** The 4x4 Bayer matrix the mobile path dithers against. */
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

interface Metrics {
  yCss: number
  xCss: number
  w: number
  h: number
}

export interface FooterSignalHandle {
  destroy(): void
}

export function mountFooterSignal(
  footerEl: HTMLElement,
  markEl: HTMLElement,
  legalEl: HTMLElement,
): FooterSignalHandle {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    display: 'block',
    pointerEvents: 'none',
    zIndex: '0',
  })
  footerEl.prepend(canvas)

  /* Pointer in 0-1 space, y up. Position lerps 0.08 per frame, spike strength
     0.05 (0.06 on the 2D path). A touch that ends eases out 600ms later. */
  const P = { mx: 0.5, my: 0.5, tx: 0.5, ty: 0.5, a: 0, at: 0 }
  const onMove = (e: PointerEvent): void => {
    const r = footerEl.getBoundingClientRect()
    P.tx = (e.clientX - r.left) / r.width
    P.ty = 1 - (e.clientY - r.top) / r.height
    P.at = 1
  }
  const onLeave = (): void => {
    P.at = 0
  }
  const onUp = (): void => {
    setTimeout(() => {
      P.at = 0
    }, 600)
  }
  /* Only the marks react to the pointer, so with them off there is nothing for
     these to drive. Left wired up, they would run a listener on every mouse
     move across the footer to change a picture that cannot change. */
  if (SIGNAL_MARKS) {
    footerEl.addEventListener('pointermove', onMove)
    footerEl.addEventListener('pointerdown', onMove)
    footerEl.addEventListener('pointerleave', onLeave)
    footerEl.addEventListener('pointerup', onUp)
  }

  /* The footer is below the fold on every route, so it draws nothing until it
     is near the viewport. */
  let visible = true
  const io = new IntersectionObserver((es) => es.forEach((en) => (visible = en.isIntersecting)), {
    rootMargin: '100px',
  })
  io.observe(footerEl)

  let canvasRef: HTMLCanvasElement = canvas
  let mode: 'gl' | '2d' | null = null
  let gl: WebGLRenderingContext | null = null
  let u: Record<string, WebGLUniformLocation | null> | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let m: Metrics | null = null
  let raf = 0
  let t = 3
  let last = performance.now()

  const lineMetrics = (): Metrics => {
    const fb = footerEl.getBoundingClientRect()
    const mb = markEl.getBoundingClientRect()
    const lb = legalEl.getBoundingClientRect()
    return {
      yCss: (mb.bottom + lb.top) / 2 - fb.top,
      xCss: mb.left + mb.width / 2 - fb.left,
      w: fb.width,
      h: fb.height,
    }
  }

  const setupGL = (): boolean => {
    gl = canvasRef.getContext('webgl', { antialias: false })
    if (!gl) return false
    const sh = (type: number, src: string): WebGLShader => {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) console.error(gl!.getShaderInfoLog(s))
      return s
    }
    const pr = gl.createProgram()!
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS))
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(pr)
    gl.useProgram(pr)
    const b = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, b)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(pr, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const U = (n: string): WebGLUniformLocation | null => gl!.getUniformLocation(pr, n)
    u = { R: U('R'), T: U('T'), M: U('M'), MA: U('MA'), Y0: U('Y0'), WX: U('WX'), K: U('K'), SIG: U('SIG') }
    return true
  }

  const resize = (): void => {
    m = lineMetrics()
    const want: 'gl' | '2d' = m.w >= MOBILE_BP ? 'gl' : '2d'
    if (want !== mode) {
      /* A canvas holds one context type for its lifetime, so switching
         renderers means swapping the element rather than the context. */
      const fresh = canvasRef.cloneNode() as HTMLCanvasElement
      canvasRef.replaceWith(fresh)
      canvasRef = fresh
      mode = want
      gl = null
      ctx = null
      if (mode === 'gl' && !setupGL()) {
        mode = '2d'
        const f2 = canvasRef.cloneNode() as HTMLCanvasElement
        canvasRef.replaceWith(f2)
        canvasRef = f2
      }
      if (mode === '2d') ctx = canvasRef.getContext('2d')
    }
    if (mode === 'gl' && gl) {
      canvasRef.width = Math.round((m.w * 2) / 3)
      canvasRef.height = Math.round((m.h * 2) / 3)
      gl.viewport(0, 0, canvasRef.width, canvasRef.height)
    } else {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvasRef.width = Math.round(m.w * dpr)
      canvasRef.height = Math.round(m.h * dpr)
    }
    frame(performance.now(), true)
  }

  const drawGL = (): void => {
    if (!gl || !u || !m) return
    const W = canvasRef.width
    const H = canvasRef.height
    gl.uniform2f(u.R, W, H)
    gl.uniform1f(u.T, t)
    gl.uniform2f(u.M, P.mx, P.my)
    gl.uniform1f(u.MA, P.a)
    gl.uniform1f(u.Y0, 1 - m.yCss / m.h)
    gl.uniform1f(u.WX, m.xCss / m.w)
    /* Tuned at 1440x720. K keeps the line's amplitude constant in pixels
       however tall the footer actually is. */
    gl.uniform1f(u.K, 720 / m.h)
    gl.uniform1f(u.SIG, SIGNAL_MARKS ? 1 : 0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  const draw2D = (): void => {
    if (!ctx || !m) return
    const dpr = canvasRef.width / m.w
    const W = m.w
    const H = m.h
    const y0 = m.yCss
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#0A0A09'
    ctx.fillRect(0, 0, W, H)

    let g = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 1.3)
    g.addColorStop(0, 'rgba(92,82,36,.42)')
    g.addColorStop(1, 'rgba(92,82,36,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    ctx.save()
    ctx.translate(W * 0.5, y0)
    ctx.scale(1, 0.35)
    g = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 0.75)
    g.addColorStop(0, 'rgba(120,98,28,.38)')
    g.addColorStop(1, 'rgba(120,98,28,0)')
    ctx.fillStyle = g
    ctx.fillRect(-W, -W * 2, W * 2, W * 4)
    ctx.restore()

    g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0.55, 'rgba(0,0,0,0)')
    g.addColorStop(1, 'rgba(0,0,0,.35)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    /* The gradient ground above is the whole of the 2D path now. See
       SIGNAL_MARKS at the top: the dotted waveform below is switched off on
       both renderers, not just on WebGL, or phones would still show it. */
    if (!SIGNAL_MARKS) return

    const px = 3
    for (let x = 0; x < W; x += px) {
      const uu = x / W
      const env = Math.exp(-Math.pow((uu - 0.5) / 0.28, 2))
      let y =
        y0 +
        9 * env * Math.sin(uu * 26 - t * 2.2) * (0.6 + 0.4 * Math.sin(t * 0.7)) +
        2.5 * Math.sin(uu * 11 + t * 0.9)
      const pe = Math.exp(-Math.pow((uu - P.mx) / 0.06, 2)) * P.a
      y += 22 * pe * Math.sin(uu * 70 - t * 6)
      const edge = Math.min(1, uu / 0.08, (1 - uu) / 0.08)
      const inten = (0.35 + 0.65 * env + pe) * edge
      const cx = Math.floor(x / px)
      const cy = Math.floor(y / px)
      const th = (BAYER4[(cx % 4) + (cy % 4) * 4] + 0.5) / 16
      const yellow = inten * 0.95 - 0.5 > th
      ctx.fillStyle = yellow ? '#FFD400' : inten * 0.95 > th * 0.6 ? '#30302A' : 'rgba(48,48,42,.5)'
      ctx.fillRect(x, Math.round(y / px) * px - 1, 2, 2)
      if (inten > 0.5 && th < 0.5) {
        ctx.fillStyle = 'rgba(48,48,42,.8)'
        ctx.fillRect(x, Math.round(y / px) * px + px - 1, 2, 2)
      }
    }
  }

  function frame(now: number, force?: boolean): void {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if ((visible && !reduce) || force) {
      if (!reduce) t += force ? 0 : dt
      P.mx += (P.tx - P.mx) * 0.08
      P.my += (P.ty - P.my) * 0.08
      P.a += (P.at - P.a) * (mode === 'gl' ? 0.05 : 0.06)
      if (mode === 'gl') drawGL()
      else if (ctx) draw2D()
    }
    if (!force) raf = requestAnimationFrame(frame)
  }

  const ro = new ResizeObserver(() => resize())
  ro.observe(footerEl)
  /* The wordmark's height depends on Inter, and the line is placed from that
     height, so it has to be measured again once the face has landed. */
  if (document.fonts?.ready) void document.fonts.ready.then(() => resize())
  resize()
  /* NOTHING IN THE GROUND MOVES. `bg` in the shader reads R, Y0, WX and K and
     never T, and the 2D path's gradients are the same — only the marks were
     animated. With them off, `resize()` above has already drawn the finished
     picture, and starting a rAF loop would repaint that identical frame sixty
     times a second on every page of the site for as long as the footer is in
     view. So the loop only starts when there is something to animate. */
  if (SIGNAL_MARKS) raf = requestAnimationFrame(frame)

  return {
    destroy() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      footerEl.removeEventListener('pointermove', onMove)
      footerEl.removeEventListener('pointerdown', onMove)
      footerEl.removeEventListener('pointerleave', onLeave)
      footerEl.removeEventListener('pointerup', onUp)
      canvasRef.remove()
    },
  }
}

/**
 * Mount the footer ground, if this page has a footer.
 *
 * The wordmark and the legal row are what the line is placed from, so both
 * have to be present; without them there is nothing to measure against and
 * the line would land at an arbitrary height.
 */
export function initFooterSignal(): FooterSignalHandle | null {
  const footer = document.querySelector<HTMLElement>('[data-footer-signal]')
  if (!footer) return null
  const mark = footer.querySelector<HTMLElement>('[data-footer-wordmark]')
  const legal = footer.querySelector<HTMLElement>('[data-footer-legal]')
  if (!mark || !legal) {
    console.warn('footer-signal: no wordmark or legal row to place the line against.')
    return null
  }
  return mountFooterSignal(footer, mark, legal)
}
