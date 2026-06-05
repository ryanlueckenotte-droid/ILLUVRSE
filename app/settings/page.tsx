"use client";

import { FormEvent, useEffect, useState } from "react";
import { Save, Signal } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";

type SettingsPayload = {
  config: {
    model: string;
    ollamaUrl: string;
  };
  ollama: {
    online: boolean;
    url: string;
    error?: string;
  };
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsPayload | null>(null);
  const [model, setModel] = useState("llama3.2:3b");
  const [message, setMessage] = useState("");

  async function loadSettings() {
    const response = await fetch("/api/settings");
    const data = await response.json();
    setSettings(data);
    setModel(data.config?.model || "llama3.2:3b");
  }

  useEffect(() => {
    loadSettings().catch(() => setMessage("Unable to load settings."));
  }, []);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model })
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Unable to save settings.");
      return;
    }

    setSettings(data);
    setModel(data.config.model);
    setMessage("Saved.");
  }

  return (
    <AppShell>
      <SectionHeader title="Settings" eyebrow="config/illuvrse.json" />

      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <h2 className="mb-5 text-lg font-semibold">Runtime</h2>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <StatusRow label="Current model" value={settings?.config.model || model} />
            <StatusRow label="Ollama URL" value={settings?.config.ollamaUrl || "http://127.0.0.1:11434"} />
            <StatusRow
              label="Ollama health"
              value={settings?.ollama.online ? "Online" : "Offline"}
              good={settings?.ollama.online}
            />
            <StatusRow label="Cloud AI APIs" value="Disabled" good />
          </div>

          {settings?.ollama.error ? (
            <div className="mt-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {settings.ollama.error}
            </div>
          ) : null}
        </section>

        <aside className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <h2 className="mb-3 text-lg font-semibold">Model</h2>
          <form onSubmit={saveSettings} className="space-y-3">
            <input
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none ring-violet/40 placeholder:text-slate-500 focus:ring-2"
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-violet px-4 text-sm font-medium text-white hover:bg-violet/90"
            >
              <Save className="h-4 w-4" />
              Save Model
            </button>
            {message ? <div className="text-sm text-slate-300">{message}</div> : null}
          </form>
        </aside>
      </div>
    </AppShell>
  );
}

function StatusRow({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="mb-2 text-slate-400">{label}</div>
      <div className="flex items-center gap-2 font-medium text-white">
        {good === undefined ? null : (
          <Signal className={`h-4 w-4 ${good ? "text-mint" : "text-rose-300"}`} />
        )}
        {value}
      </div>
    </div>
  );
}
