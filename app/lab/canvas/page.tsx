"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Circle, Play, Square, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";

type CircleObject = {
  id: string;
  shape: "circle";
  x: number;
  y: number;
  radius: number;
  color: string;
};

type RectangleObject = {
  id: string;
  shape: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type SceneObject = CircleObject | RectangleObject;

type AnimationTrack = {
  target: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  duration: number;
  startedAt: number;
};

type DrawCommand = {
  action: "draw";
  id: string;
  shape: "circle" | "rectangle";
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
  color: string;
};

type AnimateCommand = {
  action: "animate";
  target: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  duration: number;
};

type ClearCommand = {
  action: "clear";
};

type Command = DrawCommand | AnimateCommand | ClearCommand;

export default function CanvasLabPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [animations, setAnimations] = useState<AnimationTrack[]>([]);
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const [commandInput, setCommandInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [exportedJson, setExportedJson] = useState<string | null>(null);

  useEffect(() => {
    function frame(time: number) {
      drawScene(time);
      animationRef.current = window.requestAnimationFrame(frame);
    }

    animationRef.current = window.requestAnimationFrame(frame);

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [objects, animations]);

  function processCommand(cmd: Command, isReplay = false) {
    if (!isReplay) {
      setCommandHistory((prev) => [...prev, cmd]);
    }

    if (cmd.action === "draw") {
      const newObject: SceneObject =
        cmd.shape === "circle"
          ? {
              id: cmd.id,
              shape: "circle",
              x: cmd.x,
              y: cmd.y,
              radius: cmd.radius ?? 50,
              color: cmd.color
            }
          : {
              id: cmd.id,
              shape: "rectangle",
              x: cmd.x,
              y: cmd.y,
              width: cmd.width ?? 128,
              height: cmd.height ?? 88,
              color: cmd.color
            };

      setObjects((prev) => {
        const filtered = prev.filter((obj) => obj.id !== cmd.id);
        return [...filtered, newObject];
      });
    } else if (cmd.action === "animate") {
      setAnimations((prev) => {
        const filtered = prev.filter((anim) => anim.target !== cmd.target);
        return [
          ...filtered,
          {
            target: cmd.target,
            from: cmd.from,
            to: cmd.to,
            duration: cmd.duration,
            startedAt: performance.now()
          }
        ];
      });
    } else if (cmd.action === "clear") {
      setObjects([]);
      setAnimations([]);
      if (!isReplay) {
        setCommandHistory([]);
      }
    }
  }

  function drawScene(time: number) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#0b1020";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = "rgba(255,255,255,0.12)";
    context.lineWidth = 1;
    for (let x = 40; x < canvas.width; x += 40) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }
    for (let y = 40; y < canvas.height; y += 40) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }

    for (const obj of objects) {
      const anim = animations.find((a) => a.target === obj.id);
      let renderX = obj.x;
      let renderY = obj.y;

      if (anim) {
        const elapsed = (time - anim.startedAt) / 1000;
        const progress = Math.min(elapsed / anim.duration, 1);

        renderX = anim.from.x + (anim.to.x - anim.from.x) * progress;
        renderY = anim.from.y + (anim.to.y - anim.from.y) * progress;

        if (progress === 1) {
          // Animation complete, settle object at final position and remove track
          setTimeout(() => {
            setObjects((prev) =>
              prev.map((o) => (o.id === obj.id ? { ...o, x: renderX, y: renderY } : o))
            );
            setAnimations((prev) => prev.filter((a) => a.target !== obj.id));
          }, 0);
        }
      }

      context.fillStyle = obj.color;
      if (obj.shape === "circle") {
        context.beginPath();
        context.arc(renderX, renderY, obj.radius, 0, Math.PI * 2);
        context.fill();
      } else {
        context.fillRect(renderX - obj.width / 2, renderY - obj.height / 2, obj.width, obj.height);
      }
    }
  }

  function drawCircle() {
    const id = `circle-${objects.length}`;
    processCommand({
      action: "draw",
      id,
      shape: "circle",
      x: 210 + objects.length * 18,
      y: 160,
      radius: 52,
      color: "#a78bfa"
    });
  }

  function drawRectangle() {
    const id = `rect-${objects.length}`;
    processCommand({
      action: "draw",
      id,
      shape: "rectangle",
      x: 455 + objects.length * 12,
      y: 230,
      width: 128,
      height: 88,
      color: "#38bdf8"
    });
  }

  function clearCanvas() {
    processCommand({ action: "clear" });
  }

  function animateBall() {
    const id = `ball-${Date.now()}`;
    processCommand({
      action: "draw",
      id,
      shape: "circle",
      x: 92,
      y: 340,
      radius: 28,
      color: "#42f58d"
    });
    processCommand({
      action: "animate",
      target: id,
      from: { x: 92, y: 340 },
      to: { x: 800, y: 340 },
      duration: 2
    });
  }

  function runCustomCommand() {
    try {
      const cmd = JSON.parse(commandInput);
      setValidationError(null);
      processCommand(cmd);
    } catch (e) {
      setValidationError("Invalid JSON command");
    }
  }

  function loadExampleScene() {
    processCommand({ action: "clear" });
    processCommand({
      action: "draw",
      id: "otter-core",
      shape: "circle",
      x: 480,
      y: 270,
      radius: 60,
      color: "#a78bfa"
    });
    processCommand({
      action: "draw",
      id: "platform",
      shape: "rectangle",
      x: 480,
      y: 400,
      width: 300,
      height: 40,
      color: "#38bdf8"
    });
    processCommand({
      action: "draw",
      id: "spark",
      shape: "circle",
      x: 100,
      y: 100,
      radius: 15,
      color: "#42f58d"
    });
    processCommand({
      action: "animate",
      target: "spark",
      from: { x: 100, y: 100 },
      to: { x: 800, y: 400 },
      duration: 3
    });
  }

  function replayCommands() {
    const history = [...commandHistory];
    setObjects([]);
    setAnimations([]);
    // Re-process all commands.
    // In v1, we just run them all. Animations will start their own timers.
    history.forEach((cmd) => processCommand(cmd, true));
  }

  function exportScene() {
    const scene = {
      version: 1,
      objects,
      animations,
      commands: commandHistory
    };
    setExportedJson(JSON.stringify(scene, null, 2));
  }

  return (
    <AppShell>
      <SectionHeader title="Canvas Lab" eyebrow="Local drawing sandbox" />

      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-4">
          <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="aspect-video w-full rounded-lg border border-white/10 bg-slate-950"
              aria-label="ILLUVRSE drawing canvas"
            />
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <h2 className="mb-4 text-lg font-semibold">Command History</h2>
            <div className="max-h-48 overflow-y-auto rounded bg-black/40 p-3 font-mono text-xs text-slate-300">
              {commandHistory.length === 0 && <p className="italic opacity-50">No commands yet...</p>}
              {commandHistory.map((cmd, i) => (
                <div key={i} className="mb-1 border-b border-white/5 pb-1">
                  {JSON.stringify(cmd)}
                </div>
              ))}
            </div>
          </section>

          {exportedJson && (
            <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <h2 className="mb-4 text-lg font-semibold">Exported Scene JSON</h2>
              <textarea
                readOnly
                value={exportedJson}
                className="h-64 w-full rounded border border-white/10 bg-black/40 p-3 font-mono text-xs text-slate-300"
              />
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <h2 className="mb-4 text-lg font-semibold">Drawing Controls</h2>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-2">
                <ActionButton label="Circle" icon={Circle} onClick={drawCircle} />
                <ActionButton label="Rect" icon={Square} onClick={drawRectangle} />
              </div>
              <ActionButton label="Clear" icon={Trash2} onClick={clearCanvas} />
              <ActionButton label="Animate Ball" icon={Play} onClick={animateBall} />
              <hr className="my-2 border-white/10" />
              <ActionButton label="Load Example" icon={Play} onClick={loadExampleScene} />
              <ActionButton label="Replay All" icon={Play} onClick={replayCommands} />
              <ActionButton label="Export JSON" icon={Play} onClick={exportScene} />
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">JSON Command</h2>
            <textarea
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder='{ "action": "draw", ... }'
              className="mb-3 h-32 w-full rounded border border-white/10 bg-black/40 p-3 font-mono text-xs text-slate-300"
            />
            {validationError && <p className="mb-3 text-xs text-red-400">{validationError}</p>}
            <button
              onClick={runCustomCommand}
              className="w-full rounded-lg bg-violet-600 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Run Command
            </button>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5 text-sm leading-6 text-slate-300">
            <h2 className="mb-2 text-lg font-semibold text-white">Instruction</h2>
            <p>Type or paste a JSON command to control the canvas. Use "Load Example" to see a complex scene.</p>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}

function ActionButton({
  label,
  icon: Icon,
  onClick
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-black/25 px-4 text-sm font-medium text-white transition hover:border-violet/60 hover:bg-violet/20"
    >
      <Icon className="h-5 w-5 text-violet-200" />
      {label}
    </button>
  );
}
