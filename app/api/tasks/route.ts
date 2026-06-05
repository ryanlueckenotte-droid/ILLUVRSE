import { NextResponse } from "next/server";
import { addTask, completeTask, parseTasks, readTasksMarkdown } from "@/lib/tasks";

export const runtime = "nodejs";

async function taskPayload() {
  const markdown = await readTasksMarkdown();
  return {
    markdown,
    tasks: parseTasks(markdown)
  };
}

export async function GET() {
  return NextResponse.json(await taskPayload());
}

export async function POST(request: Request) {
  const body = (await request.json()) as { action?: string; text?: string };

  try {
    if (body.action === "complete") {
      await completeTask(body.text || "");
    } else {
      await addTask(body.text || "");
    }

    return NextResponse.json(await taskPayload());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update tasks." },
      { status: 400 }
    );
  }
}
