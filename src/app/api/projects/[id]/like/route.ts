import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Simple in-memory rate limit: max 1 like per project id per 2 seconds (global).
const LIKE_COOLDOWN_MS = 2000;
const lastLikeAt = new Map<string, number>();

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Look up by id first; fall back to slug so both identifiers work.
    const project =
      (await db.project.findUnique({ where: { id } })) ??
      (await db.project.findUnique({ where: { slug: id } }));

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const now = Date.now();
    const last = lastLikeAt.get(project.id) ?? 0;
    if (now - last < LIKE_COOLDOWN_MS) {
      return NextResponse.json(
        { error: "You're liking too fast — try again in a moment" },
        { status: 429 }
      );
    }

    const updated = await db.project.update({
      where: { id: project.id },
      data: { likes: { increment: 1 } },
    });

    lastLikeAt.set(project.id, now);

    return NextResponse.json({ likes: updated.likes });
  } catch (error) {
    console.error("POST /api/projects/[id]/like failed:", error);
    return NextResponse.json({ error: "Failed to like project" }, { status: 500 });
  }
}
