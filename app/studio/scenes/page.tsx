"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Film,
  Camera,
  Users,
  Box,
  Type,
  AlignLeft,
  Palette,
  Info,
  Save,
  FolderOpen,
  Trash2
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { loadStudioJson, saveStudioJson, clearStudioJson, STORAGE_KEYS } from "@/lib/localStudioStorage";

const DEFAULT_SCENE = {
  version: 1,
  id: "scene-001",
  title: "Otter Core Awakens",
  description: "The otter AI wakes up inside a forgotten digital universe.",
  background: {
    type: "gradient",
    from: "#0b1020",
    to: "#3b0764",
    mood: "cosmic"
  },
  camera: {
    shot: "wide",
    angle: "front",
    movement: "slow-push-in"
  },
  characters: [
    {
      id: "otter-ai",
      name: "The Otter",
      x: 480,
      y: 280,
      pose: "awakening",
      expression: "curious"
    }
  ],
  props: [
    {
      id: "world-spark",
      name: "World Spark",
      x: 620,
      y: 220,
      type: "glowing-orb"
    }
  ],
  notes: [
    "First test scene for ILLUVRSE Core.",
    "Designed to later convert into Drawing Command System commands."
  ]
};

export default function SceneBuilderPage() {
  const [scene, setScene] = useState(DEFAULT_SCENE);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Initial load
  useEffect(() => {
    const saved = loadStudioJson(STORAGE_KEYS.SCENE, null);
    if (saved) {
      setScene(saved);
      setStatusMessage("Loaded saved version");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  }, []);

  const saveLocally = () => {
    saveStudioJson(STORAGE_KEYS.SCENE, scene);
    setStatusMessage("Saved locally");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const loadSaved = () => {
    const saved = loadStudioJson(STORAGE_KEYS.SCENE, null);
    if (saved) {
      setScene(saved);
      setStatusMessage("Loaded saved version");
    } else {
      setStatusMessage("No saved version found");
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const clearSaved = () => {
    clearStudioJson(STORAGE_KEYS.SCENE);
    setStatusMessage("Cleared saved version");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(scene, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetScene = () => {
    if (confirm("Reset to default scene?")) {
      setScene(DEFAULT_SCENE);
      setStatusMessage("Reset to default");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const updateField = (path: string, value: any) => {
    const newScene = { ...scene };
    const parts = path.split(".");
    let current: any = newScene;

    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
    setScene(newScene);
  };

  const updateCharacter = (field: string, value: any) => {
    const newCharacters = [...scene.characters];
    newCharacters[0] = { ...newCharacters[0], [field]: value };
    setScene({ ...scene, characters: newCharacters });
  };

  const updateProp = (field: string, value: any) => {
    const newProps = [...scene.props];
    newProps[0] = { ...newProps[0], [field]: value };
    setScene({ ...scene, props: newProps });
  };

  const updateNotes = (value: string) => {
    setScene({ ...scene, notes: [value] });
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

      <SectionHeader title="Scene Builder" eyebrow="Saveable scene JSON" />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Preview Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-1">
            <div
              className="relative aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br"
              style={{
                backgroundImage: `linear-gradient(to bottom right, ${scene.background.from}, ${scene.background.to})`
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 rounded-full bg-black/20 px-3 py-1 text-xs font-medium text-white/60 backdrop-blur-md">
                  {scene.background.mood}
                </div>
                <h2 className="mb-2 text-3xl font-bold text-white drop-shadow-lg">
                  {scene.title}
                </h2>
                <p className="max-w-md text-sm text-slate-200 drop-shadow-md">
                  {scene.description}
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg bg-violet/40 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                    <Users className="h-3.5 w-3.5" />
                    {scene.characters[0].name} ({scene.characters[0].pose})
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-mint/40 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                    <Box className="h-3.5 w-3.5" />
                    {scene.props[0].name}
                  </div>
                </div>
              </div>

              {/* Camera Metadata Overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-4 text-[10px] uppercase tracking-widest text-white/40">
                <div className="flex items-center gap-1.5">
                  <Camera className="h-3 w-3" />
                  {scene.camera.shot} / {scene.camera.angle}
                </div>
                <div>{scene.camera.movement}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={resetScene}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={() => {
                setScene(DEFAULT_SCENE);
                setStatusMessage("Loaded Core Scene");
                setTimeout(() => setStatusMessage(""), 3000);
              }}
              className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/20 transition"
            >
              <Film className="h-4 w-4" />
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
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              Scene Properties
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="scene-title" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Title</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="scene-title"
                    type="text"
                    value={scene.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <textarea
                    value={scene.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Background Mood</label>
                <div className="relative">
                  <Palette className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={scene.background.mood}
                    onChange={(e) => updateField("background.mood", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <h3 className="mt-8 mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              Camera Framing
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Shot</label>
                <input
                  type="text"
                  value={scene.camera.shot}
                  onChange={(e) => updateField("camera.shot", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Angle</label>
                <input
                  type="text"
                  value={scene.camera.angle}
                  onChange={(e) => updateField("camera.angle", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Movement</label>
                <input
                  type="text"
                  value={scene.camera.movement}
                  onChange={(e) => updateField("camera.movement", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              Primary Character
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="char-name" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Name</label>
                <input
                  id="char-name"
                  type="text"
                  value={scene.characters[0].name}
                  onChange={(e) => updateCharacter("name", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Pose</label>
                  <input
                    type="text"
                    value={scene.characters[0].pose}
                    onChange={(e) => updateCharacter("pose", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Expression</label>
                  <input
                    type="text"
                    value={scene.characters[0].expression}
                    onChange={(e) => updateCharacter("expression", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <h3 className="mt-8 mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              Primary Prop
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Name</label>
                <input
                  type="text"
                  value={scene.props[0].name}
                  onChange={(e) => updateProp("name", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Type</label>
                <input
                  type="text"
                  value={scene.props[0].type}
                  onChange={(e) => updateProp("type", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>
            </div>

            <h3 className="mt-8 mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              Production Notes
            </h3>
            <textarea
              value={scene.notes[0]}
              onChange={(e) => updateNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
            />
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
                Scene JSON will eventually compile into Drawing Command System commands, storyboard panels, and animation timelines.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-lg bg-black/20 p-3 text-xs text-slate-400">
                <Info className="h-4 w-4 shrink-0 text-violet-400" />
                This module bridges the gap between creative intent and technical execution.
              </div>
            </div>

            {/* Export Panel */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                  Export Scene JSON
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
                value={JSON.stringify(scene, null, 2)}
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
