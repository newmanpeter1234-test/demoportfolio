"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Eye, Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { scrollToId, type ProjectDTO } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

function ProjectCard({
  p,
  i,
  progress,
}: {
  p: ProjectDTO;
  i: number;
  progress: MotionValue<number>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [likes, setLikes] = useState(p.likes);
  const [views, setViews] = useState(p.views);
  const [liked, setLiked] = useState(false);
  const [pop, setPop] = useState(0);
  const [open, setOpen] = useState(false);
  const inView = useInView(cardRef, { amount: 0.4 });

  // counter-parallax drift of the artwork inside its frame
  const imgX = useTransform(progress, [0, 1], ["-7%", "7%"]);

  // 3D tilt
  const rx = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 9);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 9);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  // view counter — once per session per project
  useEffect(() => {
    if (!inView) return;
    const key = `viewed:${p.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* storage unavailable — still count */
    }
    fetch(`/api/projects/${p.id}/view`, { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { views?: number } | null) => {
        if (d?.views) setViews(d.views);
      })
      .catch(() => {});
  }, [inView, p.id]);

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(`liked:${p.id}`) === "1");
    } catch {
      /* ignore */
    }
  }, [p.id]);

  const like = async () => {
    if (liked) return;
    setLiked(true);
    setLikes((l) => l + 1);
    setPop((k) => k + 1);
    try {
      const r = await fetch(`/api/projects/${p.id}/like`, { method: "POST" });
      const d = (await r.json().catch(() => ({}))) as { likes?: number; error?: string };
      if (!r.ok) throw new Error(d.error ?? "Could not register your like");
      if (d.likes) setLikes(d.likes);
      try {
        localStorage.setItem(`liked:${p.id}`, "1");
      } catch {
        /* ignore */
      }
    } catch (err) {
      setLiked(false);
      setLikes((l) => Math.max(0, l - 1));
      toast.error(err instanceof Error ? err.message : "Could not like right now");
    }
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`Open case study — ${p.title}`}
        data-cursor="OPEN"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5% 0px" }}
        transition={{ duration: 0.8, delay: Math.min(i * 0.05, 0.2) }}
        className="group relative w-[78vw] shrink-0 sm:w-[56vw] md:w-[40vw] lg:w-[31vw]"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-[#131315]">
          <motion.div className="absolute inset-[-9%]" style={{ x: imgX }}>
            <Image
              src={p.imageUrl}
              alt={`${p.title} — ${p.tagline}`}
              fill
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 32vw"
              className="object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30" />

          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F2F1EA] backdrop-blur-sm">
            {p.category}
          </span>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="translate-y-2 rounded-full bg-ac px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A0A0B] opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
              Open case <span aria-hidden>↗</span>
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-ac">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="truncate font-display text-2xl font-extrabold uppercase tracking-tight md:text-3xl">
                {p.title}
              </h3>
            </div>
            <p className="mt-1.5 line-clamp-2 max-w-md text-sm leading-relaxed text-[#85857D]">
              {p.tagline}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] text-[#85857D]"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="font-mono text-xs text-[#85857D]">{p.year}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                like();
              }}
              aria-pressed={liked}
              aria-label={liked ? `You liked ${p.title}` : `Like ${p.title}`}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors duration-300 ${
                liked
                  ? "border-ac/60 bg-ac/10 text-ac"
                  : "border-white/15 text-[#F2F1EA] hover:border-ac/60 hover:text-ac"
              }`}
            >
              <motion.span
                key={pop}
                initial={pop ? { scale: 0.35 } : false}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 550, damping: 14 }}
                className="inline-flex"
              >
                <Heart className={`h-3.5 w-3.5 ${liked ? "fill-ac" : "fill-transparent"}`} />
              </motion.span>
              {likes}
            </button>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#85857D]">
              <Eye className="h-3.5 w-3.5" />
              {views.toLocaleString("en-US")}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Case study dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90svh] gap-0 overflow-y-auto rounded-xl border-white/10 bg-[#101012] p-0 sm:max-w-3xl">
          <div className="relative aspect-[16/10] max-h-[40svh] w-full overflow-hidden sm:aspect-[21/10]">
            <Image
              src={p.imageUrl}
              alt={`${p.title} — artwork`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101012] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
              <h3 className="font-display text-4xl font-extrabold uppercase tracking-tight md:text-5xl">
                {p.title}
              </h3>
              <span className="font-mono text-sm text-ac">{p.year}</span>
            </div>
          </div>
          <div className="grid gap-6 p-6 md:p-8">
            <DialogHeader className="gap-2 text-left">
              <DialogTitle className="sr-only">{p.title} case study</DialogTitle>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ac">
                {p.category}
              </p>
              <DialogDescription className="text-xl font-light leading-snug text-[#F2F1EA]">
                {p.tagline}
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm leading-relaxed text-[#85857D] md:text-base">
              {p.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-[#85857D]"
                >
                  #{t}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] text-[#85857D]">
              <span className="flex items-center gap-2">
                <Heart className="h-3.5 w-3.5 text-ac" /> {likes} likes
              </span>
              <span className="flex items-center gap-2">
                <Eye className="h-3.5 w-3.5" /> {views.toLocaleString("en-US")} views
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Works({ projects }: { projects: ProjectDTO[] }) {
  const targetRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const [vh, setVh] = useState(0);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const smooth = useSpring(scrollYProgress, { damping: 30, stiffness: 170, mass: 0.9 });
  const x = useTransform(smooth, [0, 1], [0, -range]);

  // momentum skew — the gallery leans while you scroll hard
  const velocity = useVelocity(smooth);
  const skewRaw = useTransform(velocity, [-1.4, 0, 1.4], [-3.5, 0, 3.5]);
  const skew = useSpring(skewRaw, { stiffness: 220, damping: 42 });

  const [active, setActive] = useState(0);
  useMotionValueEvent(smooth, "change", (v) => {
    const idx = Math.min(
      projects.length - 1,
      Math.max(0, Math.round(v * (projects.length - 1)))
    );
    setActive(idx);
  });

  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      setRange(Math.max(0, el.scrollWidth - window.innerWidth));
      setVh(window.innerHeight);
    };
    measure();
    const t1 = window.setTimeout(measure, 600);
    const t2 = window.setTimeout(measure, 1800);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, [projects.length]);

  const height = range + vh > 0 ? `${((range + vh) / Math.max(vh, 1)) * 100}vh` : "380vh";

  return (
    <section id="works" ref={targetRef} style={{ height }} className="relative" aria-label="Selected works">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x, skewX: skew }}
          className="flex w-max items-center gap-[7vw] px-[5vw] will-change-transform"
        >
          {/* lead card */}
          <div className="w-[82vw] shrink-0 sm:w-[52vw] md:w-[34vw]">
            <div className="mb-4 flex items-center justify-between md:mb-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ac">
                ( 02 ) — Selected works
              </span>
            </div>
            <h2 className="font-display text-[13vw] font-extrabold uppercase leading-[0.92] tracking-tight md:text-[5.6vw]">
              Featured
              <br />
              <span className="text-outline">works</span>
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-[#85857D] md:mt-8 md:text-base">
              A pinned gallery of obsession — keep scrolling and the screen
              shifts sideways. Hover a card to tilt it, open one for the full
              case, leave a like.
            </p>
            <p className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[#85857D]">
              Scroll to explore <span aria-hidden className="text-ac">→</span>
            </p>
          </div>

          {projects.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} progress={smooth} />
          ))}

          {/* closer card */}
          <div className="flex w-[70vw] shrink-0 flex-col items-start justify-center md:w-[26vw]">
            <p className="font-display text-[9vw] font-extrabold uppercase leading-[0.95] tracking-tight md:text-[3.4vw]">
              Want
              <br />
              yours
              <br />
              <span className="text-outline">next?</span>
            </p>
            <button
              type="button"
              onClick={() => scrollToId("#contact")}
              data-cursor="hover"
              className="mt-8 flex items-center gap-2 rounded-full border border-ac/50 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ac transition-colors duration-300 hover:bg-ac hover:text-[#0A0A0B]"
            >
              Start a project <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* progress */}
        <div className="pointer-events-none absolute bottom-8 left-4 right-4 flex items-center gap-6 md:left-8 md:right-8">
          <div className="h-px w-32 overflow-hidden bg-white/15 md:w-48">
            <motion.div className="h-full origin-left bg-ac" style={{ scaleX: smooth }} />
          </div>
          <span className="font-mono text-[11px] tracking-[0.25em] text-[#85857D]">
            {String(Math.min(active + 1, projects.length)).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>
          <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[#85857D] md:block">
            Horizontal gallery — hold scroll
          </span>
        </div>
      </div>
    </section>
  );
}
