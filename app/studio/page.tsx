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
  Zap
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";

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

const studioSections = [
  { label: "Worlds", icon: Globe, comingSoon: true },
  { label: "Characters", icon: Users, href: "/studio/characters" },
  { label: "Scripts", icon: FileText, href: "/studio/scripts" },
  { label: "Storyboards", icon: ImageIcon, href: "/studio/storyboards" },
  { label: "Scenes", icon: Film, href: "/studio/scenes" },
  { label: "Timeline", icon: Layers, href: "/studio/timeline" },
  { label: "Assets", icon: Archive, comingSoon: true },
  { label: "Exports", icon: Download, comingSoon: true },
  { label: "Canvas Lab", icon: FlaskConical, href: "/lab/canvas" }
];

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

        {/* Card Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studioSections.map((section) => {
            const Icon = section.icon;
            const Content = (
              <div
                className={`group relative flex h-40 flex-col justify-between rounded-xl border border-white/10 p-6 transition ${
                  section.comingSoon
                    ? "bg-white/[0.02] opacity-80"
                    : "bg-white/[0.05] hover:bg-white/[0.08] hover:shadow-glow"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-2 ${section.comingSoon ? "bg-slate-800 text-slate-500" : "bg-violet/20 text-violet-300"}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {section.comingSoon && (
                    <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Coming soon
                    </span>
                  )}
                </div>
                <div>
                  <h4 className={`text-lg font-semibold ${section.comingSoon ? "text-slate-400" : "text-white"}`}>
                    {section.label}
                  </h4>
                  {!section.comingSoon && (
                    <div className="mt-1 flex items-center text-xs text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">
                      Open module <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  )}
                </div>
              </div>
            );

            if (section.href) {
              return (
                <Link key={section.label} href={section.href}>
                  {Content}
                </Link>
              );
            }

            return <div key={section.label}>{Content}</div>;
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
