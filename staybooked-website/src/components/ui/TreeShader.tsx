import { useEffect, useRef } from 'react'

/**
 * TreeShader — the hero's growth tree, drawn through a small WebGL shader.
 *
 * The tree image (Higgsfield render, or a procedural stand-in drawn here when
 * no image is given) is the texture. The shader:
 *  - sways the canopy gently (more at the top than the trunk),
 *  - sends warm pulses of light climbing the branches on a loop,
 *  - bends and lights the lines around the cursor (desktop),
 *  - keys the image's own background to the hero colour, so the tree sits on
 *    the panel with no box around it.
 * Pauses offscreen and in background tabs; reduced motion gets one still frame.
 */

const BG: [number, number, number] = [207 / 255, 180 / 255, 142 / 255] // --logo-fill
const INK: [number, number, number] = [20 / 255, 20 / 255, 20 / 255]
const GOLD: [number, number, number] = [1, 0.93, 0.78]

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
uniform float uImgAspect;
uniform vec3 uBg;
uniform vec3 uInk;
uniform vec3 uGold;

void main(){
  // contain-fit the square-ish image in the canvas
  float canvasAspect = uRes.x / uRes.y;
  vec2 uv = vUv;
  if (canvasAspect > uImgAspect) { uv.x = (uv.x - 0.5) * canvasAspect / uImgAspect + 0.5; }
  else { uv.y = (uv.y - 0.5) * uImgAspect / canvasAspect + 0.5; }

  // sway: the canopy moves, the trunk barely does
  float h = clamp(uv.y, 0.0, 1.0);
  uv.x += sin(uTime * 0.55 + uv.y * 3.2) * 0.006 * h * h;
  uv.y += sin(uTime * 0.4 + uv.x * 4.0) * 0.002 * h;

  // cursor: a soft lens that pushes the lines outward
  vec2 d = vUv - uMouse;
  d.x *= canvasAspect;
  float fall = exp(-dot(d, d) * 14.0) * uHover;
  uv -= normalize(d + 1e-5) * fall * 0.018;

  vec3 bg = uBg;
  vec4 tex = texture2D(uTex, uv);
  float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  // ink = how far this pixel is from the image's background
  float ink = clamp(length(tex.rgb - bg) * 2.6, 0.0, 1.0) * inside;
  vec3 col = mix(bg, mix(uInk, tex.rgb, 0.35), ink);

  // pulses of light climbing the branches
  float band = fract(uv.y * 1.35 - uTime * 0.16);
  float pulse = exp(-pow(band - 0.5, 2.0) * 90.0);
  float band2 = fract(uv.y * 0.9 - uTime * 0.11 + 0.37);
  pulse += 0.6 * exp(-pow(band2 - 0.5, 2.0) * 140.0);
  col += uGold * pulse * ink * 0.55;

  // cursor light on nearby branches
  col += uGold * fall * ink * 0.9;

  // soft edge so the canvas never shows a seam against the hero
  float edge = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x) * smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
  gl_FragColor = vec4(mix(bg, col, edge), 1.0);
}`

/** Procedural stand-in: a branching "growth" tree of ink lines with node dots. */
function drawStandIn(size = 1024): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  g.fillStyle = `rgb(${BG.map((v) => Math.round(v * 255)).join(',')})`
  g.fillRect(0, 0, size, size)
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  g.strokeStyle = '#141414'
  g.lineCap = 'round'
  const tips: [number, number][] = []
  const branch = (x: number, y: number, len: number, ang: number, w: number, depth: number) => {
    const x2 = x + Math.cos(ang) * len
    const y2 = y + Math.sin(ang) * len
    g.lineWidth = w
    g.beginPath()
    g.moveTo(x, y)
    // right-angle "circuit" kinks on the outer branches keep it from reading as a plant
    if (depth > 3 && rnd() > 0.5) g.lineTo(x2, y)
    g.lineTo(x2, y2)
    g.stroke()
    if (depth >= 8 || len < 6) {
      tips.push([x2, y2])
      return
    }
    const n = depth < 2 ? 2 : rnd() > 0.7 ? 3 : 2
    for (let i = 0; i < n; i++) {
      const spread = 0.42 + rnd() * 0.25
      const a = ang + (i - (n - 1) / 2) * spread + (rnd() - 0.5) * 0.18
      branch(x2, y2, len * (0.7 + rnd() * 0.12), a, Math.max(0.8, w * 0.68), depth + 1)
    }
  }
  branch(size / 2, size * 0.96, size * 0.2, -Math.PI / 2, 14, 0)
  g.fillStyle = '#141414'
  for (const [x, y] of tips) {
    if (rnd() > 0.55) {
      g.beginPath()
      g.arc(x, y, 3 + rnd() * 3, 0, Math.PI * 2)
      g.fill()
    }
  }
  return c
}

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
    const upload = (img: TexImageSource, aspect: number) => {
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.uniform1f(u('uImgAspect'), aspect)
      ready = true
    }
    if (src) {
      const img = new Image()
      img.onload = () => upload(img, img.naturalWidth / img.naturalHeight)
      img.onerror = () => upload(drawStandIn(), 1)
      img.src = src
    } else {
      upload(drawStandIn(), 1)
    }

    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(u('uRes'), canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Cursor eases toward its target so the lens trails, never snaps.
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, hover: 0, th: 0 }
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.tx = (e.clientX - r.left) / r.width
      mouse.ty = 1 - (e.clientY - r.top) / r.height
      mouse.th = e.pointerType === 'mouse' ? 1 : 0
    }
    const onLeave = () => (mouse.th = 0)
    const host = canvas.parentElement ?? canvas
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)

    let raf = 0
    const start = performance.now()
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!ready || !visible || document.hidden) return
      mouse.x += (mouse.tx - mouse.x) * 0.08
      mouse.y += (mouse.ty - mouse.y) * 0.08
      mouse.hover += (mouse.th - mouse.hover) * 0.06
      gl.uniform2f(u('uMouse'), mouse.x, mouse.y)
      gl.uniform1f(u('uHover'), mouse.hover)
      gl.uniform1f(u('uTime'), reduce ? 2.0 : (now - start) / 1000)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (reduce) cancelAnimationFrame(raf)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [src])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
