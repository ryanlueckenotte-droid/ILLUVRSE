"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Circle, Play, Square, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";

type Shape = {
  type: "circle" | "rectangle";
  x: number;
  y: number;
  color: string;
};

export default function CanvasLabPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    drawScene(shapes, animating ? performance.now() : 0);

    if (!animating) {
      return;
    }

    function frame(time: number) {
      drawScene(shapes, time);
      animationRef.current = window.requestAnimationFrame(frame);
    }

    animationRef.current = window.requestAnimationFrame(frame);

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shapes, animating]);

  function drawScene(nextShapes: Shape[], time: number) {
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

    for (const shape of nextShapes) {
      context.fillStyle = shape.color;
      if (shape.type === "circle") {
        context.beginPath();
        context.arc(shape.x, shape.y, 52, 0, Math.PI * 2);
        context.fill();
      } else {
        context.fillRect(shape.x - 64, shape.y - 44, 128, 88);
      }
    }

    if (animating) {
      const ballX = 92 + ((time / 7) % (canvas.width - 184));
      const ballY = 340 + Math.sin(time / 180) * 46;
      context.fillStyle = "#42f58d";
      context.beginPath();
      context.arc(ballX, ballY, 28, 0, Math.PI * 2);
      context.fill();
    }
  }

  function drawCircle() {
    setShapes((current) => [
      ...current,
      { type: "circle", x: 210 + current.length * 18, y: 160, color: "#a78bfa" }
    ]);
  }

  function drawRectangle() {
    setShapes((current) => [
      ...current,
      { type: "rectangle", x: 455 + current.length * 12, y: 230, color: "#38bdf8" }
    ]);
  }

  function clearCanvas() {
    setAnimating(false);
    setShapes([]);
  }

  function animateBall() {
    setAnimating(true);
  }

  return (
    <AppShell>
      <SectionHeader title="Canvas Lab" eyebrow="Local drawing sandbox" />

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="aspect-video w-full rounded-lg border border-white/10 bg-slate-950"
            aria-label="ILLUVRSE drawing canvas"
          />
        </section>

        <aside className="space-y-4">
          <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <h2 className="mb-4 text-lg font-semibold">Drawing Controls</h2>
            <div className="grid gap-3">
              <ActionButton label="Draw Circle" icon={Circle} onClick={drawCircle} />
              <ActionButton label="Draw Rectangle" icon={Square} onClick={drawRectangle} />
              <ActionButton label="Clear Canvas" icon={Trash2} onClick={clearCanvas} />
              <ActionButton label="Animate Ball" icon={Play} onClick={animateBall} />
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5 text-sm leading-6 text-slate-300">
            <h2 className="mb-2 text-lg font-semibold text-white">Training Target</h2>
            <p>Playwright can safely click these controls, observe the canvas, and save screenshots.</p>
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
