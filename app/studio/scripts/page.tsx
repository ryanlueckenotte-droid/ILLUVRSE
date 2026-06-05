"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  FileText,
  Users,
  Film,
  MessageSquare,
  ScrollText,
  Info,
  Type,
  Clapperboard,
  Save,
  FolderOpen,
  Trash2
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { loadStudioJson, saveStudioJson, clearStudioJson, STORAGE_KEYS } from "@/lib/localStudioStorage";
import { Script } from "@/lib/studioTypes";
import { DEFAULT_SCRIPT } from "@/lib/studioDefaults";

export default function ScriptBuilderPage() {
  const [script, setScript] = useState<Script>(DEFAULT_SCRIPT);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Raw text states for textareas
  const [rawCharacters, setRawCharacters] = useState("");
  const [rawBeats1, setRawBeats1] = useState("");
  const [rawBeats2, setRawBeats2] = useState("");
  const [rawDialogue, setRawDialogue] = useState("");
  const [rawNotes, setRawNotes] = useState("");

  // Initialize raw text states
  useEffect(() => {
    const saved = loadStudioJson(STORAGE_KEYS.SCRIPT, null);
    if (saved) {
      setScript(saved);
      syncRawStates(saved);
      setStatusMessage("Loaded saved version");
      setTimeout(() => setStatusMessage(""), 3000);
    } else {
      syncRawStates(DEFAULT_SCRIPT);
    }
  }, []);

  const saveLocally = () => {
    saveStudioJson(STORAGE_KEYS.SCRIPT, script);
    setStatusMessage("Saved locally");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const loadSaved = () => {
    const saved = loadStudioJson(STORAGE_KEYS.SCRIPT, null);
    if (saved) {
      setScript(saved);
      syncRawStates(saved);
      setStatusMessage("Loaded saved version");
    } else {
      setStatusMessage("No saved version found");
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const clearSaved = () => {
    clearStudioJson(STORAGE_KEYS.SCRIPT);
    setStatusMessage("Cleared saved version");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const syncRawStates = (s: Script) => {
    setRawCharacters(s.characters.join("\n"));
    setRawBeats1(s.scenes[0].beats.join("\n"));
    setRawBeats2(s.scenes[1].beats.join("\n"));
    setRawDialogue(
      s.dialogue
        .map((d) => `${d.speaker} | ${d.emotion} | ${d.line}`)
        .join("\n")
    );
    setRawNotes(s.productionNotes.join("\n"));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(script, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetScript = () => {
    if (confirm("Reset to default script?")) {
      setScript(DEFAULT_SCRIPT);
      syncRawStates(DEFAULT_SCRIPT);
      setStatusMessage("Reset to default");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const updateField = (path: string, value: any) => {
    const newScript = { ...script };
    const parts = path.split(".");
    let current: any = newScript;

    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
    setScript(newScript);
  };

  const handleCharactersChange = (val: string) => {
    setRawCharacters(val);
    const chars = val.split("\n").map(l => l.trim()).filter(l => l !== "");
    setScript(prev => ({ ...prev, characters: chars }));
  };

  const handleBeatsChange = (sceneIndex: number, val: string) => {
    if (sceneIndex === 0) setRawBeats1(val);
    else setRawBeats2(val);

    const beats = val.split("\n").map(l => l.trim()).filter(l => l !== "");
    const newScenes = [...script.scenes];
    newScenes[sceneIndex] = { ...newScenes[sceneIndex], beats };
    setScript(prev => ({ ...prev, scenes: newScenes }));
  };

  const handleDialogueChange = (val: string) => {
    setRawDialogue(val);
    const lines = val.split("\n").filter(l => l.trim() !== "");
    const dialogue = lines.map(line => {
      const [speaker, emotion, text] = line.split("|").map(p => p.trim());
      return {
        speaker: speaker || "Unknown",
        emotion: emotion || "neutral",
        line: text || ""
      };
    }).filter(d => d.line !== "");
    setScript(prev => ({ ...prev, dialogue }));
  };

  const handleNotesChange = (val: string) => {
    setRawNotes(val);
    const notes = val.split("\n").map(l => l.trim()).filter(l => l !== "");
    setScript(prev => ({ ...prev, productionNotes: notes }));
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

      <SectionHeader title="Script Builder" eyebrow="Episode script JSON" />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Preview Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-lg">
            <div className="mb-8 border-b border-white/10 pb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
                  {script.series} | {script.format}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{script.id}</span>
              </div>
              <h2 className="text-4xl font-black text-white mb-2">{script.title}</h2>
              <p className="text-lg text-slate-300 italic leading-relaxed">
                "{script.logline}"
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Theme:</span>
                <span className="text-sm text-violet-300 font-medium">{script.theme}</span>
              </div>
            </div>

            <div className="grid gap-8">
              <section>
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <Users className="h-4 w-4 text-violet-400" />
                  Characters
                </h3>
                <div className="flex flex-wrap gap-2">
                  {script.characters.map((char, i) => (
                    <span key={i} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                      {char}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <Film className="h-4 w-4 text-violet-400" />
                  Scenes
                </h3>
                <div className="space-y-4">
                  {script.scenes.map((scene, i) => (
                    <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                      <h4 className="text-sm font-bold text-white mb-1">SCENE {i + 1}: {scene.title}</h4>
                      <p className="text-sm text-slate-400 mb-3">{scene.summary}</p>
                      <ul className="space-y-1">
                        {scene.beats.map((beat, j) => (
                          <li key={j} className="flex gap-2 text-xs text-slate-500">
                            <span className="text-violet-500">•</span> {beat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <MessageSquare className="h-4 w-4 text-violet-400" />
                  Dialogue
                </h3>
                <div className="space-y-4 rounded-lg border border-white/5 bg-black/20 p-6">
                  {script.dialogue.map((d, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">{d.speaker}</span>
                        <span className="text-[10px] italic text-slate-600">({d.emotion})</span>
                      </div>
                      <p className="text-sm text-slate-200 pl-4 border-l border-violet-500/30 font-medium">
                        {d.line}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={resetScript}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={() => {
                setScript(DEFAULT_SCRIPT);
                syncRawStates(DEFAULT_SCRIPT);
                setStatusMessage("Loaded Core Script");
                setTimeout(() => setStatusMessage(""), 3000);
              }}
              className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/20 transition"
            >
              <Clapperboard className="h-4 w-4" />
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
          {/* Metadata Section */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              <FileText className="h-4 w-4 text-violet-400" />
              Script Metadata
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="script-title" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="script-title"
                    type="text"
                    value={script.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-10 pr-4 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="script-series" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Series</label>
                  <input
                  id="script-series"
                    type="text"
                    value={script.series}
                    onChange={(e) => updateField("series", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
                <div>
                <label htmlFor="script-format" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Format</label>
                  <input
                  id="script-format"
                    type="text"
                    value={script.format}
                    onChange={(e) => updateField("format", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                  />
                </div>
              </div>
              <div>
              <label htmlFor="script-logline" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Logline</label>
                <textarea
                id="script-logline"
                  value={script.logline}
                  onChange={(e) => updateField("logline", e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>
              <div>
              <label htmlFor="script-theme" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Theme</label>
                <input
                id="script-theme"
                  type="text"
                  value={script.theme}
                  onChange={(e) => updateField("theme", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Characters Section */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              <Users className="h-4 w-4 text-violet-400" />
              Characters
            </h3>
            <div>
              <label htmlFor="script-characters" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">One character per line</label>
              <textarea
                id="script-characters"
                value={rawCharacters}
                onChange={(e) => handleCharactersChange(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-black/20 p-3 font-mono text-xs text-white focus:border-violet/50 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Scenes Section */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-6">
            <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              <Film className="h-4 w-4 text-violet-400" />
              Scenes
            </h3>

            {/* Scene 1 */}
            <div className="space-y-4 border-l-2 border-violet-500/20 pl-4">
              <h4 className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Scene 1</h4>
              <div>
                <label htmlFor="scene-1-title" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
                <input
                  id="scene-1-title"
                  type="text"
                  value={script.scenes[0].title}
                  onChange={(e) => {
                    const newScenes = [...script.scenes];
                    newScenes[0] = { ...newScenes[0], title: e.target.value };
                    setScript({ ...script, scenes: newScenes });
                  }}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="scene-1-summary" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Summary</label>
                <textarea
                  id="scene-1-summary"
                  value={script.scenes[0].summary}
                  onChange={(e) => {
                    const newScenes = [...script.scenes];
                    newScenes[0] = { ...newScenes[0], summary: e.target.value };
                    setScript({ ...script, scenes: newScenes });
                  }}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label htmlFor="scene-1-beats" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Beats (one per line)</label>
                <textarea
                  id="scene-1-beats"
                  value={rawBeats1}
                  onChange={(e) => handleBeatsChange(0, e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/20 p-3 font-mono text-xs text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Scene 2 */}
            <div className="space-y-4 border-l-2 border-violet-500/20 pl-4">
              <h4 className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Scene 2</h4>
              <div>
                <label htmlFor="scene-2-title" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
                <input
                  id="scene-2-title"
                  type="text"
                  value={script.scenes[1].title}
                  onChange={(e) => {
                    const newScenes = [...script.scenes];
                    newScenes[1] = { ...newScenes[1], title: e.target.value };
                    setScript({ ...script, scenes: newScenes });
                  }}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="scene-2-summary" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Summary</label>
                <textarea
                  id="scene-2-summary"
                  value={script.scenes[1].summary}
                  onChange={(e) => {
                    const newScenes = [...script.scenes];
                    newScenes[1] = { ...newScenes[1], summary: e.target.value };
                    setScript({ ...script, scenes: newScenes });
                  }}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-black/20 py-2 px-3 text-sm text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label htmlFor="scene-2-beats" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Beats (one per line)</label>
                <textarea
                  id="scene-2-beats"
                  value={rawBeats2}
                  onChange={(e) => handleBeatsChange(1, e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/20 p-3 font-mono text-xs text-white focus:border-violet/50 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Dialogue Section */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              <MessageSquare className="h-4 w-4 text-violet-400" />
              Dialogue
            </h3>
            <div>
              <label htmlFor="script-dialogue" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Format: Speaker | Emotion | Line</label>
              <textarea
                id="script-dialogue"
                value={rawDialogue}
                onChange={(e) => handleDialogueChange(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-white/10 bg-black/20 p-3 font-mono text-xs text-white focus:border-violet/50 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Production Notes Section */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              <ScrollText className="h-4 w-4 text-violet-400" />
              Production Notes
            </h3>
            <div>
              <label htmlFor="script-production-notes" className="mb-1.5 block text-[10px] font-bold text-slate-500 uppercase tracking-wider">One note per line</label>
              <textarea
                id="script-production-notes"
                value={rawNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                rows={4}
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
                Script JSON will eventually generate storyboard panels, scene lists, shot plans, dialogue timing, and animation timelines.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-lg bg-black/20 p-3 text-xs text-slate-400">
                <Info className="h-4 w-4 shrink-0 text-violet-400" />
                This module defines the foundational narrative structure for the entire animation pipeline.
              </div>
            </div>

            {/* Export Panel */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                  Export Script JSON
                </h3>
                <label htmlFor="exported-json" className="sr-only">Exported JSON</label>
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
                id="exported-json"
                readOnly
                value={JSON.stringify(script, null, 2)}
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
