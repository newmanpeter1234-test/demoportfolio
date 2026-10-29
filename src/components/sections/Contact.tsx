"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import MagneticButton from "@/components/portfolio/MagneticButton";
import SectionHeading from "@/components/portfolio/SectionHeading";
import { useISTClock } from "@/hooks/use-ist-clock";
import { EASE, PERSONA, SOCIALS } from "@/lib/site";

type Status = "idle" | "sending" | "sent";

const FIELD =
  "mt-2 w-full border-b border-white/15 bg-transparent pb-3 text-lg text-[#F2F1EA] outline-none transition-colors duration-300 placeholder:text-[#85857D]/40 focus:border-ac";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const time = useISTClock(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (name.length < 2) return toast.error("Tell me your name (2+ characters)");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("That email doesn't look right");
    if (message.length < 10)
      return toast.error("Give me at least 10 characters of context");

    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject: form.subject.trim(), message }),
      });
      const d = (await r.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (!r.ok || !d.success) throw new Error(d.error ?? "Could not send the message");
      setStatus("sent");
      toast.success("Message received — I reply within 48h.");
      window.setTimeout(() => {
        setForm({ name: "", email: "", subject: "", message: "" });
        setStatus("idle");
      }, 4000);
    } catch (err) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <section id="contact" className="relative px-4 py-24 md:px-8 md:py-36" aria-label="Contact">
      <SectionHeading
        index="06"
        label="Contact"
        title={
          <>
            Let&apos;s make <span className="text-outline">history</span>
          </>
        }
        hint="USUALLY REPLIES WITHIN 48H"
      />

      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        {/* left — direct channels */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col justify-between gap-10"
        >
          <div>
            <p className="max-w-md text-xl font-light leading-relaxed text-[#F2F1EA]/90 md:text-2xl">
              Have an ambitious idea, a product that needs a soul, or a brand
              that deserves better than a template? My inbox is open.
            </p>

            <a
              href={`mailto:${PERSONA.email}`}
              data-cursor="hover"
              className="group mt-8 inline-flex items-center gap-3 font-display text-2xl font-bold tracking-tight underline decoration-ac decoration-1 underline-offset-8 transition-colors hover:text-ac md:text-3xl"
            >
              {PERSONA.email}
              <ArrowUpRight className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>

            <div className="mt-10 space-y-3 font-mono text-[12px] uppercase tracking-[0.2em] text-[#85857D]">
              <p className="flex items-center gap-3">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ac" />
                {PERSONA.availability} — 2027
              </p>
              <p>
                {PERSONA.location} · {time} IST
              </p>
              <p>{PERSONA.coords}</p>
            </div>
          </div>

          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="group flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#85857D] transition-colors hover:text-ac"
                >
                  {s.label}
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* right — form */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-9"
          noValidate
        >
          <div className="grid gap-7 sm:grid-cols-2">
            <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#85857D]">
              Your name *
              <input
                value={form.name}
                onChange={set("name")}
                placeholder="Ada Lovelace"
                autoComplete="name"
                className={FIELD}
              />
            </label>
            <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#85857D]">
              Email *
              <input
                value={form.email}
                onChange={set("email")}
                type="email"
                placeholder="ada@analytical.engine"
                autoComplete="email"
                className={FIELD}
              />
            </label>
          </div>

          <label className="mt-7 block font-mono text-[10px] uppercase tracking-[0.25em] text-[#85857D]">
            Subject
            <input
              value={form.subject}
              onChange={set("subject")}
              placeholder="A 3D experience for…"
              className={FIELD}
            />
          </label>

          <label className="mt-7 block font-mono text-[10px] uppercase tracking-[0.25em] text-[#85857D]">
            The idea *
            <textarea
              value={form.message}
              onChange={set("message")}
              rows={4}
              placeholder="Tell me about the project, the timeline and what 'award-worthy' means to you."
              className={`${FIELD} resize-none leading-relaxed`}
            />
          </label>

          <MagneticButton
            type="submit"
            disabled={status === "sending"}
            className={`mt-9 flex w-full items-center justify-center gap-2 rounded-full py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.22em] transition-all duration-500 ${
              status === "sent"
                ? "bg-[#F2F1EA] text-[#0A0A0B]"
                : "bg-ac text-[#0A0A0B] hover:glow-ac"
            } disabled:opacity-70`}
          >
            {status === "sending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : status === "sent" ? (
              <>
                <Check className="h-4 w-4" /> Message sent — talk soon
              </>
            ) : (
              <>Send message ↗</>
            )}
          </MagneticButton>

          <p className="mt-5 text-center font-mono text-[10px] leading-relaxed text-[#85857D]/70">
            Delivered straight to the database via a typed API route — no
            third-party form service involved.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
