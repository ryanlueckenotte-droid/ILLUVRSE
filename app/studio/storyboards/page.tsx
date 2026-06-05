"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ImageIcon,
  Users,
  Film,
  Camera,
  MessageSquare,
  Activity,
  Clock,
  Type,
  AlignLeft,
  Info,
  ScrollText,
  Save,
  FolderOpen,
  Trash2
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { loadStudioJson, saveStudioJson, clearStudioJson, STORAGE_KEYS } from "@/lib/localStudioStorage";

const DEFAULT_STORYBOARD = {
  version: 1,
  id: "storyboard-episode-001",
  scriptId: "episode-001",
  title: "Otter Core Awakens",
  series: "ILLUVRSE Core",
  format: "1-3 minute animated short",
  panels: [
    {
      id: "panel-001",
      sceneId: "scene-001",
      title: "Core Flickers Awake",
      description: "A dark cosmic grid fills the frame. A purple core begins to glow.",
      shot: "wide",
      camera: "slow push in",
      characters: ["The Otter"],
      dialogue: "System awake. Imagination detected.",
      action: "The purple core pulses, then the otter's eyes open.",
      mood: "mysterious",
      durationSeconds: 4
    },
    {
      id: "panel-002",
      sceneId: "scene-001",
      title: "Glitches Scatter",
      description: "Tiny chaotic glitch bugs crawl across broken project fragments.",
      shot: "medium",
      camera: "quick pan",
      characters: ["The Otter", "Glitches"],
      dialogue: "Uh oh. The chaos bugs are awake too.",
      action: "Glitches scatter as the otter points toward the darkness.",
      mood: "funny tension",
      durationSeconds: 5
    },
    {
      id: "panel-003",
      sceneId: "scene-002",
      title: "Ryan Finds the Spark",
      description: "Ryan stands at the edge of the void and notices a small green World Spark.",
      shot: "wide",
      camera: "hold",
      characters: ["Ryan", "The Otter", "World Spark"],
      dialogue: "Can we actually build this?",
      action: "The spark floats between Ryan and the otter.",
      mood: "hopeful",
      durationSeconds: 6
    },
    {
      id: "panel-004",
      sceneId: "scene-002",
      title: "One Spark at a Time",
      description: "The World Spark expands into a tiny glowing world.",
      shot: "close-up",
      camera: "slow zoom",
      characters: ["The Otter", "World Spark"],
      dialogue: "Yes. One world spark at a time.",
      action: "The tiny world forms with a soft glow.",
      mood: "motivational",
      durationSeconds: 5
    }
  ],
  productionNotes: [
    "Storyboard panels should later compile into scene plans and animation timing.",
    "Keep visual direction simple and readable."
  ]
};

