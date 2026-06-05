"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Package,
  AlertTriangle,
  ExternalLink,
  Type,
  FileText,
  Users,
  Film,
  Image as ImageIcon,
  Layers,
  Archive,
  Download,
  FlaskConical,
  Save,
  FolderOpen,
  Trash2
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { STUDIO_MODULES } from "@/lib/studioModules";
import { loadStudioJson, saveStudioJson, clearStudioJson, STORAGE_KEYS } from "@/lib/localStudioStorage";

const iconMap: Record<string, any> = {
  project: Package,
  characters: Users,
  scripts: FileText,
  storyboards: ImageIcon,
  scenes: Film,
  timeline: Layers,
  assets: Archive,
  exports: Download,
  canvas: FlaskConical
};

const DEFAULT_PROJECT_BUNDLE = {
  version: 1,
  id: "project-illuvrse-core-episode-001",
  title: "ILLUVRSE Core Episode 001",
  series: "ILLUVRSE Core",
  episodeTitle: "Otter Core Awakens",
  status: "planning",
  localFirst: true,
  modules: {
    characterId: "otter-ai",
    sceneId: "scene-001",
    scriptId: "episode-001",
    storyboardId: "storyboard-episode-001",
    timelineId: "timeline-episode-001",
    assetLibraryId: "assets-illuvrse-core",
    exportPlanId: "export-episode-001"
  },
  pipeline: [
    {
      step: "Character",
      route: "/studio/characters",
      status: "ready",
      summary: "Reusable otter AI guide character card."
    },
    {
      step: "Scene",
      route: "/studio/scenes",
      status: "ready",
      summary: "First saveable scene JSON for Otter Core Awakens."
    },
    {
      step: "Script",
      route: "/studio/scripts",
      status: "ready",
      summary: "Episode script with scenes, beats, and dialogue."
    },
    {
      step: "Storyboard",
      route: "/studio/storyboards",
      status: "ready",
      summary: "Panel-by-panel visual plan."
    },
    {
      step: "Timeline",
      route: "/studio/timeline",
      status: "ready",
      summary: "Timing plan with camera, character, dialogue, and effects tracks."
    },
    {
      step: "Assets",
      route: "/studio/assets",
      status: "ready",
      summary: "Reusable asset reference library."
    },
    {
      step: "Export",
      route: "/studio/exports",
      status: "ready",
      summary: "Local-first export and package metadata."
    }
  ],
  nextActions: [
    "Connect Script Builder output to Storyboard Builder defaults.",
    "Connect Storyboard panels to Timeline Planner defaults.",
    "Connect Asset Library references to Scene and Timeline data.",
    "Later: save this bundle as a local JSON file."
  ],
  productionNotes: [
    "This bundle is a manifest only in v1.",
    "No files are written yet.",
    "Future versions should load/save project bundles locally."
  ]
};

