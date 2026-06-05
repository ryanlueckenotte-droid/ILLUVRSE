"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Type,
  Layout,
  Clock,
  Settings2,
  FileJson,
  Package,
  ScrollText,
  Briefcase,
  Monitor,
  Youtube,
  Smartphone,
  ImageIcon,
  Save,
  FolderOpen,
  Trash2
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { loadStudioJson, saveStudioJson, clearStudioJson, STORAGE_KEYS } from "@/lib/localStudioStorage";

type ExportFormat = "mp4" | "gif" | "webm" | "png-sequence" | "json-bundle";
type ExportStatus = "planned" | "draft" | "ready" | "exported" | "archived";

interface ExportTarget {
  id: string;
  platform: string;
  format: ExportFormat;
  aspectRatio: string;
  resolution: string;
  durationSeconds: number;
  status: ExportStatus;
  description: string;
}

interface ExportPlan {
  version: number;
  id: string;
  project: string;
  episodeTitle: string;
  sourceRefs: {
    scriptId: string;
    storyboardId: string;
    timelineId: string;
    assetLibraryId: string;
  };
  targets: ExportTarget[];
  package: {
    folder: string;
    includeJson: boolean;
    includeAssets: boolean;
    includeCaptions: boolean;
    includeThumbnail: boolean;
  };
  publishingNotes: string[];
  productionNotes: string[];
}

const DEFAULT_PLAN: ExportPlan = {
  version: 1,
  id: "export-episode-001",
  project: "ILLUVRSE Core",
  episodeTitle: "Otter Core Awakens",
  sourceRefs: {
    scriptId: "episode-001",
    storyboardId: "storyboard-episode-001",
    timelineId: "timeline-episode-001",
    assetLibraryId: "assets-illuvrse-core"
  },
  targets: [
    {
      id: "target-youtube-short",
      platform: "YouTube Shorts",
      format: "mp4",
      aspectRatio: "9:16",
      resolution: "1080x1920",
      durationSeconds: 60,
      status: "planned",
      description: "Vertical short-form version for YouTube Shorts."
    },
    {
      id: "target-tiktok",
      platform: "TikTok",
      format: "mp4",
      aspectRatio: "9:16",
      resolution: "1080x1920",
      durationSeconds: 60,
      status: "planned",
      description: "Vertical short-form version for TikTok."
    },
    {
      id: "target-web",
      platform: "Web Episode",
      format: "mp4",
      aspectRatio: "16:9",
      resolution: "1920x1080",
      durationSeconds: 180,
      status: "planned",
      description: "Full web episode export for the ILLUVRSE site."
    },
    {
      id: "target-gif-preview",
      platform: "GIF Preview",
      format: "gif",
      aspectRatio: "16:9",
      resolution: "960x540",
      durationSeconds: 10,
      status: "planned",
      description: "Short looping preview for testing motion."
    }
  ],
  package: {
    folder: "/exports/episode-001",
    includeJson: true,
    includeAssets: true,
    includeCaptions: true,
    includeThumbnail: true
  },
  publishingNotes: [
    "No real publishing automation in v1.",
    "This export plan defines intended outputs and packaging metadata only."
  ],
  productionNotes: [
    "Future versions should connect this to rendering, captions, thumbnails, and publishing workflows.",
    "Keep all exports local-first and user-approved."
  ]
};

const FORMATS: ExportFormat[] = ["mp4", "gif", "webm", "png-sequence", "json-bundle"];
const STATUSES: ExportStatus[] = ["planned", "draft", "ready", "exported", "archived"];

