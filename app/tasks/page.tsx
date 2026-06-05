"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";

type TaskItem = {
  text: string;
  completed: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function loadTasks() {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTasks(data.tasks || []);
    setMarkdown(data.markdown || "");
  }

  useEffect(() => {
    loadTasks().catch(() => setError("Unable to load tasks."));
  }, []);

  async function updateTask(payload: { text: string; action?: string }) {
    setError("");
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Unable to update tasks.");
      return;
    }

    setTasks(data.tasks || []);
    setMarkdown(data.markdown || "");
    setText("");
  }

  function addNewTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateTask({ text });
  }

  const openTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <AppShell>
      <SectionHeader title="Tasks" eyebrow="agent/memory/tasks.md" />

      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Open</h2>
            <span className="rounded-full bg-violet/25 px-3 py-1 text-sm text-violet-100">
              {openTasks.length}
            </span>
          </div>
          <div className="space-y-2">
            {openTasks.map((task) => (
              <div
                key={task.text}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-3"
              >
                <button
                  type="button"
                  onClick={() => updateTask({ text: task.text, action: "complete" })}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/20 text-slate-300 hover:border-mint hover:text-mint"
                  aria-label={`Complete ${task.text}`}
                >
                  <Check className="h-4 w-4" />
                </button>
                <span className="text-sm text-slate-100">{task.text}</span>
              </div>
            ))}
            {!openTasks.length ? <div className="text-sm text-slate-400">No open tasks.</div> : null}
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Completed</h2>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.text}
                  className="rounded-lg border border-white/10 bg-white/[0.025] px-3 py-3 text-sm text-slate-400 line-through"
                >
                  {task.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <form onSubmit={addNewTask} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <h2 className="mb-3 text-lg font-semibold">Add Task</h2>
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Next action..."
                className="h-11 min-w-0 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none ring-violet/40 placeholder:text-slate-500 focus:ring-2"
              />
              <button
                type="submit"
                className="grid h-11 w-11 place-items-center rounded-lg bg-violet text-white hover:bg-violet/90"
                aria-label="Add task"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {error ? <div className="mt-3 text-sm text-rose-200">{error}</div> : null}
          </form>

          <pre className="markdown-panel rounded-lg border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-300">
            {markdown}
          </pre>
        </aside>
      </div>
    </AppShell>
  );
}
