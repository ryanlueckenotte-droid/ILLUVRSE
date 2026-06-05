"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";

type MemoryFile = {
  name: string;
  label: string;
  content: string;
};

export default function MemoryPage() {
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [entry, setEntry] = useState("");
  const [active, setActive] = useState("profile");
  const [error, setError] = useState("");

  async function loadMemory() {
    const response = await fetch("/api/memory");
    const data = await response.json();
    setFiles(data.files || []);
  }

  useEffect(() => {
    loadMemory().catch(() => setError("Unable to load memory."));
  }, []);

  async function addEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entry })
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Unable to add memory entry.");
      return;
    }

    setEntry("");
    setActive("timeline");
    setFiles(data.files || []);
  }

  const currentFile = files.find((file) => file.name === active) || files[0];

  return (
    <AppShell>
      <SectionHeader title="Memory" eyebrow="Local markdown" />

      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <section className="rounded-lg border border-white/10 bg-white/[0.035]">
          <div className="flex gap-2 overflow-x-auto border-b border-white/10 p-3">
            {files.map((file) => (
              <button
                key={file.name}
                type="button"
                onClick={() => setActive(file.name)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  active === file.name ? "bg-violet text-white" : "bg-white/[0.04] text-slate-300"
                }`}
              >
                {file.label}
              </button>
            ))}
          </div>
          <div className="min-h-[28rem] p-5">
            <h2 className="mb-3 text-lg font-semibold">{currentFile?.label || "Memory"}</h2>
            <pre className="markdown-panel rounded-lg border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-200">
              {currentFile?.content || "No memory loaded."}
            </pre>
          </div>
        </section>

        <aside className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <h2 className="mb-3 text-lg font-semibold">Add Timeline Entry</h2>
          <form onSubmit={addEntry} className="space-y-3">
            <textarea
              value={entry}
              onChange={(event) => setEntry(event.target.value)}
              placeholder="New memory..."
              className="min-h-36 w-full resize-y rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-violet/40 placeholder:text-slate-500 focus:ring-2"
            />
            {error ? <div className="text-sm text-rose-200">{error}</div> : null}
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-violet px-4 text-sm font-medium text-white hover:bg-violet/90"
            >
              <Plus className="h-4 w-4" />
              Add Memory
            </button>
          </form>
        </aside>
      </div>
    </AppShell>
  );
}
