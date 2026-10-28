/* Shared types, constants & helpers for the portfolio experience */

export type ProjectDTO = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  year: string;
  tags: string[];
  imageUrl: string;
  accent: string;
  likes: number;
  views: number;
};

export type EntryDTO = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_POWER: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const NAV_LINKS = [
  { label: "Works", id: "#works" },
  { label: "About", id: "#about" },
  { label: "Services", id: "#services" },
  { label: "Guestbook", id: "#guestbook" },
  { label: "Contact", id: "#contact" },
];

export const PERSONA = {
  firstName: "ARJUN",
  lastName: "MEHTA",
  name: "Arjun Mehta",
  role: "Creative Developer & Digital Designer",
  location: "Bengaluru, India",
  coords: "12.9716° N — 77.5946° E",
  email: "hello@arjunmehta.dev",
  availability: "Open for select projects",
};

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com" },
  { label: "X / Twitter", href: "https://x.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

type LenisLike = {
  scrollTo: (target: string | number, opts?: Record<string, unknown>) => void;
  stop: () => void;
  start: () => void;
};

export function getLenis(): LenisLike | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { __lenis?: LenisLike | null }).__lenis ?? null;
}

export function scrollToId(id: string) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(id, { duration: 1.5 });
  } else {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }
}

export function timeAgo(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}
