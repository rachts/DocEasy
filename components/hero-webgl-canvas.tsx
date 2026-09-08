'use client'

import React, { useEffect, useRef } from 'react'

const VS_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FS_SOURCE = `
precision mediump float;

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Procedural grid and document lines
float drawDocument(vec2 p) {
  // Document bounds
  vec2 d = abs(p) - vec2(0.55, 0.75);
  float border = max(d.x, d.y);
  float doc = step(border, 0.0);

  // Text paragraph lines
  float lines = 0.0;
  for (float y = -0.45; y <= 0.45; y += 0.09) {
    float lineDist = abs(p.y - y);
    float inLineX = step(abs(p.x), 0.42);
    lines += step(lineDist, 0.012) * inLineX;
  }
  // Title header bar
  lines += step(abs(p.y - 0.58), 0.025) * step(abs(p.x), 0.42);

  return doc * (0.2 + lines * 0.8);
}

float drawImage(vec2 p) {
  // Circular aperture / image canvas
  vec2 d = abs(p) - vec2(0.65, 0.65);
  float border = max(d.x, d.y);
  float frame = step(border, 0.0);

  // Geometric lens circles
  float r = length(p);
  float circles = sin(r * 24.0 - u_time * 2.0);
  float halftone = sin(p.x * 40.0) * cos(p.y * 40.0);

  return frame * (0.3 + (circles * 0.4 + halftone * 0.3));
}

float drawSheet(vec2 p) {
  // Isometric angled sheet grid
  vec2 rot = vec2(p.x * 0.866 - p.y * 0.5, p.x * 0.5 + p.y * 0.866);
  vec2 grid = abs(fract(rot * 8.0 - 0.5) - 0.5);
  float line = step(min(grid.x, grid.y), 0.04);
  float border = step(max(abs(p.x) - 0.6, abs(p.y) - 0.7), 0.0);

  return border * (0.2 + line * 0.8);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

  // Mouse displacement ripple
  vec2 mouseNorm = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float mDist = length(uv - mouseNorm);
  float ripple = sin(mDist * 16.0 - u_time * 4.0) * exp(-mDist * 3.5) * 0.04;
  uv += normalize(uv - mouseNorm + 0.0001) * ripple;

  // Perspective 3D rotation
  vec2 center = uv - vec2(0.4, -0.05);
  float tilt = (u_mouse.x / u_resolution.x - 0.5) * 0.35;
  center.x -= center.y * 0.15;
  center.y += tilt * 0.2;

  // Morph cycle: PDF (0..1) -> IMAGE (1..2) -> SHEET (2..3)
  float t = mod(u_time * 0.4, 3.0);
  float val = 0.0;

  if (t < 1.0) {
    float f = smoothstep(0.0, 1.0, t);
    val = mix(drawDocument(center), drawImage(center), f);
  } else if (t < 2.0) {
    float f = smoothstep(1.0, 2.0, t);
    val = mix(drawImage(center), drawSheet(center), f);
  } else {
    float f = smoothstep(2.0, 3.0, t);
    val = mix(drawSheet(center), drawDocument(center), f);
  }

  // Industrial palette: Warm black #0C0A09, metallic warm stone #A8A29E, amber highlight #D97706
  vec3 bg = vec3(0.047, 0.039, 0.035);
  vec3 ink = vec3(0.98, 0.98, 0.976);
  vec3 accent = vec3(0.85, 0.55, 0.15);

  vec3 col = mix(bg, ink, val * 0.25);
  col += accent * (val * 0.12 * (0.5 + 0.5 * sin(u_time * 2.0)));

  // Soft vignette
  float vignette = 1.0 - smoothstep(0.5, 1.4, length(uv));
  col *= vignette;

  gl_FragColor = vec4(col, val * 0.75 * vignette);
}
`

export default function HeroWebGLCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isVisibleRef = useRef(true)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'low-power'
    })

    if (!gl) return

    // Compile helper
    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      return shader
    }

    const vs = compile(gl.VERTEX_SHADER, VS_SOURCE)
    const fs = compile(gl.FRAGMENT_SHADER, FS_SOURCE)
    if (!vs || !fs) return

    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    // Setup Quad geometry
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )

    const posLoc = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    // Uniform locations
    const resLoc = gl.getUniformLocation(prog, 'u_resolution')
    const timeLoc = gl.getUniformLocation(prog, 'u_time')
    const mouseLoc = gl.getUniformLocation(prog, 'u_mouse')

    let mouseX = window.innerWidth * 0.7
    let mouseY = window.innerHeight * 0.4
    let targetMouseX = mouseX
    let targetMouseY = mouseY

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetMouseX = e.clientX - rect.left
      targetMouseY = rect.height - (e.clientY - rect.top) // GL Y is flipped
    }

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) // Cap at 1.5 for GPU efficiency
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    // Visibility observer to pause when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(canvas)

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const startTime = performance.now()

    // Render loop (1 draw call per frame, <2.5ms GPU budget)
    const render = () => {
      if (isVisibleRef.current) {
        // Smooth lerp mouse
        mouseX += (targetMouseX - mouseX) * 0.08
        mouseY += (targetMouseY - mouseY) * 0.08

        const elapsed = (performance.now() - startTime) * 0.001
        gl.uniform1f(timeLoc, elapsed)
        gl.uniform2f(mouseLoc, mouseX, mouseY)

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      observer.disconnect()

      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-70 z-0"
    />
  )
}
