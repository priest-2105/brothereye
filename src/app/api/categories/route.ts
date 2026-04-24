import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch("https://eonet.gsfc.nasa.gov/api/v3/categories", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`EONET categories ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
