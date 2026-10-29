import { PrismaClient } from "@prisma/client";

// Standalone script (runs outside Next.js): instantiate the client directly.
// DATABASE_URL is read from .env in the project root (absolute sqlite path).
const db = new PrismaClient();

const DAY = 24 * 60 * 60 * 1000;
const WEEK = 7 * DAY;

const projects: {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  year: string;
  tags: string;
  imageUrl: string;
  accent: string;
  likes: number;
  views: number;
  order: number;
}[] = [
  {
    slug: "nebula",
    title: "NEBULA",
    tagline: "A million-particle journey through a generative universe",
    description:
      "An immersive WebGL microsite for a space-tech launch. Custom GLSL shaders drive a million-particle nebula that reacts to cursor gravity, scroll velocity and device orientation — rendering at 60fps on mid-range mobiles.",
    category: "WebGL Experience",
    year: "2025",
    tags: "Three.js,GLSL,React,WebAudio",
    imageUrl: "/images/projects/nebula.png",
    accent: "#C6F24E",
    likes: 184,
    views: 3240,
    order: 1,
  },
  {
    slug: "aurora",
    title: "AURORA",
    tagline: "Liquid-metal commerce with zero-friction checkout",
    description:
      "Art-directed e-commerce build for a fashion house. Liquid chrome product transitions, magnetic cart drawer and a 98 Lighthouse score pushed conversion up 34% in the first quarter.",
    category: "E-Commerce",
    year: "2025",
    tags: "Next.js,Shopify,Motion,Tailwind",
    imageUrl: "/images/projects/aurora.png",
    accent: "#FF6B4A",
    likes: 132,
    views: 2187,
    order: 2,
  },
  {
    slug: "pulse",
    title: "PULSE",
    tagline: "Your music, sculpted in light — in real time",
    description:
      "A real-time audio visualizer that dissects frequency bands and re-sculpts them as 3D light sculptures. Web Audio API drives a custom canvas + GLSL pipeline with sub-16ms latency.",
    category: "Audio / Data Viz",
    year: "2024",
    tags: "WebAudio,Canvas,GLSL,TypeScript",
    imageUrl: "/images/projects/pulse.png",
    accent: "#FF3B5C",
    likes: 201,
    views: 4102,
    order: 3,
  },
  {
    slug: "terra",
    title: "TERRA",
    tagline: "Geospatial storytelling across 40 years of climate data",
    description:
      "Scroll-driven data documentary stitching satellite imagery and D3 cartograms into a cinematic narrative. Awarded Site of the Day on a major design showcase.",
    category: "Data Visualization",
    year: "2024",
    tags: "D3,Mapbox,Svelte,Storytelling",
    imageUrl: "/images/projects/terra.png",
    accent: "#3DDC97",
    likes: 98,
    views: 1876,
    order: 4,
  },
  {
    slug: "helix",
    title: "HELIX",
    tagline: "A genomics platform making DNA data feel human",
    description:
      "Product design and front-end architecture for a biotech startup — genome browsers, interactive charts and a design system shipped as 60+ documented components.",
    category: "Product / SaaS",
    year: "2023",
    tags: "React,TypeScript,Prisma,Design System",
    imageUrl: "/images/projects/helix.png",
    accent: "#FFB347",
    likes: 76,
    views: 1423,
    order: 5,
  },
  {
    slug: "monolith",
    title: "MONOLITH",
    tagline: "Brutalist brand site for a sound-engineering studio",
    description:
      "An award-shortlisted brand experience. FBM-noise fog, floating brutalist geometry and a scroll-choreographed soundtrack — built as a single continuous scene.",
    category: "Brand / Exhibition",
    year: "2023",
    tags: "GSAP,Three.js,Sanity,Sound Design",
    imageUrl: "/images/projects/monolith.png",
    accent: "#E85DFF",
    likes: 156,
    views: 2980,
    order: 6,
  },
];

const guestbookEntries: { name: string; message: string; createdAt: Date }[] = [
  {
    name: "Sofia K.",
    message: "The particle work on NEBULA is unreal. Bookmarked this portfolio instantly.",
    createdAt: new Date(Date.now() - 2 * DAY),
  },
  {
    name: "Daniel Reyes",
    message: "That horizontal project gallery is the smoothest thing I've felt on the web this year.",
    createdAt: new Date(Date.now() - 5 * DAY),
  },
  {
    name: "Mei Lin",
    message: "AURORA's liquid metal transitions live rent-free in my head. Gorgeous typographic choices too.",
    createdAt: new Date(Date.now() - 1 * WEEK),
  },
  {
    name: "Tom Berger",
    message: "Sending this to every designer I know. The 3D hero alone is masterclass material.",
    createdAt: new Date(Date.now() - 9 * DAY),
  },
  {
    name: "Priya Nair",
    message: "PULSE made me open my Spotify just to see music differently. Brilliant execution.",
    createdAt: new Date(Date.now() - 12 * DAY),
  },
  {
    name: "Alex Fontaine",
    message: "The scroll choreography and micro-interactions here are genuinely inspirational. Signed!",
    createdAt: new Date(Date.now() - 2 * WEEK),
  },
];

async function main() {
  // Idempotent: wipe existing rows, then insert fresh (safe to re-run).
  await db.contactMessage.deleteMany();
  await db.guestbookEntry.deleteMany();
  await db.project.deleteMany();
  await db.siteStat.deleteMany();

  for (const project of projects) {
    await db.project.create({ data: project });
  }

  for (const entry of guestbookEntries) {
    await db.guestbookEntry.create({ data: entry });
  }

  await db.siteStat.create({ data: { key: "visits", value: 12480 } });
  await db.siteStat.create({ data: { key: "likes_given", value: 0 } });

  const [projectCount, guestbookCount, statCount] = await Promise.all([
    db.project.count(),
    db.guestbookEntry.count(),
    db.siteStat.count(),
  ]);

  console.log(
    `Seed complete: ${projectCount} projects, ${guestbookCount} guestbook entries, ${statCount} site stats.`
  );
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await db.$disconnect();
    process.exit(1);
  });
