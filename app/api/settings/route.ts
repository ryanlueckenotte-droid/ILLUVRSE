import { NextResponse } from "next/server";
import { readConfig, writeConfig } from "@/lib/config";
import { getOllamaStatus } from "@/lib/ollama";

export const runtime = "nodejs";

export async function GET() {
  const [config, ollama] = await Promise.all([readConfig(), getOllamaStatus()]);
  return NextResponse.json({ config, ollama });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { model?: string };
  const currentConfig = await readConfig();

  if (!body.model?.trim()) {
    return NextResponse.json({ error: "Model name is required." }, { status: 400 });
  }

  const config = await writeConfig({
    ...currentConfig,
    model: body.model
  });
  const ollama = await getOllamaStatus();

  return NextResponse.json({ config, ollama });
}