export default function ProjectBundlePage() {
  const [bundle, setBundle] = useState(DEFAULT_PROJECT_BUNDLE);
  const [copied, setCopied] = useState(false);
  const [rawNextActions, setRawNextActions] = useState(DEFAULT_PROJECT_BUNDLE.nextActions.join("\n"));
  const [rawProductionNotes, setRawProductionNotes] = useState(DEFAULT_PROJECT_BUNDLE.productionNotes.join("\n"));
  const [statusMessage, setStatusMessage] = useState("");

  // Initial load
  useEffect(() => {
    const saved = loadStudioJson<typeof DEFAULT_PROJECT_BUNDLE | null>(STORAGE_KEYS.PROJECT, null);
    if (saved) {
      setBundle(saved);
      setRawNextActions(saved.nextActions?.join("\n") || "");
      setRawProductionNotes(saved.productionNotes?.join("\n") || "");
      setStatusMessage("Loaded saved version");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  }, []);

  const saveLocally = () => {
    saveStudioJson(STORAGE_KEYS.PROJECT, bundle);
    setStatusMessage("Saved locally");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const loadSaved = () => {
    const saved = loadStudioJson<typeof DEFAULT_PROJECT_BUNDLE | null>(STORAGE_KEYS.PROJECT, null);
    if (saved) {
      setBundle(saved);
      setRawNextActions(saved.nextActions?.join("\n") || "");
      setRawProductionNotes(saved.productionNotes?.join("\n") || "");
      setStatusMessage("Loaded saved version");
    } else {
      setStatusMessage("No saved version found");
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const clearSaved = () => {
    clearStudioJson(STORAGE_KEYS.PROJECT);
    setStatusMessage("Cleared saved version");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(bundle, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetBundle = () => {
    if (confirm("Reset project bundle to default?")) {
      setBundle(DEFAULT_PROJECT_BUNDLE);
      setRawNextActions(DEFAULT_PROJECT_BUNDLE.nextActions.join("\n"));
      setRawProductionNotes(DEFAULT_PROJECT_BUNDLE.productionNotes.join("\n"));
      setStatusMessage("Reset to default");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const updateField = (path: string, value: any) => {
    const parts = path.split(".");

    if (parts.length === 1) {
      setBundle(prev => ({ ...prev, [parts[0]]: value }));
      return;
    }

    if (parts.length === 2) {
      const [parent, child] = parts;
      setBundle(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof DEFAULT_PROJECT_BUNDLE] as object),
          [child]: value
        }
      }));
    }
  };

  const updateNextActions = (value: string) => {
    setRawNextActions(value);
    const lines = value.split("\n").map(l => l.trim()).filter(l => l !== "");
    setBundle(prev => ({ ...prev, nextActions: lines }));
  };

  const updateProductionNotes = (value: string) => {
    setRawProductionNotes(value);
    const lines = value.split("\n").map(l => l.trim()).filter(l => l !== "");
    setBundle(prev => ({ ...prev, productionNotes: lines }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ready": return "text-mint border-mint/30 bg-mint/10";
      case "planning": return "text-violet-300 border-violet-500/30 bg-violet-500/10";
      case "blocked": return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      case "future": return "text-slate-500 border-white/10 bg-white/5";
      default: return "text-slate-400 border-white/10 bg-white/5";
    }
  };

  return (
    <AppShell>
      <div className="mb-4">
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Studio
        </Link>
      </div>

      <SectionHeader title="Project Bundle" eyebrow="Episode manifest" />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left column: Summary & Pipeline */}
        <div className="lg:col-span-7 space-y-8">
          {/* Hero/Summary Panel */}
          <section className="rounded-xl border border-white/10 bg-white/[0.03] p-8 shadow-glow overflow-hidden relative">
            <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-violet/10 blur-3xl" />
            <div className="relative z-10">
              <div className="mb-2 flex items-center gap-3">
                <Package className="h-6 w-6 text-violet-400" />
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(bundle.status)}`}>
                  {bundle.status}
                </span>
              </div>
              <h2 className="text-4xl font-black tracking-tight text-white mb-2">{bundle.title}</h2>
              <p className="text-xl text-slate-300 font-medium">{bundle.series} • {bundle.episodeTitle}</p>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <button
                  onClick={resetBundle}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                <button
                   onClick={() => {
                     setBundle(DEFAULT_PROJECT_BUNDLE);
                     setRawNextActions(DEFAULT_PROJECT_BUNDLE.nextActions.join("\n"));
                     setRawProductionNotes(DEFAULT_PROJECT_BUNDLE.productionNotes.join("\n"));
                     setStatusMessage("Loaded ILLUVRSE Core");
                     setTimeout(() => setStatusMessage(""), 3000);
                   }}
                   className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/20 transition"
                >
                  <Package className="h-4 w-4" />
                  Load Core
                </button>

                <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

                <button
                  onClick={saveLocally}
                  className="flex items-center gap-2 rounded-lg border border-mint/30 bg-mint/5 px-4 py-2 text-sm font-medium text-mint hover:bg-mint/10 transition"
                >
                  <Save className="h-4 w-4" />
                  Save Locally
                </button>
                <button
                  onClick={loadSaved}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition"
                >
                  <FolderOpen className="h-4 w-4" />
                  Load Saved
                </button>
                <button
                  onClick={clearSaved}
                  className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </button>

                {statusMessage && (
                  <span className="text-xs font-medium text-violet-300 animate-pulse ml-2">
                    {statusMessage}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Linked Modules View */}
          <section>
            <h3 className="mb-6 text-sm font-medium uppercase tracking-wider text-slate-400">Open Linked Modules</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {STUDIO_MODULES.filter(m => !m.comingSoon && m.key !== "project").map((module) => {
                const Icon = iconMap[module.key] || Package;
                const linkedId = module.linkId ? (bundle.modules as any)[module.linkId] : null;

                return (
                  <Link key={module.key} href={module.route}>
                    <div className="group flex h-full flex-col justify-between rounded-xl border border-white/10 bg-white/[0.05] p-5 hover:bg-white/[0.08] hover:shadow-glow transition-all">
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="rounded-lg bg-violet-500/10 p-1.5 text-violet-300 group-hover:bg-violet-500/20 transition-colors">
                               <Icon className="h-4 w-4" />
                             </div>
                             <h4 className="font-bold text-white group-hover:text-violet-300 transition-colors">{module.title}</h4>
                          </div>
                          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusColor("ready")}`}>
                            ready
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-2">{module.purpose}</p>
                        {linkedId && (
                           <div className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-[10px] font-mono text-violet-300">
                             <span className="text-slate-500">ID:</span> {linkedId}
                           </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                        <ExternalLink className="h-3 w-3" />
                        {module.route}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right column: Editor Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 max-h-[1000px] overflow-y-auto custom-scrollbar">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400 border-b border-white/5 pb-4">
              Manifest Editor
            </h3>

            <div className="space-y-6">
              {/* Project Info */}
              <div className="space-y-4">
                 <div>
                  <label htmlFor="bundle-title" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Project Title</label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="bundle-title"
                      type="text"
                      value={bundle.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Series</label>
                    <input
                      type="text"
                      value={bundle.series}
                      onChange={(e) => updateField("series", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Episode Title</label>
                    <input
                      type="text"
                      value={bundle.episodeTitle}
                      onChange={(e) => updateField("episodeTitle", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Status</label>
                  <select
                    value={bundle.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none appearance-none"
                  >
                    <option value="planning">planning</option>
                    <option value="ready">ready</option>
                    <option value="blocked">blocked</option>
                    <option value="archived">archived</option>
                  </select>
                </div>
              </div>

              {/* Module IDs */}
              <div>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-600 border-t border-white/5 pt-6">Module References</h4>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-slate-500 uppercase">Character ID</label>
                      <input
                        type="text"
                        value={bundle.modules.characterId}
                        onChange={(e) => updateField("modules.characterId", e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-xs text-white focus:border-violet/50 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-slate-500 uppercase">Scene ID</label>
                      <input
                        type="text"
                        value={bundle.modules.sceneId}
                        onChange={(e) => updateField("modules.sceneId", e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-xs text-white focus:border-violet/50 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-slate-500 uppercase">Script ID</label>
                      <input
                        type="text"
                        value={bundle.modules.scriptId}
                        onChange={(e) => updateField("modules.scriptId", e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-xs text-white focus:border-violet/50 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-slate-500 uppercase">Storyboard ID</label>
                      <input
                        type="text"
                        value={bundle.modules.storyboardId}
                        onChange={(e) => updateField("modules.storyboardId", e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-xs text-white focus:border-violet/50 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-slate-500 uppercase">Timeline ID</label>
                      <input
                        type="text"
                        value={bundle.modules.timelineId}
                        onChange={(e) => updateField("modules.timelineId", e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-xs text-white focus:border-violet/50 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-slate-500 uppercase">Asset Lib ID</label>
                      <input
                        type="text"
                        value={bundle.modules.assetLibraryId}
                        onChange={(e) => updateField("modules.assetLibraryId", e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-xs text-white focus:border-violet/50 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-medium text-slate-500 uppercase">Export Plan ID</label>
                    <input
                      type="text"
                      value={bundle.modules.exportPlanId}
                      onChange={(e) => updateField("modules.exportPlanId", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-xs text-white focus:border-violet/50 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Lists */}
              <div className="space-y-4 border-t border-white/5 pt-6">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Next Actions (one per line)</label>
                  <textarea
                    value={rawNextActions}
                    onChange={(e) => updateNextActions(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Production Notes</label>
                  <textarea
                    value={rawProductionNotes}
                    onChange={(e) => updateProductionNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Panels and Export */}
        <div className="lg:col-span-12 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {/* Info/Warning Panel */}
             <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6">
              <div className="mb-4 flex items-center gap-2 text-rose-400">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-semibold uppercase tracking-wider text-xs">Technical Status</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Project Bundle v1 is a manifest only. It does not read or write local files yet. It defines the structure for future local-first save/load cycles.
              </p>
              <div className="rounded-lg bg-black/20 p-3 border border-white/5">
                <p className="text-[11px] text-slate-400 leading-tight">
                  <span className="text-violet-300 font-bold">Local Save/Load v1:</span> This module stores its manifest in your browser localStorage. Real file-based project save/load comes later.
                </p>
              </div>
            </div>

            {/* Future Bridge Panel */}
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
              <div className="mb-4 flex items-center gap-2 text-violet-300">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-semibold uppercase tracking-wider text-xs">Future Bridge</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Project Bundle JSON will eventually become the local save/load format that connects scripts, scenes, characters, storyboards, timelines, assets, and exports into one portable creative universe.
              </p>
            </div>

            {/* Quick Stats Panel */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
               <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Bundle Integrity</h3>
               <div className="space-y-3">
                 <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-400">Version</span>
                   <span className="text-violet-300">1.0</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-400">Module Refs</span>
                   <span className="text-violet-300">{Object.keys(bundle.modules).length} active</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-400">Pipeline Steps</span>
                   <span className="text-violet-300">{bundle.pipeline.length} steps</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-400">Local-First</span>
                   <span className="text-mint font-bold">Enabled</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Export Panel */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                <FileText className="h-4 w-4" />
                Export Project Manifest JSON
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  copied
                    ? "bg-mint/20 text-mint"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy JSON"}
              </button>
            </div>
            <textarea
              readOnly
              value={JSON.stringify(bundle, null, 2)}
              rows={12}
              className="w-full rounded-lg border border-white/10 bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-violet-200 focus:outline-none custom-scrollbar"
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
