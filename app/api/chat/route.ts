import { NextResponse } from "next/server";
import { readConfig } from "@/lib/config";
import { buildSystemPrompt } from "@/lib/memory";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as { messages?: ChatMessage[] };
  const messages = (body.messages || []).filter(
    (message) =>
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim()
  );

  if (!messages.length) {
    return NextResponse.json({ error: "At least one message is required." }, { status: 400 });
  }

  const [config, systemPrompt] = await Promise.all([readConfig(), buildSystemPrompt()]);

  try {
    const response = await fetch(`${config.ollamaUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: config.model,
        stream: false,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          ...messages
        ],
        options: {
          temperature: 0.35
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Ollama returned HTTP ${response.status}. ${errorText}` },
        { status: 502 }
      );
    }

    const data = (await response.json()) as { message?: { content?: string } };
    return NextResponse.json({
      reply: data.message?.content?.trim() || "Ollama returned an empty response.",
      model: config.model
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to reach local Ollama at the configured URL."
      },
      { status: 502 }
    );
  }
}
