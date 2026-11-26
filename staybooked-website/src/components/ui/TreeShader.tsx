import { useEffect, useRef } from 'react'

/**
 * TreeShader — the hero's growth tree, drawn through a small WebGL shader.
 *
 * A tree is generated once (seeded, so it's the same tree every visit) from
 * the bottom-right corner of the canvas. Each pixel stores how far along the
 * branches it sits from the root, so the shader can grow the tree outward
 * limb by limb, light up the growing tips, run pulses root-to-tip while it
 * holds, then fade and grow again. Sway and a cursor lens on top.
 * Pauses offscreen and in background tabs; reduced motion gets the full tree.
 */

const BG: [number, number, number] = [207 / 255, 180 / 255, 142 / 255] // --logo-fill
const INK: [number, number, number] = [20 / 255, 20 / 255, 20 / 255]
const GOLD: [number, number, number] = [1, 0.93, 0.78]

// One loop, in seconds
const GROW = 6.5
const HOLD = 4.5
const FADE = 1.4
const GAP = 0.6
const CYCLE = GROW + HOLD + FADE + GAP

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uHover;
uniform float uTime;
uniform float uGrow;
uniform float uFade;
uniform float uHold;
uniform float uImage;
uniform float uImgAspect;
uniform vec3 uBg;
uniform vec3 uInk;
uniform vec3 uGold;

