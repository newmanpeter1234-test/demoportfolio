import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Atomically bump the visit counter, creating the row if it is missing.
    const visits = await db.siteStat.upsert({
      where: { key: "visits" },
      update: { value: { increment: 1 } },
      create: { key: "visits", value: 1 },
    });

    const [guestbookCount, contactCount] = await Promise.all([
      db.guestbookEntry.count(),
      db.contactMessage.count(),
    ]);

    return NextResponse.json({
      visits: visits.value,
      guestbookCount,
      contactCount,
    });
  } catch (error) {
    console.error("GET /api/stats failed:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
