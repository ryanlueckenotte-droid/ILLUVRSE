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
  Tag,
  Link as LinkIcon,
  FileJson,
  Package,
  ScrollText,
  Briefcase,
  Save,
  FolderOpen,
  Trash2
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { loadStudioJson, saveStudioJson, clearStudioJson, STORAGE_KEYS } from "@/lib/localStudioStorage";

type AssetType = "character" | "background" | "prop" | "effect" | "audio" | "ui" | "reference";
type AssetStatus = "planned" | "draft" | "ready" | "archived";

interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  description: string;
  tags: string[];
  style: string;
  path: string;
  linkedTo: string[];
}

interface AssetLibrary {
  version: number;
  id: string;
  title: string;
  project: string;
  assets: Asset[];
  productionNotes: string[];
}

const DEFAULT_LIBRARY: AssetLibrary = {
  version: 1,
  id: "assets-illuvrse-core",
  title: "ILLUVRSE Core Asset Library",
  project: "ILLUVRSE Core",
  assets: [
    {
      id: "asset-otter-core",
      name: "Otter Core Mascot",
      type: "character",
      status: "planned",
      description: "Reusable purple cosmic tech otter mascot asset.",
      tags: ["otter", "mascot", "character", "guide"],
      style: "purple cosmic tech otter with expressive eyes",
      path: "/assets/characters/otter-core.png",
      linkedTo: ["otter-ai", "scene-001", "timeline-episode-001"]
    },
    {
      id: "asset-cosmic-grid-bg",
      name: "Cosmic Grid Background",
      type: "background",
      status: "planned",
      description: "Dark digital universe grid background.",
      tags: ["background", "cosmic", "grid", "void"],
      style: "dark cosmic grid with violet glow",
      path: "/assets/backgrounds/cosmic-grid.png",
      linkedTo: ["scene-001", "panel-001"]
    },
    {
      id: "asset-world-spark",
      name: "World Spark",
      type: "prop",
      status: "planned",
      description: "Small green glowing idea orb that becomes a world.",
      tags: ["prop", "spark", "idea", "orb"],
      style: "mint green glowing orb",
      path: "/assets/props/world-spark.png",
      linkedTo: ["scene-002", "panel-004"]
    },
    {
      id: "asset-glitch-bug",
      name: "Glitch Bug",
      type: "effect",
      status: "planned",
      description: "Small chaotic bug-like glitch creature.",
      tags: ["glitch", "bug", "effect", "chaos"],
      style: "tiny neon corrupted bug",
      path: "/assets/effects/glitch-bug.png",
      linkedTo: ["panel-002"]
    },
    {
      id: "asset-awakening-sting",
      name: "Awakening Music Sting",
      type: "audio",
      status: "planned",
      description: "Short futuristic sound cue for the otter waking up.",
      tags: ["audio", "music", "sting", "awakening"],
      style: "futuristic soft synth rise",
      path: "/assets/audio/awakening-sting.mp3",
      linkedTo: ["timeline-episode-001"]
    }
  ],
  productionNotes: [
    "Assets are references only in v1. No file upload or file writing yet.",
    "Future versions should connect assets to scenes, storyboards, timelines, and exports."
  ]
};

const ASSET_TYPES: AssetType[] = ["character", "background", "prop", "effect", "audio", "ui", "reference"];
const ASSET_STATUSES: AssetStatus[] = ["planned", "draft", "ready", "archived"];

