"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Send, Signal, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type SettingsPayload = {
  config: {
    model: string;
  };
  ollama: {
    online: boolean;
  };
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Good morning, Ryan. I have your prompt and local memory loaded. What should we move forward first?"
    }
  ]);
  const [input, setInput] = useState("");
  const [settings, setSettings] = useState<SettingsPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((response) => response.json())
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content || busy) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Chat request failed.");
      }

      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (chatError) {
      setError(chatError instanceof Error ? chatError.message : "Chat request failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <SectionHeader title="Chat" eyebrow="Good morning, Ryan.">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
            <Signal className={`h-4 w-4 ${settings?.ollama.online ? "text-mint" : "text-rose-300"}`} />
            Ollama {settings?.ollama.online ? "Online" : "Offline"}
          </span>
          <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
            Model: {settings?.config.model || "llama3.2:3b"}
          </span>
        </div>
      </SectionHeader>

      <div className="grid flex-1 gap-5 xl:grid-cols-[1fr_22rem]">
        <section className="flex min-h-[68vh] flex-col rounded-lg border border-white/10 bg-white/[0.035] shadow-glow">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3 text-violet-200">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">ILLUVRSE</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-violet text-white"
                      : "border border-white/10 bg-slate-900/70 text-slate-100"
                  }`}
                >
                  <div className="markdown-panel">{message.content}</div>
                </div>
              </div>
            ))}
            {busy ? <div className="text-sm text-slate-400">ILLUVRSE is thinking...</div> : null}
            <div ref={endRef} />
          </div>

          {error ? (
            <div className="mx-4 mb-3 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <form onSubmit={submit} className="flex gap-3 border-t border-white/10 p-4">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Message ILLUVRSE..."
              className="min-h-12 flex-1 resize-none rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-violet/40 placeholder:text-slate-500 focus:ring-2"
              rows={1}
            />
            <button
              type="submit"
              disabled={busy}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-violet text-white transition hover:bg-violet/90 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <h2 className="mb-3 text-lg font-semibold">Local Context</h2>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Prompt: agent/prompts/chief_of_staff.md</p>
              <p>Memory: profile, goals, tasks, projects, timeline</p>
              <p>AI runtime: local Ollama only</p>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
