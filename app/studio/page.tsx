"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  Globe,
  Users,
  FileText,
  Image as ImageIcon,
  Film,
  Layers,
  Archive,
  Download,
  FlaskConical,
  Sparkles,
  Zap,
  Package,
  ExternalLink
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { useState, useEffect } from "react";
import { STUDIO_MODULES } from "@/lib/studioModules";
import { STORAGE_KEYS } from "@/lib/localStudioStorage";

const pipelineSteps = [
  "Prompt",
  "World",
  "Characters",
  "Script",
  "Storyboard",
  "Scene",
  "Animation",
  "Export"
];

const iconMap: Record<string, any> = {
  project: Package,
  characters: Users,
  scripts: FileText,
  storyboards: ImageIcon,
  scenes: Film,
  timeline: Layers,
  assets: Archive,
  exports: Download,
  canvas: FlaskConical,
  worlds: Globe
};

const engineStatus = [
  { label: "Chief of Staff", status: "Active" },
  { label: "Local Memory", status: "Active" },
  { label: "Playwright Lab", status: "Active" },
  { label: "Drawing Command System", status: "Active" },
  { label: "Story Engine", status: "Planned" },
  { label: "Animation Timeline", status: "Active" },
  { label: "Publishing Engine", status: "Planned" },
  { label: "Business Engine", status: "Planned" }
];

