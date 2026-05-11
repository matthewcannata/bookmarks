import { NextResponse } from "next/server";
import { presetsByCategory } from "@/lib/presets";

export const runtime = "nodejs";

export async function GET() {
  const groups = presetsByCategory().map((g) => ({
    category: g.category,
    label: g.label,
    items: g.items.map(({ buildPrompt, negativePrompt, ...rest }) => rest),
  }));
  return NextResponse.json({ groups });
}