export default function StoryboardBuilderPage() {
  const [storyboard, setStoryboard] = useState(DEFAULT_STORYBOARD);
  const [selectedPanelId, setSelectedPanelId] = useState("panel-001");
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Raw text states for textareas to allow natural typing
  const [rawCharacters, setRawCharacters] = useState("");
  const [rawProductionNotes, setRawProductionNotes] = useState("");

  const selectedPanel = storyboard.panels.find(p => p.id === selectedPanelId) || storyboard.panels[0];

  // Initialize raw states and initial load
  useEffect(() => {
    const saved = loadStudioJson<typeof DEFAULT_STORYBOARD | null>(STORAGE_KEYS.STORYBOARD, null);
    if (saved) {
      setStoryboard(saved);
      setRawProductionNotes(saved.productionNotes.join("\n"));
      const firstPanel = saved.panels.find((p: any) => p.id === selectedPanelId) || saved.panels[0];
      setRawCharacters(firstPanel.characters.join("\n"));
      setStatusMessage("Loaded saved version");
      setTimeout(() => setStatusMessage(""), 3000);
    } else {
      setRawProductionNotes(DEFAULT_STORYBOARD.productionNotes.join("\n"));
      setRawCharacters(selectedPanel.characters.join("\n"));
    }
  }, []);

  useEffect(() => {
    setRawCharacters(selectedPanel.characters.join("\n"));
  }, [selectedPanelId]);

  const saveLocally = () => {
    saveStudioJson(STORAGE_KEYS.STORYBOARD, storyboard);
    setStatusMessage("Saved locally");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const loadSaved = () => {
    const saved = loadStudioJson<typeof DEFAULT_STORYBOARD | null>(STORAGE_KEYS.STORYBOARD, null);
    if (saved) {
      setStoryboard(saved);
      setRawProductionNotes(saved.productionNotes.join("\n"));
      const currentPanel = saved.panels.find((p: any) => p.id === selectedPanelId) || saved.panels[0];
      setRawCharacters(currentPanel.characters.join("\n"));
      setStatusMessage("Loaded saved version");
    } else {
      setStatusMessage("No saved version found");
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const clearSaved = () => {
    clearStudioJson(STORAGE_KEYS.STORYBOARD);
    setStatusMessage("Cleared saved version");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(storyboard, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetStoryboard = () => {
    if (confirm("Reset to default storyboard?")) {
      setStoryboard(DEFAULT_STORYBOARD);
      setSelectedPanelId("panel-001");
      setRawCharacters(DEFAULT_STORYBOARD.panels[0].characters.join("\n"));
      setRawProductionNotes(DEFAULT_STORYBOARD.productionNotes.join("\n"));
      setStatusMessage("Reset to default");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const updatePanelField = (field: string, value: any) => {
    const updatedPanels = storyboard.panels.map(p => {
      if (p.id === selectedPanelId) {
        if (field === "durationSeconds") {
          const num = parseFloat(value) || 0;
          return { ...p, [field]: Math.max(0, num) };
        }
        return { ...p, [field]: value };
      }
      return p;
    });
    setStoryboard({ ...storyboard, panels: updatedPanels });
  };

  const handleCharactersChange = (val: string) => {
    setRawCharacters(val);
    const chars = val.split("\n").map(l => l.trim()).filter(l => l !== "");
    const updatedPanels = storyboard.panels.map(p => {
      if (p.id === selectedPanelId) {
        return { ...p, characters: chars };
      }
      return p;
    });
    setStoryboard({ ...storyboard, panels: updatedPanels });
  };

  const handleProductionNotesChange = (val: string) => {
    setRawProductionNotes(val);
    const notes = val.split("\n").map(l => l.trim()).filter(l => l !== "");
    setStoryboard({ ...storyboard, productionNotes: notes });
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

      <SectionHeader title="Storyboard Builder" eyebrow="Panel-by-panel visual plan" />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Preview Panel Grid */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {storyboard.panels.map((panel, index) => (
              <button
                key={panel.id}
                onClick={() => setSelectedPanelId(panel.id)}
                className={`relative flex flex-col overflow-hidden rounded-xl border text-left transition-all ${
                  selectedPanelId === panel.id
                    ? "border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/50 shadow-glow"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                {/* 16:9 Aspect Ratio Visual Placeholder */}
                <div className="relative aspect-video w-full bg-slate-900/50 p-4">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-full w-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-500 via-transparent to-transparent" />
                   </div>

                   {/* Frame Markers */}
                   <div className="absolute top-2 left-2 border-l border-t border-white/20 h-4 w-4" />
                   <div className="absolute top-2 right-2 border-r border-t border-white/20 h-4 w-4" />
                   <div className="absolute bottom-2 left-2 border-l border-b border-white/20 h-4 w-4" />
                   <div className="absolute bottom-2 right-2 border-r border-b border-white/20 h-4 w-4" />

                   <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start">
                         <span className="text-[10px] font-mono text-white/40 uppercase">Panel {index + 1}</span>
                         <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">{panel.shot}</span>
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-xs font-bold text-white truncate">{panel.title}</h4>
                         <p className="text-[10px] text-slate-400 line-clamp-2 italic leading-tight">
                            {panel.action || panel.dialogue}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Film className="h-3 w-3" />
                      {panel.sceneId}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {panel.durationSeconds}s
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {panel.characters.slice(0, 2).map((char, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-slate-300">
                        {char}
                      </span>
                    ))}
                    {panel.characters.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-slate-300">
                        +{panel.characters.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[9px] font-medium text-violet-300 uppercase tracking-tighter">
                    <Activity className="h-2.5 w-2.5" />
                    {panel.mood}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={resetStoryboard}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={() => {
                setStoryboard(DEFAULT_STORYBOARD);
                setSelectedPanelId("panel-001");
                setRawCharacters(DEFAULT_STORYBOARD.panels[0].characters.join("\n"));
                setRawProductionNotes(DEFAULT_STORYBOARD.productionNotes.join("\n"));
                setStatusMessage("Loaded Core Storyboard");
                setTimeout(() => setStatusMessage(""), 3000);
              }}
              className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/20 transition"
            >
              <ImageIcon className="h-4 w-4" />
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
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6 border-b border-white/10 pb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                Panel Editor: {selectedPanel.id}
              </h3>
              <span className="text-[10px] font-mono text-slate-600 uppercase">Selected</span>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="panel-title" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="panel-title"
                    type="text"
                    value={selectedPanel.title}
                    onChange={(e) => updatePanelField("title", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="panel-description" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <textarea
                    id="panel-description"
                    value={selectedPanel.description}
                    onChange={(e) => updatePanelField("description", e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="panel-shot" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Shot</label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="panel-shot"
                      type="text"
                      value={selectedPanel.shot}
                      onChange={(e) => updatePanelField("shot", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="panel-camera" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Camera</label>
                  <input
                    id="panel-camera"
                    type="text"
                    value={selectedPanel.camera}
                    onChange={(e) => updatePanelField("camera", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="panel-characters" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Characters (one per line)</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <textarea
                    id="panel-characters"
                    value={rawCharacters}
                    onChange={(e) => handleCharactersChange(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none resize-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="panel-dialogue" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dialogue</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <textarea
                    id="panel-dialogue"
                    value={selectedPanel.dialogue}
                    onChange={(e) => updatePanelField("dialogue", e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none resize-none italic"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="panel-action" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action</label>
                <textarea
                  id="panel-action"
                  value={selectedPanel.action}
                  onChange={(e) => updatePanelField("action", e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="panel-mood" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mood</label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="panel-mood"
                      type="text"
                      value={selectedPanel.mood}
                      onChange={(e) => updatePanelField("mood", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="panel-duration" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration (sec)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="panel-duration"
                      type="number"
                      step="0.1"
                      min="0"
                      value={selectedPanel.durationSeconds}
                      onChange={(e) => updatePanelField("durationSeconds", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Production Notes Section */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              <ScrollText className="h-4 w-4 text-violet-400" />
              Production Notes
            </h3>
            <div>
              <label htmlFor="production-notes" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">One note per line</label>
              <textarea
                id="production-notes"
                value={rawProductionNotes}
                onChange={(e) => handleProductionNotesChange(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-black/20 p-3 font-mono text-xs text-white focus:border-violet/50 focus:outline-none resize-none"
              />
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
                Storyboard JSON will eventually compile into shot lists, scene commands, animation keyframes, camera movement, and export timelines.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-lg bg-black/20 p-3 text-xs text-slate-400">
                <Info className="h-4 w-4 shrink-0 text-violet-400" />
                This module bridges visual planning with the technical animation pipeline.
              </div>
            </div>

            {/* Export Panel */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                  Export Storyboard JSON
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
                value={JSON.stringify(storyboard, null, 2)}
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
