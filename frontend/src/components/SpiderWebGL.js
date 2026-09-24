import { useEffect, useRef, useState } from "react";
import { getWebMetrics, buildWebGeometry } from "@/utils/webGeometry";
import { getPhase } from "@/utils/theme";
import { SpiderWebCanvas } from "./SpiderWebCanvas";

const VERT = `
attribute vec2 aPos;
attribute vec2 aDir;
attribute float aSeed;
attribute float aRFrac;
attribute float aKind;
attribute float aDup;
uniform float uTime;
uniform vec2 uCursor;
uniform float uJolt;
uniform vec2 uResolution;
uniform float uMaxR;
uniform float uAmp;
uniform float uVib;
uniform vec2 uLeafPos;
uniform float uLeafAge;
varying vec2 vTangent;
varying float vKind;
varying float vRFrac;
varying float vDist;
void main() {
  float r = aRFrac * uMaxR;
  float d = distance(uCursor, aPos);
  float boost = max(0.0, 1.0 - d / 150.0);
  float off = sin(uTime * 0.0012 + aSeed * 0.63 + r * 0.004) * uAmp * aRFrac;
  float elastic = exp(-3.0 * uJolt) * cos(12.0 * uJolt);
  off += elastic * 14.0 * aRFrac * sin(aSeed * 2.0 + r * 0.02);
  off += sin(uTime * 0.055 + aSeed * 3.1 + r * 0.05) * 2.4 * boost * uVib;
  float leafD = distance(uLeafPos, aPos);
  float leafEnv = exp(-2.5 * uLeafAge) * max(0.0, 1.0 - leafD / 130.0);
  off += sin(uLeafAge * 22.0) * 3.0 * leafEnv * uVib;
  vec2 normal = mix(aDir, vec2(aDir.y, -aDir.x), aKind);
  vec2 pos = aPos + aDir * off + normal * (aDup * 0.85);
  vTangent = mix(vec2(aDir.y, -aDir.x), aDir, aKind);
  vKind = aKind;
  vRFrac = aRFrac;
  vDist = d;
  vec2 clip = (pos / uResolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
varying vec2 vTangent;
varying float vKind;
varying float vRFrac;
varying float vDist;
uniform vec2 uLight;
uniform float uDay;
uniform float uDusk;
void main() {
  vec2 tg = normalize(vTangent + vec2(0.0001));
  vec2 lp = normalize(vec2(-uLight.y, uLight.x));
  float facing = abs(dot(tg, lp));
  float spec = pow(facing, 3.0);
  float base = mix(0.16, 0.115 + (1.0 - vRFrac) * 0.135, vKind);
  float g = exp(-(vDist * vDist) / 28800.0);
  float alpha = base + spec * 0.12 + g * (0.22 + spec * 0.5);
  vec3 cool = vec3(0.88, 0.93, 1.0);
  vec3 warm = vec3(1.0, 0.84, 0.58);
  vec3 nightCol = mix(cool, warm, clamp(g * spec * 1.4, 0.0, 1.0));
  vec3 dayCol = mix(
    vec3(0.22, 0.26, 0.33),
    vec3(0.62, 0.42, 0.14),
    clamp(g * spec * 1.4, 0.0, 1.0)
  );
  vec3 col = mix(nightCol, dayCol, uDay);
  col = mix(col, vec3(1.0, 0.72, 0.45), uDusk * 0.55);
  float a = mix(alpha, min(1.0, alpha * 1.5 + 0.02), uDay);
  gl_FragColor = vec4(col, a);
}
`;

