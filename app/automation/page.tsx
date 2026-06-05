import { AppShell } from "@/components/AppShell";
import { SectionHeader } from "@/components/SectionHeader";
import { Camera, CirclePlay, FlaskConical, MousePointerClick, Palette, ShieldCheck } from "lucide-react";

const commandCards = [
  {
    title: "Browser Check",
    description: "Launch Chromium and confirm Playwright can control a local browser.",
    command: "npm run browser:check",
    icon: CirclePlay
  },
  {
    title: "Screenshot Test",
    description: "Capture the local ILLUVRSE homepage into automation/output/homepage.png.",
    command: "npm run browser:screenshot",
    icon: Camera
  },
  {
    title: "Local Page Test",
    description: "Open the safe canvas lab, click drawing controls, animate, and save a screenshot.",
    command: "npm run browser:local-test",
    icon: MousePointerClick
  },
  {
    title: "Drawing Lab",
    description: "Coming soon: structured drawing lessons for characters, props, and scenes.",
    command: "Open /lab/canvas",
    icon: Palette
  },
  {
    title: "Animation Lab",
    description: "Coming soon: timeline, keyframes, easing, and export experiments.",
    command: "Read docs/animation-engine.md",
    icon: FlaskConical
  }
];

export default function AutomationPage() {
  return (
    <AppShell>
      <SectionHeader title="Automation Lab" eyebrow="Playwright training" />

      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <section className="grid gap-4 md:grid-cols-2">
          {commandCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-violet/25 text-violet-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-white">{card.title}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-300">{card.description}</p>
                <code className="mt-4 block rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-mint">
                  {card.command}
                </code>
              </article>
            );
          })}
        </section>

        <aside className="space-y-5">
          <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <h2 className="mb-3 text-lg font-semibold">Playwright Status</h2>
            <div className="space-y-3 text-sm text-slate-300">
              <StatusRow label="Package" value="@playwright/test" />
              <StatusRow label="Browser" value="Chromium only" />
              <StatusRow label="Target scope" value="localhost only" />
              <StatusRow label="Output" value="automation/output" />
            </div>
          </section>

          <section className="rounded-lg border border-amber-300/25 bg-amber-300/[0.08] p-5 text-amber-100">
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-5 w-5" />
              Safety Boundary
            </div>
            <p className="text-sm leading-6">
              Automation is limited to local sandbox pages. No external browsing, account login,
              posting, uploading, purchases, messaging, or destructive file actions are implemented.
            </p>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
      <span className="text-slate-400">{label}</span>
      <span className="text-right text-mint">{value}</span>
    </div>
  );
}
