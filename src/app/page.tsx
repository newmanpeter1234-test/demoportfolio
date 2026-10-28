import { db } from "@/lib/db";
import type { EntryDTO, ProjectDTO } from "@/lib/site";
import CustomCursor from "@/components/portfolio/CustomCursor";
import MenuOverlay from "@/components/portfolio/MenuOverlay";
import Navbar from "@/components/portfolio/Navbar";
import NoiseOverlay from "@/components/portfolio/NoiseOverlay";
import Preloader from "@/components/portfolio/Preloader";
import ScrollProgress from "@/components/portfolio/ScrollProgress";
import SmoothScroll from "@/components/portfolio/SmoothScroll";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Guestbook from "@/components/sections/Guestbook";
import Hero from "@/components/sections/Hero";
import Recognition from "@/components/sections/Recognition";
import Services from "@/components/sections/Services";
import Works from "@/components/sections/Works";
import MarqueeStrip from "@/components/portfolio/MarqueeStrip";

export const dynamic = "force-dynamic";

const MARQUEE_ITEMS = [
  "Immersive 3D",
  "Creative Development",
  "Motion Systems",
  "WebGL Shaders",
  "Art Direction",
  "Interface Craft",
];

export default async function Page() {
  const [projects, entries, stat] = await Promise.all([
    db.project.findMany({ orderBy: { order: "asc" } }),
    db.guestbookEntry.findMany({ orderBy: { createdAt: "desc" }, take: 24 }),
    db.siteStat.upsert({
      where: { key: "visits" },
      update: { value: { increment: 1 } },
      create: { key: "visits", value: 1 },
    }),
  ]);

  const projectDTOs: ProjectDTO[] = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    description: p.description,
    category: p.category,
    year: p.year,
    tags: p.tags.split(",").map((t) => t.trim()),
    imageUrl: p.imageUrl,
    accent: p.accent,
    likes: p.likes,
    views: p.views,
  }));

  const entryDTOs: EntryDTO[] = entries.map((e) => ({
    id: e.id,
    name: e.name,
    message: e.message,
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-[#0A0A0B]">
        <Preloader />
        <CustomCursor />
        <NoiseOverlay />
        <ScrollProgress />
        <Navbar />
        <MenuOverlay />

        <main className="relative flex-1">
          <Hero />
          <MarqueeStrip items={MARQUEE_ITEMS} className="border-y border-white/10" />
          <About />
          <Works projects={projectDTOs} />
          <Services />
          <Recognition />
          <Guestbook initialEntries={entryDTOs} />
          <Contact />
        </main>

        <Footer visits={stat.value} />
      </div>
    </SmoothScroll>
  );
}
