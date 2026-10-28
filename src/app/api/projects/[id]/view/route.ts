import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    const updated = await db.project.update({
      where: { id: project.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ views: updated.views });
  } catch (error) {
    console.error("POST /api/projects/[id]/view failed:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
