import { NextRequest, NextResponse } from "next/server";
import { fetchEvents } from "@/lib/eonet";

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  try {
    const events = await fetchEvents({
      status: (sp.get("status") as "open" | "closed" | "all") ?? undefined,
      category: sp.get("category") ?? undefined,
      source: sp.get("source") ?? undefined,
      limit: sp.get("limit") ? Number(sp.get("limit")) : undefined,
      days: sp.get("days") ? Number(sp.get("days")) : undefined,
      start: sp.get("start") ?? undefined,
      end: sp.get("end") ?? undefined,
      bbox: sp.get("bbox") ?? undefined,
    });
    return NextResponse.json({ events });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
