import { NextResponse } from "next/server";
import { addTimelineEntry, readMemoryFiles } from "@/lib/memory";

export const runtime = "nodejs";

export async function GET() {
  const files = await readMemoryFiles();
  return NextResponse.json({ files });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { entry?: string };

  try {
    await addTimelineEntry(body.entry || "");
    const files = await readMemoryFiles();
    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add memory entry." },
      { status: 400 }
    );
  }
}