export default function AssetsLibraryPage() {
  const [library, setLibrary] = useState<AssetLibrary>(DEFAULT_LIBRARY);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(DEFAULT_LIBRARY.assets[0].id);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Raw text states for textareas to prevent cursor jumps
  const [rawNotes, setRawNotes] = useState(DEFAULT_LIBRARY.productionNotes.join("\n"));
  const [rawTags, setRawTags] = useState("");
  const [rawLinkedTo, setRawLinkedTo] = useState("");

  const selectedAsset = library.assets.find(a => a.id === selectedAssetId) || library.assets[0];

  // Sync raw states when selection or library resets and initial load
  useEffect(() => {
    const saved = loadStudioJson<AssetLibrary | null>(STORAGE_KEYS.ASSETS, null);
    if (saved) {
      setLibrary(saved);
      setRawNotes(saved.productionNotes.join("\n"));
      const currentAsset = saved.assets.find((a: any) => a.id === selectedAssetId) || saved.assets[0];
      setRawTags(currentAsset.tags.join("\n"));
      setRawLinkedTo(currentAsset.linkedTo.join("\n"));
      setStatusMessage("Loaded saved version");
      setTimeout(() => setStatusMessage(""), 3000);
    } else {
      setRawNotes(library.productionNotes.join("\n"));
    }
  }, []);

  useEffect(() => {
    setRawTags(selectedAsset.tags.join("\n"));
    setRawLinkedTo(selectedAsset.linkedTo.join("\n"));
  }, [selectedAssetId]);

  const saveLocally = () => {
    saveStudioJson(STORAGE_KEYS.ASSETS, library);
    setStatusMessage("Saved locally");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const loadSaved = () => {
    const saved = loadStudioJson<AssetLibrary | null>(STORAGE_KEYS.ASSETS, null);
    if (saved) {
      setLibrary(saved);
      setRawNotes(saved.productionNotes.join("\n"));
      const currentAsset = saved.assets.find((a: any) => a.id === selectedAssetId) || saved.assets[0];
      setRawTags(currentAsset.tags.join("\n"));
      setRawLinkedTo(currentAsset.linkedTo.join("\n"));
      setStatusMessage("Loaded saved version");
    } else {
      setStatusMessage("No saved version found");
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const clearSaved = () => {
    clearStudioJson(STORAGE_KEYS.ASSETS);
    setStatusMessage("Cleared saved version");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(library, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetLibrary = () => {
    if (confirm("Reset to default asset library?")) {
      setLibrary(DEFAULT_LIBRARY);
      setSelectedAssetId(DEFAULT_LIBRARY.assets[0].id);
      setStatusMessage("Reset to default");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const loadCoreAssets = () => {
    setLibrary(DEFAULT_LIBRARY);
    setSelectedAssetId(DEFAULT_LIBRARY.assets[0].id);
  };

  const updateLibraryField = (field: keyof AssetLibrary, value: any) => {
    setLibrary(prev => ({ ...prev, [field]: value }));
  };

  const handleNotesChange = (value: string) => {
    setRawNotes(value);
    const lines = value.split("\n").map(line => line.trim()).filter(line => line !== "");
    setLibrary(prev => ({ ...prev, productionNotes: lines }));
  };

  const updateAssetField = (assetId: string, field: keyof Asset, value: any) => {
    setLibrary(prev => ({
      ...prev,
      assets: prev.assets.map(a => a.id === assetId ? { ...a, [field]: value } : a)
    }));
  };

  const handleTagsChange = (value: string) => {
    setRawTags(value);
    const lines = value.split("\n").map(line => line.trim()).filter(line => line !== "");
    setLibrary(prev => ({
      ...prev,
      assets: prev.assets.map(a => a.id === selectedAssetId ? { ...a, tags: lines } : a)
    }));
  };

  const handleLinkedToChange = (value: string) => {
    setRawLinkedTo(value);
    const lines = value.split("\n").map(line => line.trim()).filter(line => line !== "");
    setLibrary(prev => ({
      ...prev,
      assets: prev.assets.map(a => a.id === selectedAssetId ? { ...a, linkedTo: lines } : a)
    }));
  };

  const AssetPlaceholder = ({ type }: { type: AssetType }) => {
    switch (type) {
      case "character":
        return (
          <div className="relative h-16 w-16 rounded-full bg-violet/20 border border-violet/40 flex items-center justify-center shadow-glow-sm">
            <div className="h-8 w-8 rounded-full bg-violet-400 blur-[2px] opacity-60" />
            <div className="absolute h-4 w-4 rounded-full bg-white opacity-40 top-2 right-2" />
          </div>
        );
      case "background":
        return (
          <div className="h-16 w-24 rounded-lg bg-gradient-to-br from-indigo-900/40 via-violet-900/40 to-black border border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:10px_10px]" />
          </div>
        );
      case "prop":
        return (
          <div className="h-12 w-12 rounded-lg bg-mint/10 border border-mint/30 flex items-center justify-center rotate-45">
            <div className="h-4 w-4 rounded-full bg-mint shadow-[0_0_10px_#42f58d]" />
          </div>
        );
      case "effect":
        return (
          <div className="grid grid-cols-2 gap-1">
            <div className="h-4 w-4 bg-pink-500/40 animate-pulse" />
            <div className="h-4 w-4 bg-cyan-500/40" />
            <div className="h-4 w-4 bg-violet-500/40" />
            <div className="h-4 w-4 bg-pink-500/40 animate-pulse delay-75" />
          </div>
        );
      case "audio":
        return (
          <div className="flex items-center gap-1 h-12">
            {[2, 4, 3, 5, 2, 6, 4, 3].map((h, i) => (
              <div key={i} className="w-1 bg-violet-400/60 rounded-full" style={{ height: `${h * 4}px` }} />
            ))}
          </div>
        );
      case "ui":
        return (
          <div className="h-16 w-20 rounded border border-white/20 bg-white/5 p-2">
            <div className="h-1 w-8 bg-white/20 rounded mb-1" />
            <div className="h-1 w-12 bg-white/10 rounded mb-2" />
            <div className="grid grid-cols-2 gap-1">
              <div className="h-4 bg-violet/30 rounded" />
              <div className="h-4 bg-white/10 rounded" />
            </div>
          </div>
        );
      case "reference":
        return (
          <div className="h-16 w-14 border border-white/20 bg-white/5 relative">
            <div className="absolute top-0 right-0 w-4 h-4 bg-white/20" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
            <div className="p-2 space-y-1">
              <div className="h-1 w-full bg-white/20 rounded" />
              <div className="h-1 w-full bg-white/10 rounded" />
              <div className="h-1 w-full bg-white/10 rounded" />
            </div>
          </div>
        );
      default:
        return <div className="h-16 w-16 bg-white/5 rounded-lg border border-white/10" />;
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

      <SectionHeader title="Assets Library" eyebrow="Reusable creative assets" />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Assets Grid */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {library.assets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setSelectedAssetId(asset.id)}
                className={`group relative flex flex-col text-left rounded-xl border p-4 transition-all ${
                  selectedAssetId === asset.id
                    ? "border-violet-500 bg-violet-500/5 shadow-glow-sm"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-20 w-full items-center justify-center bg-black/20 rounded-lg overflow-hidden">
                    <AssetPlaceholder type={asset.type} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white truncate">{asset.name}</h4>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      asset.status === 'ready' ? 'bg-mint/20 text-mint' :
                      asset.status === 'planned' ? 'bg-violet/20 text-violet-300' :
                      'bg-white/10 text-slate-400'
                    }`}>
                      {asset.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                      {asset.type}
                    </span>
                    <span className="truncate opacity-60">{asset.path}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 min-h-[2rem]">
                    {asset.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {asset.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[9px] text-slate-500 bg-black/30 px-1.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                    {asset.tags.length > 3 && (
                      <span className="text-[9px] text-slate-500">+{asset.tags.length - 3}</span>
                    )}
                  </div>
                </div>

                {selectedAssetId === asset.id && (
                  <div className="absolute -right-1 -top-1">
                    <div className="h-3 w-3 rounded-full bg-violet-500 shadow-glow" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={resetLibrary}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={() => {
                loadCoreAssets();
                setStatusMessage("Loaded Core Assets");
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

        {/* Right: Editor Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 max-h-[850px] overflow-y-auto custom-scrollbar">
            {/* Library Level Fields */}
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              Library Details
            </h3>
            <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
              <div>
                <label htmlFor="lib-title" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Library Title</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="lib-title"
                    type="text"
                    value={library.title}
                    onChange={(e) => updateLibraryField("title", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lib-project" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Project</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="lib-project"
                    type="text"
                    value={library.project}
                    onChange={(e) => updateLibraryField("project", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lib-notes" className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                  <ScrollText className="h-3.5 w-3.5" /> Production Notes (one per line)
                </label>
                <textarea
                  id="lib-notes"
                  value={rawNotes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Selected Asset Fields */}
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-violet-300">
              Selected Asset: <span className="text-white normal-case">{selectedAsset.name}</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="asset-name" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Asset Name</label>
                <input
                  id="asset-name"
                  type="text"
                  value={selectedAsset.name}
                  onChange={(e) => updateAssetField(selectedAsset.id, "name", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="asset-type" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Type</label>
                  <select
                    id="asset-type"
                    value={selectedAsset.type}
                    onChange={(e) => updateAssetField(selectedAsset.id, "type", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  >
                    {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="asset-status" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Status</label>
                  <select
                    id="asset-status"
                    value={selectedAsset.status}
                    onChange={(e) => updateAssetField(selectedAsset.id, "status", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  >
                    {ASSET_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="asset-desc" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Description</label>
                <textarea
                  id="asset-desc"
                  value={selectedAsset.description}
                  onChange={(e) => updateAssetField(selectedAsset.id, "description", e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label htmlFor="asset-style" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Visual Style / Style Guide</label>
                <input
                  id="asset-style"
                  type="text"
                  value={selectedAsset.style}
                  onChange={(e) => updateAssetField(selectedAsset.id, "style", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="asset-path" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Reference Path</label>
                <input
                  id="asset-path"
                  type="text"
                  value={selectedAsset.path}
                  onChange={(e) => updateAssetField(selectedAsset.id, "path", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="asset-tags" className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                    <Tag className="h-3.5 w-3.5" /> Tags
                  </label>
                  <textarea
                    id="asset-tags"
                    value={rawTags}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none font-mono text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="asset-links" className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                    <LinkIcon className="h-3.5 w-3.5" /> Linked To
                  </label>
                  <textarea
                    id="asset-links"
                    value={rawLinkedTo}
                    onChange={(e) => handleLinkedToChange(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none font-mono text-xs"
                  />
                </div>
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
                Asset JSON will eventually connect character sheets, backgrounds, props, sound cues, generated files, scene references, timeline tracks, and export packages.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-lg bg-black/20 p-3 text-xs text-slate-400">
                <Info className="h-4 w-4 shrink-0 text-violet-400" />
                This module bridges the gap between raw creative components and structured project orchestration.
              </div>
            </div>

            {/* Export Panel */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                  <FileJson className="h-4 w-4" /> Export Library JSON
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
                value={JSON.stringify(library, null, 2)}
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
