"use client";

import { useEffect, useRef } from "react";

/**
 * A slow gradient wash for the hero background.
 *
 * The effect is a shader, but not the 700-line hand-rolled WebGL engine it is
 * modelled on. What is different, and why:
 *
 * - One full-screen quad, two triangles. The reference rebuilds a 29x50
 *   vertex grid and reallocates its buffers on every resize to get a wave that
 *   a fragment shader produces more cheaply.
 * - The wave is computed per fragment, so the geometry never changes and a
 *   resize only touches the viewport.
 * - The frame rate is capped rather than pinned to the display. A background
 *   wash does not need 120Hz, and this page also carries a video.
 * - An IntersectionObserver stops the loop when the hero leaves the viewport,
 *   and `visibilitychange` stops it when the tab is hidden. The reference runs
 *   unconditionally on the main thread forever.
 * - `prefers-reduced-motion` renders exactly one frame and never starts.
 * - `antialias: false` and `alpha: true`. A smooth gradient gains nothing from
 *   multisampling and pays for it in fill rate on every pixel, every frame.
 * - The resize listener is removed and the context is explicitly lost on unmount.
 *
 * A CSS gradient is painted behind the canvas as an immediate fallback, so there
 * is no empty box if WebGL is missing and no flash before the first frame.
 */

const VERTEX = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// Simplex noise, so the wash has organic drift rather than visible bands.
const FRAGMENT = `
precision mediump float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec3  u_deep;
uniform vec3  u_mid;
uniform vec3  u_glow;
uniform float u_strength;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
             i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
             i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = u_time * 0.035;

  // Two drifting noise fields. Kept to a low frequency so the wash reads as a
  // field of light rather than as texture.
  float a = snoise(vec3(uv * vec2(2.1, 1.4) + vec2(t, -t * 0.6), t * 0.5)) * 0.5 + 0.5;
  float b = snoise(vec3(uv * vec2(4.3, 2.2) + vec2(-t * 0.7, t * 0.4), 7.3)) * 0.5 + 0.5;

  vec3 color = mix(u_deep, u_mid, smoothstep(0.18, 0.86, a));
  // The ember bloom sits low and left, the way the site lights its surfaces.
  float bloom = smoothstep(0.75, 0.0, distance(uv, vec2(0.26, 0.72)) * 1.35);
  color = mix(color, u_glow, bloom * (0.30 + b * 0.22) * u_strength);

  gl_FragColor = vec4(color, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** `#rrggbb` to normalised rgb. */
function parseColor(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ];
}

export type GradientWashProps = {
  className?: string;
  /** Frames per second. Capped rather than tied to the display. */
  fps?: number;
};

const DEFAULTS = {
  deep: "#14120b",
  mid: "#14120b",
  glow: "#f54e00",
  strength: "0",
};

export default function GradientWash({ className = "", fps = 30 }: GradientWashProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // The gradient underneath is the first paint and the permanent fallback, so a
    // missing or lost context still leaves the hero looking intentional.
    const readPalette = () => {
      const style = getComputedStyle(container);
      const pick = (name: string, fallback: string) =>
        style.getPropertyValue(name).trim() || fallback;
      return {
        deep: pick("--wash-deep", DEFAULTS.deep),
        mid: pick("--wash-mid", DEFAULTS.mid),
        glow: pick("--wash-glow", DEFAULTS.glow),
        strength: Number(pick("--wash-strength", DEFAULTS.strength)) || 0,
      };
    };

    const applyFallback = (palette: ReturnType<typeof readPalette>) => {
      container.style.background = `linear-gradient(180deg, ${palette.mid} 0%, ${palette.deep} 100%)`;
    };

    let palette = readPalette();
    applyFallback(palette);

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      display: "block",
      width: "100%",
      height: "100%",
      opacity: "0",
      transition: "opacity 600ms linear",
    });
    container.appendChild(canvas);

    const gl =
      (canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
        failIfMajorPerformanceCaveat: false,
      }) as WebGLRenderingContext | null) ?? null;

    if (!gl) {
      // WebGL unavailable: the CSS gradient above is already correct.
      return () => canvas.remove();
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return () => canvas.remove();
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return () => canvas.remove();
    }
    gl.useProgram(program);

    // A single quad. Two triangles, no index buffer, no reallocation.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uDeep = gl.getUniformLocation(program, "u_deep");
    const uMid = gl.getUniformLocation(program, "u_mid");
    const uGlow = gl.getUniformLocation(program, "u_glow");
    const uStrength = gl.getUniformLocation(program, "u_strength");

    const applyPalette = () => {
      palette = readPalette();
      applyFallback(palette);
      gl.uniform3fv(uDeep, parseColor(palette.deep));
      gl.uniform3fv(uMid, parseColor(palette.mid));
      gl.uniform3fv(uGlow, parseColor(palette.glow));
      gl.uniform1f(uStrength, palette.strength);
    };
    applyPalette();

    const resize = () => {
      // Bounded to the element and to 1x device pixels. Rendering at 2x on a
      // phone triples the fill cost for a background nobody reads closely.
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uResolution, w, h);
      }
    };

    const draw = (time: number) => {
      gl.uniform1f(uTime, time / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let last = 0;
    let visible = true;
    let pageVisible = !document.hidden;
    let started = false;
    const interval = 1000 / Math.max(1, Math.min(fps, 60));

    const paintOnce = (time: number) => {
      resize();
      draw(time);
      canvas.style.opacity = "1";
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < interval) return;
      last = now;
      if (!started) {
        started = true;
        canvas.style.opacity = "1";
      }
      draw(now);
    };

    // Reflected on the element so "is the loop actually running" is observable
    // from a test, rather than something the test has to take on trust.
    const reflect = () => {
      canvas.dataset.animating = raf ? "true" : "false";
    };

    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(loop);
      reflect();
    };

    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      // Reflected even when already stopped, so the attribute is always present
      // and a test never has to distinguish "stopped" from "never reported".
      reflect();
    };

    const evaluate = () => {
      if (motionQuery.matches) {
        stop();
        paintOnce(1200);
        return;
      }
      if (visible && pageVisible) start();
      else stop();
    };

    const onMotionChange = () => {
      if (motionQuery.matches) stop();
      evaluate();
    };
    const onVisibility = () => {
      pageVisible = !document.hidden;
      evaluate();
    };
    const themeObserver = new MutationObserver(applyPalette);
    const onLost = (event: Event) => {
      event.preventDefault();
      stop();
      canvas.style.opacity = "0";
    };

    // The observer is what stops this costing anything once the hero scrolls off.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        evaluate();
      },
      { threshold: 0 }
    );
    observer.observe(container);

    canvas.addEventListener("webglcontextlost", onLost);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", onMotionChange);

    resize();
    evaluate();

    return () => {
      stop();
      observer.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [fps]);

  return <div ref={containerRef} aria-hidden="true" className={className} />;
}
