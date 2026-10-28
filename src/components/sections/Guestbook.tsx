"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, PenLine, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SectionHeading from "@/components/portfolio/SectionHeading";
import { EASE, timeAgo, type EntryDTO } from "@/lib/site";

const ROTATIONS = [-1.2, 0.8, -0.5, 1.1, -0.9, 0.6];

export default function Guestbook({ initialEntries }: { initialEntries: EntryDTO[] }) {
  const [entries, setEntries] = useState<EntryDTO[]>(initialEntries);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const m = message.trim();
    if (n.length < 2 || n.length > 32) {
      toast.error("Name must be 2–32 characters");
      return;
    }
    if (m.length < 2 || m.length > 280) {
      toast.error("Message must be 2–280 characters");
      return;
    }
    setSending(true);
    try {
      const r = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n, message: m }),
      });
      const d = (await r.json().catch(() => ({}))) as {
        entry?: EntryDTO;
        error?: string;
      };
      if (!r.ok || !d.entry) throw new Error(d.error ?? "Could not sign the wall");
      setEntries((prev) => [d.entry as EntryDTO, ...prev]);
      setName("");
      setMessage("");
      toast.success("Signed — your mark is on the wall.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="guestbook" className="relative px-4 py-24 md:px-8 md:py-36" aria-label="Guestbook">
      <SectionHeading
        index="05"
        label="Guestbook"
        title={
          <>
            Signs of <span className="text-outline">approval</span>
          </>
        }
        hint="LIVE — STORED IN THE DATABASE"
      />

      <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-14">
        {/* form */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="h-max -rotate-1 rounded-xl border border-white/10 bg-white/[0.02] p-6 md:p-7 lg:sticky lg:top-28"
        >
          <div className="mb-5 flex items-center gap-3">
            <PenLine className="h-4 w-4 text-ac" />
            <h3 className="font-display text-lg font-bold uppercase tracking-tight">
              Leave your mark
            </h3>
          </div>

          <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#85857D]">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
              placeholder="A fellow human"
              className="mt-2 w-full border-b border-white/15 bg-transparent pb-2.5 text-base text-[#F2F1EA] outline-none transition-colors placeholder:text-[#85857D]/50 focus:border-ac"
            />
          </label>

          <label className="mt-6 block font-mono text-[10px] uppercase tracking-[0.25em] text-[#85857D]">
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder="Say something about the work — or just say hi."
              className="mt-2 w-full resize-none border-b border-white/15 bg-transparent pb-2.5 text-base leading-relaxed text-[#F2F1EA] outline-none transition-colors placeholder:text-[#85857D]/50 focus:border-ac"
            />
          </label>
          <div className="mt-1.5 text-right font-mono text-[10px] text-[#85857D]">
            {message.length}/280
          </div>

          <button
            type="submit"
            disabled={sending}
            data-cursor="hover"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ac py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0A0A0B] transition-all duration-300 hover:glow-ac disabled:opacity-60"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing…
              </>
            ) : (
              <>
                Sign the wall <Send className="h-3.5 w-3.5" />
              </>
            )}
          </button>

          <p className="mt-4 font-mono text-[10px] leading-relaxed text-[#85857D]/70">
            Entries persist in a real database — refresh and they&apos;ll still be
            here. Rate-limited to keep the wall classy.
          </p>
        </motion.form>

        {/* entries */}
        <div>
          {entries.length === 0 ? (
            <p className="py-16 text-center font-mono text-sm text-[#85857D]">
              The wall is empty — be the first to sign.
            </p>
          ) : (
            <ul className="scroll-slim grid max-h-[560px] gap-4 overflow-y-auto pr-2 sm:grid-cols-2">
              <AnimatePresence initial={false}>
                {entries.map((entry, i) => (
                  <motion.li
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    whileHover={{ rotate: 0, scale: 1.02 }}
                    style={{ rotate: ROTATIONS[i % ROTATIONS.length] }}
                    className="rounded-xl border border-white/[0.07] border-l-2 border-l-ac/60 bg-white/[0.02] p-4 md:p-5"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-xs font-medium text-ac">
                        {entry.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#85857D]">
                        {timeAgo(entry.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#F2F1EA]/90">
                      &ldquo;{entry.message}&rdquo;
                    </p>
                    <span className="mt-3 block font-mono text-[10px] text-[#85857D]/60">
                      № {entries.length - i}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