export default function ExportPlannerPage() {
  const [plan, setPlan] = useState<ExportPlan>(DEFAULT_PLAN);
  const [selectedTargetId, setSelectedTargetId] = useState<string>(DEFAULT_PLAN.targets[0].id);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Raw text states for textareas
  const [rawPublishingNotes, setRawPublishingNotes] = useState(DEFAULT_PLAN.publishingNotes.join("\n"));
  const [rawProductionNotes, setRawProductionNotes] = useState(DEFAULT_PLAN.productionNotes.join("\n"));

  const selectedTarget = plan.targets.find(t => t.id === selectedTargetId) || plan.targets[0];

  // Sync raw states when plan resets and initial load
  useEffect(() => {
    const saved = loadStudioJson<ExportPlan | null>(STORAGE_KEYS.EXPORT_PLAN, null);
    if (saved) {
      setPlan(saved);
      setRawPublishingNotes(saved.publishingNotes.join("\n"));
      setRawProductionNotes(saved.productionNotes.join("\n"));
      setStatusMessage("Loaded saved version");
      setTimeout(() => setStatusMessage(""), 3000);
    } else {
      setRawPublishingNotes(plan.publishingNotes.join("\n"));
      setRawProductionNotes(plan.productionNotes.join("\n"));
    }
  }, []);

  const saveLocally = () => {
    saveStudioJson(STORAGE_KEYS.EXPORT_PLAN, plan);
    setStatusMessage("Saved locally");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const loadSaved = () => {
    const saved = loadStudioJson<ExportPlan | null>(STORAGE_KEYS.EXPORT_PLAN, null);
    if (saved) {
      setPlan(saved);
      setRawPublishingNotes(saved.publishingNotes.join("\n"));
      setRawProductionNotes(saved.productionNotes.join("\n"));
      setStatusMessage("Loaded saved version");
    } else {
      setStatusMessage("No saved version found");
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const clearSaved = () => {
    clearStudioJson(STORAGE_KEYS.EXPORT_PLAN);
    setStatusMessage("Cleared saved version");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetPlan = () => {
    if (confirm("Reset to default export plan?")) {
      setPlan(DEFAULT_PLAN);
      setSelectedTargetId(DEFAULT_PLAN.targets[0].id);
      setStatusMessage("Reset to default");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const loadOtterPlan = () => {
    setPlan(DEFAULT_PLAN);
    setSelectedTargetId(DEFAULT_PLAN.targets[0].id);
  };

  const updatePlanField = (field: keyof ExportPlan, value: any) => {
    setPlan(prev => ({ ...prev, [field]: value }));
  };

  const updateSourceRef = (field: keyof ExportPlan["sourceRefs"], value: string) => {
    setPlan(prev => ({
      ...prev,
      sourceRefs: { ...prev.sourceRefs, [field]: value }
    }));
  };

  const updatePackageField = (field: keyof ExportPlan["package"], value: any) => {
    setPlan(prev => ({
      ...prev,
      package: { ...prev.package, [field]: value }
    }));
  };

  const handlePublishingNotesChange = (value: string) => {
    setRawPublishingNotes(value);
    const lines = value.split("\n").map(line => line.trim()).filter(line => line !== "");
    setPlan(prev => ({ ...prev, publishingNotes: lines }));
  };

  const handleProductionNotesChange = (value: string) => {
    setRawProductionNotes(value);
    const lines = value.split("\n").map(line => line.trim()).filter(line => line !== "");
    setPlan(prev => ({ ...prev, productionNotes: lines }));
  };

  const updateTargetField = (targetId: string, field: keyof ExportTarget, value: any) => {
    let finalValue = value;

    if (field === "durationSeconds") {
      const parsed = parseInt(value);
      if (isNaN(parsed) || parsed < 1) {
        finalValue = 60;
      } else {
        finalValue = parsed;
      }
    }

    setPlan(prev => ({
      ...prev,
      targets: prev.targets.map(t => t.id === targetId ? { ...t, [field]: finalValue } : t)
    }));
  };

  const TargetPlaceholder = ({ target }: { target: ExportTarget }) => {
    const isVertical = target.aspectRatio === "9:16";

    let accentColor = "bg-violet-500";
    let Icon = Monitor;

    if (target.platform.toLowerCase().includes("youtube")) {
      accentColor = "bg-red-500";
      Icon = Youtube;
    } else if (target.platform.toLowerCase().includes("tiktok")) {
      accentColor = "bg-cyan-500";
      Icon = Smartphone;
    } else if (target.format === "gif") {
      accentColor = "bg-mint";
      Icon = ImageIcon;
    } else if (target.platform.toLowerCase().includes("web")) {
      accentColor = "bg-violet-500";
      Icon = Monitor;
    }

    return (
      <div className={`relative flex items-center justify-center rounded-lg border border-white/10 bg-black/40 overflow-hidden ${isVertical ? "h-32 w-20" : "h-20 w-32"}`}>
        <div className={`absolute inset-0 opacity-10 ${accentColor}`} />
        <Icon className={`h-8 w-8 text-white/40`} />
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${accentColor} opacity-50`} />
        {target.format === "mp4" && (
          <div className="absolute top-1 right-1 flex gap-0.5">
            <div className="h-1 w-1 rounded-full bg-white/40" />
            <div className="h-1 w-1 rounded-full bg-white/40" />
          </div>
        )}
      </div>
    );
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

      <SectionHeader title="Export Planner" eyebrow="Package and publishing plan" />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Export Targets Grid */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {plan.targets.map((target) => (
              <button
                key={target.id}
                onClick={() => setSelectedTargetId(target.id)}
                className={`group relative flex flex-col text-left rounded-xl border p-4 transition-all ${
                  selectedTargetId === target.id
                    ? "border-violet-500 bg-violet-500/5 shadow-glow-sm"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-36 w-full items-center justify-center bg-black/20 rounded-lg overflow-hidden">
                    <TargetPlaceholder target={target} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white truncate">{target.platform}</h4>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      target.status === 'ready' ? 'bg-mint/20 text-mint' :
                      target.status === 'planned' ? 'bg-violet/20 text-violet-300' :
                      'bg-white/10 text-slate-400'
                    }`}>
                      {target.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                      {target.format}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                      {target.aspectRatio}
                    </span>
                    <span className="truncate opacity-60">{target.resolution}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 min-h-[2rem]">
                    {target.description}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1 text-[10px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{target.durationSeconds}s</span>
                  </div>
                </div>

                {selectedTargetId === target.id && (
                  <div className="absolute -right-1 -top-1">
                    <div className="h-3 w-3 rounded-full bg-violet-500 shadow-glow" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={resetPlan}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={() => {
                loadOtterPlan();
                setStatusMessage("Loaded Core Plan");
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

          {/* Warning/Info Panel */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/80 leading-relaxed">
              Export Planner v1 does not render video or publish anywhere. It only defines local-first export metadata.
            </p>
          </div>
        </div>

        {/* Right: Editor Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 max-h-[850px] overflow-y-auto custom-scrollbar">
            {/* Plan Level Fields */}
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              Plan Details
            </h3>
            <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
              <div>
                <label htmlFor="plan-project" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Project</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="plan-project"
                    type="text"
                    value={plan.project}
                    onChange={(e) => updatePlanField("project", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="plan-title" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Episode Title</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="plan-title"
                    type="text"
                    value={plan.episodeTitle}
                    onChange={(e) => updatePlanField("episodeTitle", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ref-script" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Script ID</label>
                  <input
                    id="ref-script"
                    type="text"
                    value={plan.sourceRefs.scriptId}
                    onChange={(e) => updateSourceRef("scriptId", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="ref-storyboard" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Storyboard ID</label>
                  <input
                    id="ref-storyboard"
                    type="text"
                    value={plan.sourceRefs.storyboardId}
                    onChange={(e) => updateSourceRef("storyboardId", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ref-timeline" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Timeline ID</label>
                  <input
                    id="ref-timeline"
                    type="text"
                    value={plan.sourceRefs.timelineId}
                    onChange={(e) => updateSourceRef("timelineId", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="ref-assets" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Asset Library ID</label>
                  <input
                    id="ref-assets"
                    type="text"
                    value={plan.sourceRefs.assetLibraryId}
                    onChange={(e) => updateSourceRef("assetLibraryId", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Selected Target Fields */}
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-violet-300">
              Selected Target: <span className="text-white normal-case">{selectedTarget.platform}</span>
            </h3>
            <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
              <div>
                <label htmlFor="target-platform" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Platform</label>
                <input
                  id="target-platform"
                  type="text"
                  value={selectedTarget.platform}
                  onChange={(e) => updateTargetField(selectedTarget.id, "platform", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="target-format" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Format</label>
                  <select
                    id="target-format"
                    value={selectedTarget.format}
                    onChange={(e) => updateTargetField(selectedTarget.id, "format", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  >
                    {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="target-status" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Status</label>
                  <select
                    id="target-status"
                    value={selectedTarget.status}
                    onChange={(e) => updateTargetField(selectedTarget.id, "status", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="target-aspect" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Aspect Ratio</label>
                  <input
                    id="target-aspect"
                    type="text"
                    value={selectedTarget.aspectRatio}
                    onChange={(e) => updateTargetField(selectedTarget.id, "aspectRatio", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="target-res" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Resolution</label>
                  <input
                    id="target-res"
                    type="text"
                    value={selectedTarget.resolution}
                    onChange={(e) => updateTargetField(selectedTarget.id, "resolution", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="target-duration" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Duration (seconds)</label>
                <input
                  id="target-duration"
                  type="number"
                  min="1"
                  value={selectedTarget.durationSeconds}
                  onChange={(e) => updateTargetField(selectedTarget.id, "durationSeconds", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="target-desc" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Description</label>
                <textarea
                  id="target-desc"
                  value={selectedTarget.description}
                  onChange={(e) => updateTargetField(selectedTarget.id, "description", e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Package Fields */}
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              Package Options
            </h3>
            <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
              <div>
                <label htmlFor="pkg-folder" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Export Folder</label>
                <input
                  id="pkg-folder"
                  type="text"
                  value={plan.package.folder}
                  onChange={(e) => updatePackageField("folder", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={plan.package.includeJson}
                    onChange={(e) => updatePackageField("includeJson", e.target.checked)}
                    className="h-4 w-4 rounded border-white/10 bg-black/20 text-violet-500 focus:ring-violet/50"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Include JSON</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={plan.package.includeAssets}
                    onChange={(e) => updatePackageField("includeAssets", e.target.checked)}
                    className="h-4 w-4 rounded border-white/10 bg-black/20 text-violet-500 focus:ring-violet/50"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Include Assets</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={plan.package.includeCaptions}
                    onChange={(e) => updatePackageField("includeCaptions", e.target.checked)}
                    className="h-4 w-4 rounded border-white/10 bg-black/20 text-violet-500 focus:ring-violet/50"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Include Captions</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={plan.package.includeThumbnail}
                    onChange={(e) => updatePackageField("includeThumbnail", e.target.checked)}
                    className="h-4 w-4 rounded border-white/10 bg-black/20 text-violet-500 focus:ring-violet/50"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Include Thumbnail</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-6">
              <div>
                <label htmlFor="publishing-notes" className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                  <Settings2 className="h-3.5 w-3.5" /> Publishing Notes (one per line)
                </label>
                <textarea
                  id="publishing-notes"
                  value={rawPublishingNotes}
                  onChange={(e) => handlePublishingNotesChange(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label htmlFor="production-notes" className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                  <ScrollText className="h-3.5 w-3.5" /> Production Notes (one per line)
                </label>
                <textarea
                  id="production-notes"
                  value={rawProductionNotes}
                  onChange={(e) => handleProductionNotesChange(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Export & Future Bridge */}
        <div className="lg:col-span-12 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Future Bridge Panel */}
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6 flex flex-col justify-center">
              <div className="mb-4 flex items-center gap-2 text-violet-300">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-semibold">Future Bridge</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Export Plan JSON will eventually connect rendering settings, captions, thumbnails, local files, platform packaging, and publishing workflows.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-lg bg-black/20 p-3 text-xs text-slate-400">
                <Layout className="h-4 w-4 shrink-0 text-violet-400" />
                This module bridges the gap between local creation and multi-platform distribution.
              </div>
            </div>

            {/* Export Panel */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                  <FileJson className="h-4 w-4" /> Export Plan JSON
                </h3>
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
                value={JSON.stringify(plan, null, 2)}
                rows={10}
                className="w-full rounded-lg border border-white/10 bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-violet-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