export default function StudioPage() {
  const [saveStatus, setSaveStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const status: Record<string, boolean> = {};
    const keys = [
      { id: "project", key: STORAGE_KEYS.PROJECT },
      { id: "characters", key: STORAGE_KEYS.CHARACTER },
      { id: "scenes", key: STORAGE_KEYS.SCENE },
      { id: "scripts", key: STORAGE_KEYS.SCRIPT },
      { id: "storyboards", key: STORAGE_KEYS.STORYBOARD },
      { id: "timeline", key: STORAGE_KEYS.TIMELINE },
      { id: "assets", key: STORAGE_KEYS.ASSETS },
      { id: "exports", key: STORAGE_KEYS.EXPORT_PLAN },
    ];

    keys.forEach(({ id, key }) => {
      status[id] = !!window.localStorage.getItem(key);
    });

    setSaveStatus(status);
  }, []);

  return (
    <AppShell>
      <SectionHeader title="ILLUVRSE Studio" eyebrow="Universe builder" />

      <div className="space-y-8">
        {/* Hero Panel */}
        <section className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-violet/20 to-transparent p-8 shadow-glow">
          <div className="relative z-10 max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold text-white">
              The Creative Operating System
            </h2>
            <p className="text-xl leading-relaxed text-slate-200">
              "Turn ideas into worlds, characters, scripts, storyboards, scenes, animations, and digital businesses."
            </p>
          </div>
          <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-violet/10 blur-3xl" />
        </section>

        {/* Current Episode & Quick Launch */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Current Episode Panel */}
          <div className="lg:col-span-4 h-full">
            <section className="h-full rounded-xl border border-violet-500/30 bg-violet-500/5 p-6 shadow-glow flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-violet-300">
                    <Clapperboard className="h-5 w-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Current Episode</span>
                  </div>
                  <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-300">
                    planning
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-white">Otter Core Awakens</h3>
                    <p className="text-sm text-slate-400">Series: ILLUVRSE Core</p>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-slate-500">Bundle ID</span>
                      <span className="font-mono">project-illuvrse-core-episode-001</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-slate-500">Main Character</span>
                      <span>The Otter</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-slate-500">Runtime Target</span>
                      <span>1-3 minute animated short</span>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/studio/project"
                className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-500"
              >
                Open Episode Bundle <ExternalLink className="h-4 w-4" />
              </Link>
            </section>
          </div>

          {/* Quick Launch Section */}
          <div className="lg:col-span-8">
            <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6 h-full">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400">Quick Launch</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Local Save Status</span>
                <div className="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-glow animate-pulse" />
              </div>
            </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {STUDIO_MODULES.filter(m => !m.comingSoon).map((module) => {
                  const Icon = iconMap[module.key] || Package;
                const isSaved = saveStatus[module.key];

                  return (
                    <Link key={module.key} href={module.route}>
                    <div className="group relative flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 p-4 text-center transition hover:border-violet-500/50 hover:bg-violet-500/10 hover:shadow-glow">
                      {isSaved && (
                        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-mint/10 border border-mint/20 px-1.5 py-0.5 text-[8px] font-bold uppercase text-mint shadow-glow-sm">
                          Saved
                        </div>
                      )}

                        <div className="mb-2 rounded-lg bg-white/5 p-2 text-violet-300 transition group-hover:bg-violet-500/20">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-white">{module.title}</span>
                        <p className="mt-1 text-[10px] text-slate-500 line-clamp-1 group-hover:text-slate-400 transition-colors">
                          {module.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between w-full border-t border-white/5 pt-2">
                           <span className="text-[9px] font-bold uppercase tracking-tighter text-mint">{module.status}</span>
                           <span className="text-[8px] font-mono text-slate-600 group-hover:text-violet-400/50 transition-colors">{module.route}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Pipeline Section */}
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-6 text-sm font-medium uppercase tracking-wider text-slate-400">Creative Pipeline</h3>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {pipelineSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet/30 bg-violet/10 text-xs font-bold text-violet-300">
                    {index + 1}
                  </div>
                  <span className="text-xs font-medium text-slate-300">{step}</span>
                </div>
                {index < pipelineSteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-slate-600 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Featured: Project Bundle */}
        <Link href="/studio/project">
          <section className="group relative overflow-hidden rounded-xl border border-violet-500/30 bg-violet-500/5 p-8 transition hover:bg-violet-500/10 hover:shadow-glow">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="mb-2 flex items-center gap-2 text-violet-300">
                  <Package className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Episode Manifest</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Project Bundle v1</h3>
                <p className="mt-2 text-slate-300 max-w-xl">
                  The central package that connects characters, scenes, scripts, storyboards, and timelines into one portable local-first project.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-violet-500/20 px-4 py-2 text-sm font-bold text-violet-300 transition group-hover:bg-violet-500/30">
                Manage Project <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-5 transition-transform group-hover:scale-110">
              <Package className="h-32 w-32" />
            </div>
          </section>
        </Link>

        {/* Card Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STUDIO_MODULES.map((module) => {
            const Icon = iconMap[module.key] || Package;
            const isSaved = saveStatus[module.key];

            const Content = (
              <div
                className={`group relative flex h-40 flex-col justify-between rounded-xl border border-white/10 p-6 transition ${
                  module.comingSoon
                    ? "bg-white/[0.02] opacity-80"
                    : "bg-white/[0.05] hover:bg-white/[0.08] hover:shadow-glow"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-2 ${module.comingSoon ? "bg-slate-800 text-slate-500" : "bg-violet/20 text-violet-300"}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {module.comingSoon && (
                      <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Coming soon
                      </span>
                    )}

                    {!module.comingSoon && (
                       <span className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${
                         isSaved ? "border-mint/30 bg-mint/10 text-mint" : "border-white/5 bg-white/5 text-slate-600"
                       }`}>
                         {isSaved ? "Saved" : "Not saved"}
                       </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className={`text-lg font-semibold ${module.comingSoon ? "text-slate-400" : "text-white"}`}>
                    {module.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-1">{module.description}</p>
                  {!module.comingSoon && (
                    <div className="mt-2 flex items-center text-xs text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">
                      Open module <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  )}
                </div>
              </div>
            );

            if (!module.comingSoon) {
              return (
                <Link key={module.key} href={module.route}>
                  {Content}
                </Link>
              );
            }

            return <div key={module.key}>{Content}</div>;
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* First Show Testbed */}
          <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center gap-3 text-violet-300">
              <Clapperboard className="h-6 w-6" />
              <h3 className="text-xl font-semibold">ILLUVRSE Core</h3>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 text-sm font-medium text-slate-400 uppercase tracking-wider">Premise</h4>
                <p className="italic text-slate-200">
                  "A futuristic otter AI wakes up inside a forgotten digital universe and helps its creator rebuild imagination, one world at a time."
                </p>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-slate-400 uppercase tracking-wider">Characters</h4>
                <div className="flex flex-wrap gap-2">
                  {["The Otter", "Ryan", "Glitches", "The Void", "World Sparks"].map((char) => (
                    <span key={char} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-6">
            {/* Current Engine Status */}
            <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-violet-400" />
                <h3 className="font-semibold">Current Engine Status</h3>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                {engineStatus.map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-white/5 pb-2 text-sm">
                    <span className="text-slate-400">{item.label}</span>
                    <span className={item.status === "Active" ? "text-mint font-medium" : "text-slate-500"}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Next Recommended Build */}
            <section className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-6">
              <div className="mb-2 flex items-center gap-2 text-violet-300">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-semibold">Next Recommended Build</h3>
              </div>
              <h4 className="text-lg font-bold text-white">Timeline Planner v1</h4>
              <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                Define the first timing plan format with tracks, items, start times, durations, labels, and actions.
              </p>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
