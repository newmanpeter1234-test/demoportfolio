import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const entrySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(32, "Name must be at most 32 characters"),
  message: z
    .string()
    .trim()
    .min(2, "Message must be at least 2 characters")
    .max(280, "Message must be at most 280 characters"),
});

// Simple in-memory rate limit per IP: max 5 posts per 60 seconds.
const WINDOW_MS = 60_000;
const MAX_POSTS_PER_WINDOW = 5;
const postsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (postsByIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_POSTS_PER_WINDOW) {
    postsByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  postsByIp.set(ip, recent);
  // Opportunistically drop fully-expired IPs to keep the map small.
  if (postsByIp.size > 1000) {
    for (const [key, stamps] of postsByIp) {
      if (stamps.every((t) => now - t >= WINDOW_MS)) postsByIp.delete(key);
    }
  }
  return false;
}

export async function GET() {
  try {
    const entries = await db.guestbookEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("GET /api/guestbook failed:", error);
    return NextResponse.json({ error: "Failed to load guestbook" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = entrySchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Slow down a little" }, { status: 429 });
    }

    const entry = await db.guestbookEntry.create({
      data: {
        name: parsed.data.name,
        message: parsed.data.message,
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/guestbook failed:", error);
    return NextResponse.json({ error: "Failed to sign guestbook" }, { status: 500 });
  }
}
