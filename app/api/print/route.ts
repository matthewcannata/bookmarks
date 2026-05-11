import { NextRequest, NextResponse } from "next/server";
import { toPrintReady } from "@/lib/print";

export const runtime = "nodejs";

/**
 * Accepts { base64 } and returns the same image processed to 600x1800
 * @ 300 DPI as a PNG download. Used by the gallery's "Download print PNG"
 * button when the print version wasn't generated upfront.
 */
export async function POST(req: NextRequest) {
  let body: { base64?: string; filename?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.base64) return NextResponse.json({ error: "Missing 'base64'" }, { status: 400 });

  try {
    const png = await toPrintReady(body.base64);
    const filename = (body.filename ?? "bookmark") + ".png";
    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
