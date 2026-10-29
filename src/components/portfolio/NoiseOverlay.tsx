const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/** Animated film-grain overlay across the whole experience. */
export default function NoiseOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[125] overflow-hidden">
      <div
        className="absolute -inset-[100%] opacity-[0.05] [animation:grain_8s_steps(10)_infinite]"
        style={{ backgroundImage: NOISE_SVG }}
      />
    </div>
  );
}
