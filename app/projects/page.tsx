"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";

export default function ProjectsPage() {
  const [markdown, setMarkdown] = useState("");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");

  async function loadProjects() {
    const response = await fetch("/api/projects");
    const data = await response.json();
    setMarkdown(data.markdown || "");
  }

  useEffect(() => {
    loadProjects().catch(() => setError("Unable to load projects."));
  }, []);

  async function addNewProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, goal })
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Unable to add project.");
      return;
    }

    setMarkdown(data.markdown || "");
    setName("");
    setGoal("");
  }

  return (
    <AppShell>
      <SectionHeader title="Projects" eyebrow="agent/memory/projects.md" />

      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <pre className="markdown-panel min-h-[32rem] rounded-lg border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-200">
            {markdown || "No projects loaded."}
          </pre>
        </section>

        <aside className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <h2 className="mb-3 text-lg font-semibold">Add Project</h2>
          <form onSubmit={addNewProject} className="space-y-3">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Project name"
              className="h-11 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none ring-violet/40 placeholder:text-slate-500 focus:ring-2"
            />
            <textarea
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="Project goal"
              className="min-h-28 w-full resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none ring-violet/40 placeholder:text-slate-500 focus:ring-2"
            />
            {error ? <div className="text-sm text-rose-200">{error}</div> : null}
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-violet px-4 text-sm font-medium text-white hover:bg-violet/90"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          </form>
        </aside>
      </div>
    </AppShell>
  );
}
