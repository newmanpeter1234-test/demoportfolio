"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useInView } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Hero — "Orbit" scene                                               */
/*                                                                     */
/*  A calm, minimal composition: one smooth dark planet with a crisp   */
/*  lime rim (eclipse look), three thin orbital rings at gentle tilts, */
/*  two small satellites travelling along them and a soft halo glow.   */
/*  No noise displacement, no scattered particles — every element      */
/*  moves slowly and on purpose.                                       */
/* ------------------------------------------------------------------ */

const PLANET_VERTEX = /* glsl */ `
uniform float uTime;
varying vec3 vNormalV;
varying vec3 vViewDir;
void main() {
  float breathe = sin(uTime * 0.45) * 0.016;
  vec3 p = position * (1.0 + breathe);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormalV = normalize(normalMatrix * normal);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const PLANET_FRAGMENT = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uSheen;
uniform vec3 uRim;
varying vec3 vNormalV;
varying vec3 vViewDir;
void main() {
  vec3 n = normalize(vNormalV);
  vec3 v = normalize(vViewDir);
  float ndv = abs(dot(n, v));
  float fresnel = pow(1.0 - ndv, 2.6);   // wide, subtle rim tint
  float edge    = pow(1.0 - ndv, 7.5);   // crisp bright edge line
  float top = clamp(n.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(uBase, uSheen, top * 0.45);
  col = mix(col, uRim, fresnel * 0.5);
  col += uRim * edge * 0.9;
  gl_FragColor = vec4(col, 1.0);
}
`;

type MouseRef = React.MutableRefObject<{ x: number; y: number }>;

function Planet() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBase: { value: new THREE.Color("#0D0D0F") },
      uSheen: { value: new THREE.Color("#1D1D21") },
      uRim: { value: new THREE.Color("#C6F24E") },
    }),
    []
  );

  useFrame((state) => {
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh>
      <sphereGeometry args={[1.5, 96, 64]} />
      <shaderMaterial
        ref={mat}
        vertexShader={PLANET_VERTEX}
        fragmentShader={PLANET_FRAGMENT}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function Halo() {
  const tex = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, "rgba(198,242,78,0.20)");
      g.addColorStop(0.4, "rgba(198,242,78,0.07)");
      g.addColorStop(1, "rgba(198,242,78,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <sprite position={[0, 0, -1.4]} scale={[7.5, 7.5, 1]}>
      <spriteMaterial
        map={tex}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </sprite>
  );
}

function Ring({
  radius,
  tilt,
  color,
  opacity,
  tube = 0.01,
  speed,
  satellite,
}: {
  radius: number;
  tilt: [number, number, number];
  color: string;
  opacity: number;
  tube?: number;
  speed: number;
  satellite?: number;
}) {
  const spinner = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (spinner.current) spinner.current.rotation.z += delta * speed;
  });

  return (
    <group rotation={tilt}>
      <group ref={spinner}>
        <mesh>
          <torusGeometry args={[radius, tube, 8, 240]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity}
            depthWrite={false}
          />
        </mesh>
        {satellite ? (
          <mesh position={[radius, 0, 0]}>
            <sphereGeometry args={[satellite, 16, 16]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={Math.min(opacity + 0.5, 1)}
            />
          </mesh>
        ) : null}
      </group>
    </group>
  );
}

function OrbitSystem({ mouse }: { mouse: MouseRef }) {
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();
  const scale = size.width < 768 ? 0.66 : 1;

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const m = mouse.current;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, m.x * 0.16, 0.03);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -m.y * 0.1, 0.03);
    g.position.y = Math.sin(t * 0.4) * 0.05;
  });

  return (
    <group ref={group} scale={scale}>
      <Halo />
      <Planet />
      <Ring
        radius={2.35}
        tilt={[Math.PI / 2 + 0.14, 0, -0.06]}
        color="#C6F24E"
        opacity={0.85}
        tube={0.012}
        speed={0.28}
        satellite={0.05}
      />
      <Ring
        radius={2.9}
        tilt={[Math.PI / 2 - 0.22, 0.32, 0.1]}
        color="#F2F1EA"
        opacity={0.3}
        tube={0.009}
        speed={-0.16}
        satellite={0.035}
      />
      <Ring
        radius={3.45}
        tilt={[Math.PI / 2 + 0.35, -0.38, 0]}
        color="#F2F1EA"
        opacity={0.14}
        tube={0.008}
        speed={0.09}
      />
    </group>
  );
}

function Rig({ mouse }: { mouse: MouseRef }) {
  useFrame((state) => {
    const m = mouse.current;
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      m.x * 0.5,
      0.04
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      -m.y * 0.3 + 0.05,
      0.04
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * Hero WebGL scene — clean "orbit" composition:
 * smooth breathing planet with crisp lime rim, thin tilted rings with
 * travelling satellites, soft halo, and a gentle mouse-parallax rig.
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
        camera={{ position: [0, 0, 6.4], fov: 42 }}
        dpr={[1, 2]}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <OrbitSystem mouse={mouse} />
        <Rig mouse={mouse} />
      </Canvas>
    </div>
  );
}
