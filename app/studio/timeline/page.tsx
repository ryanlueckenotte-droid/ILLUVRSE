"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
  Type,
  AlignLeft,
  Info,
  ScrollText,
  Video,
  User,
  MessageSquare,
  Zap,
  Activity,
  Save,
  FolderOpen,
  Trash2
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { loadStudioJson, saveStudioJson, clearStudioJson, STORAGE_KEYS } from "@/lib/localStudioStorage";
import { Timeline } from "@/lib/studioTypes";
import { DEFAULT_TIMELINE } from "@/lib/studioDefaults";

const TRACK_CONFIG = {
  camera: { color: "violet", icon: Video, bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-300" },
  character: { color: "blue", icon: User, bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-300" },
  dialogue: { color: "mint", icon: MessageSquare, bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
  effects: { color: "pink", icon: Zap, bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-300" },
};

export default function TimelinePlannerPage() {
  const [timeline, setTimeline] = useState<Timeline>(DEFAULT_TIMELINE);
  const [selectedItemId, setSelectedItemId] = useState<string | null>("cam-001");
  const [copied, setCopied] = useState(false);
  const [rawProductionNotes, setRawProductionNotes] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Initial load
  useEffect(() => {
    const saved = loadStudioJson<Timeline | null>(STORAGE_KEYS.TIMELINE, null);
    if (saved) {
      setTimeline(saved);
      setRawProductionNotes(saved.productionNotes.join("\n"));
      setStatusMessage("Loaded saved version");
      setTimeout(() => setStatusMessage(""), 3000);
    } else {
      setRawProductionNotes(DEFAULT_TIMELINE.productionNotes.join("\n"));
    }
  }, []);

  const saveLocally = () => {
    saveStudioJson(STORAGE_KEYS.TIMELINE, timeline);
    setStatusMessage("Saved locally");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const loadSaved = () => {
    const saved = loadStudioJson<Timeline | null>(STORAGE_KEYS.TIMELINE, null);
    if (saved) {
      setTimeline(saved);
      setRawProductionNotes(saved.productionNotes.join("\n"));
      setStatusMessage("Loaded saved version");
    } else {
      setStatusMessage("No saved version found");
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const clearSaved = () => {
    clearStudioJson(STORAGE_KEYS.TIMELINE);
    setStatusMessage("Cleared saved version");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(timeline, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetTimeline = () => {
    if (confirm("Reset to default timeline?")) {
      setTimeline(DEFAULT_TIMELINE);
      setSelectedItemId("cam-001");
      setRawProductionNotes(DEFAULT_TIMELINE.productionNotes.join("\n"));
      setStatusMessage("Reset to default");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const findSelectedItem = () => {
    for (const track of timeline.tracks) {
      const item = track.items.find(i => i.id === selectedItemId);
      if (item) return { item, trackType: track.type };
    }
    return null;
  };

  const selectedData = findSelectedItem();

  const updateTimelineField = (field: string, value: any) => {
    if (field === "fps") {
      const num = parseInt(value) || 24;
      setTimeline({ ...timeline, [field]: Math.max(1, num) });
    } else if (field === "durationSeconds") {
      const num = parseFloat(value) || 20;
      setTimeline({ ...timeline, [field]: Math.max(1, num) });
    } else {
      setTimeline({ ...timeline, [field]: value });
    }
  };

  const updateItemField = (itemId: string, field: string, value: any) => {
    const updatedTracks = timeline.tracks.map(track => ({
      ...track,
      items: track.items.map(item => {
        if (item.id === itemId) {
          if (field === "start" || field === "duration") {
            const num = parseFloat(value) || 0;
            return { ...item, [field]: Math.max(0, num) };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    }));
    setTimeline({ ...timeline, tracks: updatedTracks });
  };

  const handleProductionNotesChange = (val: string) => {
    setRawProductionNotes(val);
    const notes = val.split("\n").map(l => l.trim()).filter(l => l !== "");
    setTimeline({ ...timeline, productionNotes: notes });
  };

  // Timeline Scale Helpers
  const duration = timeline.durationSeconds || 20;
  const markers: number[] = [];
  const markerStep = 5;
  for (let i = 0; i <= duration; i += markerStep) {
    markers.push(i);
  }

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

      <SectionHeader title="Timeline Planner" eyebrow="Animation timing plan" />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Visual Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 overflow-hidden">
            <div className="relative">
              {/* Time Markers */}
              <div className="mb-4 flex h-6 items-end border-b border-white/10 pb-1">
                <div className="w-24 shrink-0" /> {/* Track Name spacer */}
                <div className="relative flex-1">
                  {markers.map(m => (
                    <div
                      key={m}
                      className="absolute top-0 flex flex-col items-center -translate-x-1/2"
                      style={{ left: `${(m / duration) * 100}%` }}
                    >
                      <span className="text-[10px] font-mono text-slate-500">{m}s</span>
                      <div className="h-1 w-px bg-slate-700" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracks */}
              <div className="space-y-4">
                {timeline.tracks.map(track => {
                  const config = TRACK_CONFIG[track.type as keyof typeof TRACK_CONFIG];
                  const Icon = config.icon;

                  return (
                    <div key={track.id} className="flex gap-4">
                      <div className="flex w-24 shrink-0 flex-col justify-center">
                        <div className={`flex items-center gap-1.5 ${config.text}`}>
                          <Icon className="h-3 w-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{track.name}</span>
                        </div>
                      </div>

                      <div className="relative h-12 flex-1 rounded-md bg-black/20 border border-white/5">
                        {/* Grid Lines */}
                        {markers.map(m => (
                          <div
                            key={m}
                            className="absolute top-0 bottom-0 w-px bg-white/5"
                            style={{ left: `${(m / duration) * 100}%` }}
                          />
                        ))}

                        {/* Track Items */}
                        {track.items.map(item => {
                          const isSelected = selectedItemId === item.id;
                          const left = Math.min(100, Math.max(0, (item.start / duration) * 100));
                          const width = Math.min(100 - left, Math.max(0, (item.duration / duration) * 100));

                          return (
                            <button
                              key={item.id}
                              onClick={() => setSelectedItemId(item.id)}
                              className={`absolute top-1 bottom-1 flex items-center justify-center rounded-md border px-2 transition-all overflow-hidden ${
                                isSelected
                                  ? "z-10 border-violet-400 bg-violet-400/20 ring-2 ring-violet-500/50 shadow-glow"
                                  : `${config.bg} ${config.border} hover:border-white/30`
                              }`}
                              style={{ left: `${left}%`, width: `${width}%` }}
                            >
                              <span className={`truncate text-[10px] font-medium ${isSelected ? "text-white" : config.text}`}>
                                {item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={resetTimeline}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={() => {
                setTimeline(DEFAULT_TIMELINE);
                setSelectedItemId("cam-001");
                setRawProductionNotes(DEFAULT_TIMELINE.productionNotes.join("\n"));
                setStatusMessage("Loaded Core Timeline");
                setTimeout(() => setStatusMessage(""), 3000);
              }}
              className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/20 transition"
            >
              <Layers className="h-4 w-4" />
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
          {/* Item Editor */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 border-b border-white/10 pb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                {selectedData ? `Item Editor: ${selectedData.item.id}` : "Select an item"}
              </h3>
              {selectedData && <span className="text-[10px] font-mono text-slate-600 uppercase">Selected</span>}
            </div>

            {selectedData ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="item-label" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Label</label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="item-label"
                      type="text"
                      value={selectedData.item.label}
                      onChange={(e) => updateItemField(selectedData.item.id, "label", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="item-panelId" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Panel ID</label>
                    <input
                      id="item-panelId"
                      type="text"
                      value={selectedData.item.panelId}
                      onChange={(e) => updateItemField(selectedData.item.id, "panelId", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="item-start" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start (sec)</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        id="item-start"
                        type="number"
                        step="0.1"
                        min="0"
                        value={selectedData.item.start}
                        onChange={(e) => updateItemField(selectedData.item.id, "start", e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="item-duration" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration (sec)</label>
                    <input
                      id="item-duration"
                      type="number"
                      step="0.1"
                      min="0"
                      value={selectedData.item.duration}
                      onChange={(e) => updateItemField(selectedData.item.id, "duration", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="item-action" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action / Note</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <textarea
                      id="item-action"
                      value={selectedData.item.action}
                      onChange={(e) => updateItemField(selectedData.item.id, "action", e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center text-slate-500 italic text-sm">
                Click a timeline item to edit
              </div>
            )}
          </div>

          {/* Timeline Settings */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-6 border-b border-white/10 pb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
              Timeline Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="timeline-title" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
                <input
                  id="timeline-title"
                  type="text"
                  value={timeline.title}
                  onChange={(e) => updateTimelineField("title", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="timeline-fps" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">FPS</label>
                  <input
                    id="timeline-fps"
                    type="number"
                    min="1"
                    value={timeline.fps}
                    onChange={(e) => updateTimelineField("fps", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
                <div>
                    <label htmlFor="timeline-duration" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Duration (sec)</label>
                  <input
                    id="timeline-duration"
                    type="number"
                    min="1"
                    value={timeline.durationSeconds}
                    onChange={(e) => updateTimelineField("durationSeconds", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="timeline-notes" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Production Notes (one per line)</label>
                <textarea
                  id="timeline-notes"
                  value={rawProductionNotes}
                  onChange={(e) => handleProductionNotesChange(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/20 p-3 font-mono text-xs text-white focus:border-violet/50 focus:outline-none resize-none"
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
                Timeline JSON will eventually compile into animation keyframes, camera moves, mouth timing, sound cues, and export timelines.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-lg bg-black/20 p-3 text-xs text-slate-400">
                <Info className="h-4 w-4 shrink-0 text-violet-400" />
                This module handles the temporal orchestration of the entire episode.
              </div>
            </div>

            {/* Export Panel */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                  Export Timeline JSON
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
                value={JSON.stringify(timeline, null, 2)}
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
