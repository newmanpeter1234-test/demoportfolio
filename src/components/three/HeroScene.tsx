"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useInView } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Shaders — simplex-noise displaced blob with fresnel rim + wire skin */
/* ------------------------------------------------------------------ */

const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
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
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
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
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
varying vec3 vNormalV;
varying vec3 vViewDir;
varying float vDisp;
${SIMPLEX}
void main() {
  float t = uTime * 0.32;
  float n1 = snoise(normal * 1.55 + t);
  float n2 = snoise(normal * 4.1 - t * 0.55) * 0.32;
  float d = (n1 * 0.78 + n2) * uIntensity;
  vec3 p = position + normal * d;
  vDisp = d;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormalV = normalize(normalMatrix * normal);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying vec3 vNormalV;
varying vec3 vViewDir;
varying float vDisp;
void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormalV), normalize(vViewDir))), 2.3);
  float band = smoothstep(-0.55, 0.85, vDisp);
  vec3 col = mix(uColorA, uColorB, clamp(band * 0.5 + fresnel * 0.95, 0.0, 1.0));
  col += uColorB * fresnel * 0.22;
  gl_FragColor = vec4(col, uOpacity);
}
`;

type MouseRef = React.MutableRefObject<{ x: number; y: number }>;

function DistortBlob({ mouse }: { mouse: MouseRef }) {
  const group = useRef<THREE.Group>(null);
  const solidRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  const solidUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0.62 },
      uColorA: { value: new THREE.Color("#151517") },
      uColorB: { value: new THREE.Color("#C6F24E") },
      uOpacity: { value: 1 },
    }),
    []
  );
  const wireUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0.62 },
      uColorA: { value: new THREE.Color("#0A0A0B") },
      uColorB: { value: new THREE.Color("#C6F24E") },
      uOpacity: { value: 0.16 },
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const solidMat = solidRef.current?.material as THREE.ShaderMaterial | undefined;
    const wireMat = wireRef.current?.material as THREE.ShaderMaterial | undefined;
    if (solidMat) solidMat.uniforms.uTime.value = t;
    if (wireMat) wireMat.uniforms.uTime.value = t;

    const g = group.current;
    if (!g) return;
    const m = mouse.current;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, m.x * 0.55, 0.045);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -m.y * 0.4, 0.045);
    g.rotation.z += delta * 0.045;
  });

  return (
    <group ref={group}>
      <mesh ref={solidRef}>
        <icosahedronGeometry args={[1.55, 32]} />
        <shaderMaterial
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={solidUniforms}
        />
      </mesh>
      <mesh ref={wireRef} scale={1.035}>
        <icosahedronGeometry args={[1.55, 32]} />
        <shaderMaterial
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={wireUniforms}
          wireframe
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function StarField({ count = 1300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 2.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi) * 0.75;
    }
    return arr;
  }, [count]);

  // soft round glow sprite so particles never render as squares
  const dotTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.35, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.018;
      ref.current.rotation.x += delta * 0.006;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        map={dotTexture}
        color="#C6F24E"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Rig({ mouse }: { mouse: MouseRef }) {
  useFrame((state) => {
    const m = mouse.current;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, m.x * 0.7, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      -m.y * 0.45 + 0.1,
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * Hero WebGL scene — noise-displaced blob with fresnel lime rim,
 * floating particle field and a mouse-parallax camera rig.
 * Pauses rendering when scrolled out of view.
 */
export default function HeroScene({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const inView = useInView(wrapRef);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 1.8]}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <DistortBlob mouse={mouse} />
        <StarField />
        <Rig mouse={mouse} />
      </Canvas>
    </div>
  );
}