void main(){
  float aspect = uRes.x / uRes.y;
  vec2 uv = vUv;
  // an image (if given) is contain-fit and anchored to the bottom-right corner
  if (uImage > 0.5) {
    if (aspect > uImgAspect) uv.x = 1.0 - (1.0 - uv.x) * aspect / uImgAspect;
    else uv.y = uv.y * uImgAspect / aspect;
  }

  // sway grows with distance from the root (bottom-right)
  vec2 fromRoot = (vUv - vec2(1.0, 0.0)) * vec2(aspect, 1.0);
  float reach = clamp(length(fromRoot) / 1.4, 0.0, 1.0);
  uv.x += sin(uTime * 0.6 + vUv.y * 3.0) * 0.005 * reach * reach;
  uv.y += sin(uTime * 0.45 + vUv.x * 4.0) * 0.003 * reach * reach;

  // cursor: a soft lens that pushes the lines outward
  vec2 d = vUv - uMouse;
  d.x *= aspect;
  float fall = exp(-dot(d, d) * 16.0) * uHover;
  uv -= normalize(d + 1e-5) * fall * 0.016;

  vec4 t = texture2D(uTex, uv);
  float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  float a; float g; float node;
  if (uImage > 0.5) {
    a = clamp(length(t.rgb - uBg) * 2.6, 0.0, 1.0) * inside;
    g = clamp(length((uv - vec2(1.0, 0.0)) * vec2(uImgAspect, 1.0)) / 1.3, 0.0, 1.0);
    node = 0.0;
  } else {
    a = t.r * inside;
    g = a > 0.01 ? t.g / t.r : 1.0;
    node = a > 0.01 ? t.b / t.r : 0.0;
  }

  // growth: only what the front has passed is drawn; the front itself glows
  float grown = 1.0 - smoothstep(uGrow - 0.018, uGrow, g);
  float tip = smoothstep(uGrow - 0.07, uGrow - 0.005, g) * grown;
  float ink = a * grown * uFade;

  vec3 col = mix(uBg, uInk, ink);
  col += uGold * tip * a * uFade * 0.95;

  // while the tree holds, light runs from the root out to the tips
  float band = fract(g * 1.6 - uTime * 0.32);
  float pulse = exp(-pow(band - 0.5, 2.0) * 70.0);
  col += uGold * pulse * ink * 0.6 * uHold;

  // nodes light up as the growth reaches them, and stay warm
  col = mix(col, uGold, node * ink * tip);

  // cursor light on nearby branches
  col += uGold * fall * ink * 0.8;

  // fade into the copy on the left and the sky at the top; the corner stays hard
  float edge = smoothstep(0.0, 0.28, vUv.x) * smoothstep(1.0, 0.9, vUv.y);
  gl_FragColor = vec4(mix(uBg, col, edge), 1.0);
}`

type Seg = { x1: number; y1: number; x2: number; y2: number; w: number; s: number }

/**
 * Generates the tree into a canvas sized to the hero. Channels:
 * R = coverage, G = coverage x distance-along-branches (0 root, 1 farthest tip),
 * B = coverage on node dots. Background is black (no coverage).
 */
function drawTree(W: number, H: number, dpr: number): HTMLCanvasElement {
  let seed = 11
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const segs: Seg[] = []
  const tips: { x: number; y: number; s: number; big: boolean }[] = []
  const UP = -Math.PI / 2

  // Grown in unit space from (0,0), then scaled to fit the canvas.
  const branch = (x: number, y: number, ang: number, len: number, w: number, depth: number, s: number) => {
    const steps = Math.max(3, Math.round(len / 4))
    const step = len / steps
    const bend = (rnd() - 0.5) * 0.05
    let a = ang
    for (let i = 0; i < steps; i++) {
      // gentle curve, plus a pull upward that weakens toward the twigs
      a += bend + (UP - a) * (depth === 0 ? 0.03 : depth < 3 ? 0.009 : 0.012)
      const nx = x + Math.cos(a) * step
      const ny = y + Math.sin(a) * step
      const ww = w * (1 - 0.28 * (i / steps))
      segs.push({ x1: x, y1: y, x2: nx, y2: ny, w: ww, s })
      x = nx
      y = ny
      s += step
    }
    if (depth >= 8 || len < 3.2) {
      tips.push({ x, y, s, big: false })
      return
    }
    if (depth >= 2 && depth <= 4 && rnd() > 0.55) tips.push({ x, y, s, big: true })
    const n = depth === 0 ? 3 : rnd() > 0.7 ? 3 : 2
    const spread = depth === 0 ? 0.5 : depth === 1 ? 0.48 : 0.36 + rnd() * 0.2
    // the crown leans left, away from the corner, so it stays on screen
    const lean = depth < 2 ? -0.14 : 0
    for (let k = 0; k < n; k++) {
      const off = lean + (k - (n - 1) / 2) * spread + (rnd() - 0.5) * 0.2
      const shrink = depth === 0 ? 0.5 + rnd() * 0.08 : 0.74 + rnd() * 0.08
      branch(x, y, a + off, len * shrink, w * 0.7, depth + 1, s)
    }
  }
  // trunk leans up and to the left, out of the corner
  branch(0, 0, UP - 0.12, 300, 12, 0, 0)

  let minX = 0, minY = 0, maxS = 1
  for (const sg of segs) {
    minX = Math.min(minX, sg.x2)
    minY = Math.min(minY, sg.y2)
    maxS = Math.max(maxS, sg.s)
  }
  for (const t of tips) maxS = Math.max(maxS, t.s)
  const rootX = W * 0.84
  const rootY = H * 1.01
  const k = Math.min((rootX - W * 0.03) / -minX, (rootY - H * 0.09) / -minY)
  const minW = 1.05 * dpr

  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!
  g.fillStyle = '#000'
  g.fillRect(0, 0, W, H)
  g.lineCap = 'round'
  // farther segments draw last so joints carry the later value
  segs.sort((p, q) => p.s - q.s)
  for (const sg of segs) {
    const gv = Math.round(Math.min(1, (sg.s + 2) / maxS) * 255)
    g.strokeStyle = `rgb(255,${gv},0)`
    g.lineWidth = Math.max(minW, (sg.w / 12) * H * 0.024)
    g.beginPath()
    g.moveTo(rootX + sg.x1 * k, rootY + sg.y1 * k)
    g.lineTo(rootX + sg.x2 * k, rootY + sg.y2 * k)
    g.stroke()
  }
  for (const t of tips) {
    if (!t.big && rnd() > 0.05) continue
    const gv = Math.round(Math.min(1, t.s / maxS) * 255)
    g.fillStyle = `rgb(255,${gv},255)`
    g.beginPath()
    g.arc(rootX + t.x * k, rootY + t.y * k, (t.big ? 4.2 : 2.6 + rnd() * 1.2) * dpr, 0, Math.PI * 2)
    g.fill()
  }
  return c
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 2.4)

export default function TreeShader({ src, className }: { src?: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: false })
    if (!gl) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const compile = (type: number, code: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, code)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = (n: string) => gl.getUniformLocation(prog, n)
    gl.uniform3fv(u('uBg'), BG)
    gl.uniform3fv(u('uInk'), INK)
    gl.uniform3fv(u('uGold'), GOLD)

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    let ready = false
    let dirty = true
    let useImage = false
    const upload = (img: TexImageSource, aspect: number, image: boolean) => {
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.uniform1f(u('uImgAspect'), aspect)
      gl.uniform1f(u('uImage'), image ? 1 : 0)
      ready = true
      dirty = true
    }

    let treeW = 0
    let treeH = 0
    const regrow = () => {
      if (useImage) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      upload(drawTree(canvas.width, canvas.height, dpr), canvas.width / canvas.height, false)
      treeW = canvas.width
      treeH = canvas.height
    }

    let regrowTimer = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(u('uRes'), canvas.width, canvas.height)
      dirty = true
      // redraw the tree when the box changes enough to show stretching
      const off = Math.abs(canvas.width - treeW) / (treeW || 1) + Math.abs(canvas.height - treeH) / (treeH || 1)
      if (!ready) regrow()
      else if (off > 0.06) {
        clearTimeout(regrowTimer)
        regrowTimer = window.setTimeout(regrow, 160)
      }
    }
    if (src) {
      useImage = true
      const img = new Image()
      img.onload = () => upload(img, img.naturalWidth / img.naturalHeight, true)
      img.onerror = () => {
        useImage = false
        regrow()
      }
      img.src = src
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Cursor eases toward its target so the lens trails, never snaps.
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, hover: 0, th: 0 }
    const host = canvas.closest('header') ?? canvas
    const onMove = (e: Event) => {
      const pe = e as PointerEvent
      const r = canvas.getBoundingClientRect()
      mouse.tx = (pe.clientX - r.left) / r.width
      mouse.ty = 1 - (pe.clientY - r.top) / r.height
      mouse.th = pe.pointerType === 'mouse' ? 1 : 0
    }
    const onLeave = () => (mouse.th = 0)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)

    let raf = 0
    let clock = 0 // only advances while the tree is on screen
    let last = performance.now()
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!ready || !visible || document.hidden) return
      if (reduce && !dirty) return
      dirty = false
      clock += dt
      const c = clock % CYCLE
      let grow = 1.08
      let fade = 1
      let hold = 0
      if (reduce) {
        // full tree, still
      } else if (c < GROW) {
        grow = easeOut(c / GROW) * 1.08
      } else if (c < GROW + HOLD) {
        hold = Math.min(1, (c - GROW) / 0.8)
      } else if (c < GROW + HOLD + FADE) {
        const f = (c - GROW - HOLD) / FADE
        fade = 1 - f * f
        hold = 1 - f
      } else {
        fade = 0
        grow = 0
      }
      mouse.x += (mouse.tx - mouse.x) * 0.08
      mouse.y += (mouse.ty - mouse.y) * 0.08
      mouse.hover += (mouse.th - mouse.hover) * 0.06
      gl.uniform2f(u('uMouse'), mouse.x, mouse.y)
      gl.uniform1f(u('uHover'), mouse.hover)
      gl.uniform1f(u('uTime'), reduce ? 2.0 : clock)
      gl.uniform1f(u('uGrow'), grow)
      gl.uniform1f(u('uFade'), fade)
      gl.uniform1f(u('uHold'), hold)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(regrowTimer)
      ro.disconnect()
      io.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [src])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
