import { NextResponse } from "next/server";
import { addProject, readProjectsMarkdown } from "@/lib/projects";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    markdown: await readProjectsMarkdown()
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; goal?: string };

  try {
    await addProject(body.name || "", body.goal || "");
    return NextResponse.json({
      markdown: await readProjectsMarkdown()
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add project." },
      { status: 400 }
    );
  }
}
