"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Users,
  Type,
  Palette,
  Info,
  Mic2,
  Brain,
  MessageSquare,
  Activity,
  ScrollText,
  Save,
  FolderOpen,
  Trash2
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { loadStudioJson, saveStudioJson, clearStudioJson, STORAGE_KEYS } from "@/lib/localStudioStorage";
import { Character } from "@/lib/studioTypes";
import { DEFAULT_CHARACTER } from "@/lib/studioDefaults";

export default function CharacterBuilderPage() {
  const [character, setCharacter] = useState<Character>(DEFAULT_CHARACTER);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Initial load
  useEffect(() => {
    const saved = loadStudioJson(STORAGE_KEYS.CHARACTER, null);
    if (saved) {
      setCharacter(saved);
      setStatusMessage("Loaded saved version");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  }, []);

  const saveLocally = () => {
    saveStudioJson(STORAGE_KEYS.CHARACTER, character);
    setStatusMessage("Saved locally");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const loadSaved = () => {
    const saved = loadStudioJson(STORAGE_KEYS.CHARACTER, null);
    if (saved) {
      setCharacter(saved);
      setStatusMessage("Loaded saved version");
    } else {
      setStatusMessage("No saved version found");
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const clearSaved = () => {
    clearStudioJson(STORAGE_KEYS.CHARACTER);
    setStatusMessage("Cleared saved version");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(character, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCharacter = () => {
    if (confirm("Reset to default character?")) {
      setCharacter(DEFAULT_CHARACTER);
      setStatusMessage("Reset to default");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const updateField = (path: string, value: any) => {
    const parts = path.split(".");

    if (parts.length === 1) {
      setCharacter(prev => ({ ...prev, [parts[0]]: value }));
      return;
    }

    if (parts.length === 2) {
      const [parent, child] = parts;
      setCharacter(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof DEFAULT_CHARACTER] as object),
          [child]: value
        }
      }));
    }
  };

  const updateArrayField = (field: keyof Character, value: string) => {
    const lines = value.split("\n").map(line => line.trim()).filter(line => line !== "");
    setCharacter({ ...character, [field]: lines });
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

      <SectionHeader title="Character Builder" eyebrow="Reusable character cards" />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Preview Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Mascot Marker Container */}
              <div className="relative flex h-48 w-48 shrink-0 items-center justify-center rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                 {/* Abstract Mascot Marker */}
                 <div
                   className="relative h-24 w-24 rounded-full blur-[1px]"
                   style={{
                     backgroundColor: character.visual.primaryColor,
                     boxShadow: `0 0 40px ${character.visual.primaryColor}80`
                   }}
                 >
                   {/* Orbiting Ring */}
                   <div
                     className="absolute -inset-2 rounded-full border-2 border-dashed opacity-50"
                     style={{ borderColor: character.visual.secondaryColor }}
                   />
                   {/* Spark/Accent Dot */}
                   <div
                     className="absolute top-2 right-2 h-4 w-4 rounded-full"
                     style={{
                       backgroundColor: character.visual.accentColor,
                       boxShadow: `0 0 15px ${character.visual.accentColor}`
                     }}
                   />
                 </div>
              </div>

              {/* Character Info Preview */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-white">{character.name}</h2>
                  <p className="text-violet-300 font-medium">{character.role}</p>
                  <p className="text-sm text-slate-400">{character.species}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Visual Style</h4>
                    <p className="text-sm text-slate-200">{character.visual.style}</p>
                  </div>

                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Personality</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {character.personality.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-violet/20 border border-violet/30 text-[11px] text-violet-200">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Expressions</h4>
                      <div className="flex flex-wrap gap-1">
                        {character.expressions.map((e, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Poses</h4>
                      <div className="flex flex-wrap gap-1">
                        {character.poses.map((p, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={resetCharacter}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={() => {
                setCharacter(DEFAULT_CHARACTER);
                setStatusMessage("Loaded Otter");
                setTimeout(() => setStatusMessage(""), 3000);
              }}
              className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/20 transition"
            >
              <Users className="h-4 w-4" />
              Load Otter
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
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 max-h-[800px] overflow-y-auto custom-scrollbar">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              Identity & Style
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="char-name" className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Name</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="char-name"
                    type="text"
                    value={character.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Role</label>
                  <input
                    type="text"
                    value={character.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Species</label>
                  <input
                    type="text"
                    value={character.species}
                    onChange={(e) => updateField("species", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Visual Style</label>
                <input
                  type="text"
                  value={character.visual.style}
                  onChange={(e) => updateField("visual.style", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Silhouette</label>
                <textarea
                  value={character.visual.silhouette}
                  onChange={(e) => updateField("visual.silhouette", e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-slate-500 uppercase">Primary</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={character.visual.primaryColor}
                      onChange={(e) => updateField("visual.primaryColor", e.target.value)}
                      className="h-8 w-8 rounded border border-white/10 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={character.visual.primaryColor}
                      onChange={(e) => updateField("visual.primaryColor", e.target.value)}
                      className="w-full rounded border border-white/10 bg-black/20 px-2 text-[10px] text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-slate-500 uppercase">Secondary</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={character.visual.secondaryColor}
                      onChange={(e) => updateField("visual.secondaryColor", e.target.value)}
                      className="h-8 w-8 rounded border border-white/10 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={character.visual.secondaryColor}
                      onChange={(e) => updateField("visual.secondaryColor", e.target.value)}
                      className="w-full rounded border border-white/10 bg-black/20 px-2 text-[10px] text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-slate-500 uppercase">Accent</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={character.visual.accentColor}
                      onChange={(e) => updateField("visual.accentColor", e.target.value)}
                      className="h-8 w-8 rounded border border-white/10 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={character.visual.accentColor}
                      onChange={(e) => updateField("visual.accentColor", e.target.value)}
                      className="w-full rounded border border-white/10 bg-black/20 px-2 text-[10px] text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <h3 className="mt-8 mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              Voice & Narrative
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Voice Tone</label>
                  <div className="relative">
                    <Mic2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={character.voice.tone}
                      onChange={(e) => updateField("voice.tone", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Catchphrase</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={character.voice.catchphrase}
                      onChange={(e) => updateField("voice.catchphrase", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase">Story Function</label>
                <textarea
                  value={character.storyFunction}
                  onChange={(e) => updateField("storyFunction", e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>
            </div>

            <h3 className="mt-8 mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              Traits & Assets
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="char-personality" className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                  <Brain className="h-3.5 w-3.5" /> Personality (one per line)
                </label>
                <textarea
                  id="char-personality"
                  value={character.personality.join("\n")}
                  onChange={(e) => updateArrayField("personality", e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                    <Activity className="h-3.5 w-3.5" /> Expressions
                  </label>
                  <textarea
                    value={character.expressions.join("\n")}
                    onChange={(e) => updateArrayField("expressions", e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                    <Activity className="h-3.5 w-3.5" /> Poses
                  </label>
                  <textarea
                    value={character.poses.join("\n")}
                    onChange={(e) => updateArrayField("poses", e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                  <ScrollText className="h-3.5 w-3.5" /> Notes
                </label>
                <textarea
                  value={character.notes.join("\n")}
                  onChange={(e) => updateArrayField("notes", e.target.value)}
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
                Character JSON will eventually power scene placement, expression changes, pose libraries, dialogue voice planning, and animation rigs.
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
                  Export Character JSON
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
                value={JSON.stringify(character, null, 2)}
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