export const SpiderWebGL = ({
  cursorRef,
  joltRef,
  onMetrics,
  reducedMotion,
}) => {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const leafRef = useRef({ x: -9999, y: -9999, t: -99000 });

  useEffect(() => {
    const onLeaf = (e) => {
      leafRef.current = { x: e.detail.x, y: e.detail.y, t: performance.now() };
    };
    window.addEventListener("leaf-land", onLeaf);
    return () => window.removeEventListener("leaf-land", onLeaf);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) {
      setFailed(true);
      return;
    }

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("web shader:", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setFailed(true);
      return;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("web program:", gl.getProgramInfoLog(prog));
      setFailed(true);
      return;
    }
    gl.useProgram(prog);

    const locs = {
      aPos: gl.getAttribLocation(prog, "aPos"),
      aDir: gl.getAttribLocation(prog, "aDir"),
      aSeed: gl.getAttribLocation(prog, "aSeed"),
      aRFrac: gl.getAttribLocation(prog, "aRFrac"),
      aKind: gl.getAttribLocation(prog, "aKind"),
      aDup: gl.getAttribLocation(prog, "aDup"),
      uTime: gl.getUniformLocation(prog, "uTime"),
      uCursor: gl.getUniformLocation(prog, "uCursor"),
      uJolt: gl.getUniformLocation(prog, "uJolt"),
      uResolution: gl.getUniformLocation(prog, "uResolution"),
      uMaxR: gl.getUniformLocation(prog, "uMaxR"),
      uAmp: gl.getUniformLocation(prog, "uAmp"),
      uVib: gl.getUniformLocation(prog, "uVib"),
      uLight: gl.getUniformLocation(prog, "uLight"),
      uDay: gl.getUniformLocation(prog, "uDay"),
      uDusk: gl.getUniformLocation(prog, "uDusk"),
      uLeafPos: gl.getUniformLocation(prog, "uLeafPos"),
      uLeafAge: gl.getUniformLocation(prog, "uLeafAge"),
    };

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const stride = 32;
    gl.enableVertexAttribArray(locs.aPos);
    gl.vertexAttribPointer(locs.aPos, 2, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(locs.aDir);
    gl.vertexAttribPointer(locs.aDir, 2, gl.FLOAT, false, stride, 8);
    gl.enableVertexAttribArray(locs.aSeed);
    gl.vertexAttribPointer(locs.aSeed, 1, gl.FLOAT, false, stride, 16);
    gl.enableVertexAttribArray(locs.aRFrac);
    gl.vertexAttribPointer(locs.aRFrac, 1, gl.FLOAT, false, stride, 20);
    gl.enableVertexAttribArray(locs.aKind);
    gl.vertexAttribPointer(locs.aKind, 1, gl.FLOAT, false, stride, 24);
    gl.enableVertexAttribArray(locs.aDup);
    gl.vertexAttribPointer(locs.aDup, 1, gl.FLOAT, false, stride, 28);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let vertCount = 0;
    let w = 0;
    let h = 0;
    let maxR = 1;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const m = getWebMetrics(w, h);
      maxR = m.maxR;
      onMetrics?.(m);
      const data = buildWebGeometry(m);
      vertCount = data.length / 8;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onLost = (e) => {
      e.preventDefault();
      setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    let raf;
    const draw = (t) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const c = cursorRef.current || { x: -9999, y: -9999 };
      gl.uniform1f(locs.uTime, t);
      gl.uniform2f(locs.uCursor, c.x, c.y);
      gl.uniform1f(
        locs.uJolt,
        joltRef.current ? (t - joltRef.current) / 1000 : 99
      );
      gl.uniform2f(locs.uResolution, w, h);
      gl.uniform1f(locs.uMaxR, maxR);
      gl.uniform1f(locs.uAmp, reducedMotion ? 0.9 : 3.2);
      gl.uniform1f(locs.uVib, reducedMotion ? 0 : 1);
      gl.uniform2f(locs.uLight, 0.66, -0.75);
      const dp = getPhase();
      gl.uniform1f(locs.uDay, dp);
      gl.uniform1f(locs.uDusk, 1 - Math.abs(1 - 2 * dp));
      const leaf = leafRef.current;
      gl.uniform2f(locs.uLeafPos, leaf.x, leaf.y);
      gl.uniform1f(locs.uLeafAge, (t - leaf.t) / 1000);
      if (dp > 0.5) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      } else {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      }
      gl.drawArrays(gl.LINES, 0, vertCount);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, [cursorRef, joltRef, onMetrics, reducedMotion]);

  if (failed) {
    return (
      <SpiderWebCanvas
        cursorRef={cursorRef}
        joltRef={joltRef}
        onMetrics={onMetrics}
        reducedMotion={reducedMotion}
      />
    );
  }

  return (
    <canvas ref={canvasRef} className="absolute inset-0" data-testid="web-canvas" />
  );
};
