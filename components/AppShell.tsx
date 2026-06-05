"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  CheckSquare,
  Clapperboard,
  FlaskConical,
  MessageCircle,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles
} from "lucide-react";

const navItems = [
  { href: "/", label: "Chat", icon: MessageCircle },
  { href: "/studio", label: "Studio", icon: Clapperboard },
  { href: "/memory", label: "Memory", icon: Brain },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/projects", label: "Projects", icon: ScrollText },
  { href: "/automation", label: "Automation", icon: FlaskConical },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-ink/80 text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-black/24 px-4 py-5 backdrop-blur-xl lg:block">
        <Link href="/" className="flex items-center gap-3 px-2">
          <Image
            src="/illuvrse-mascot.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover ring-1 ring-violet/50"
            priority
          />
          <div>
            <div className="text-2xl font-semibold tracking-wide text-violet-300">ILLUVRSE</div>
            <div className="text-sm text-slate-400">Chief of Staff</div>
          </div>
        </Link>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-12 items-center gap-3 rounded-lg px-4 text-sm transition ${
                  active
                    ? "bg-violet/30 text-white shadow-glow"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-200">
            <Sparkles className="h-4 w-4" />
            Local-First Core
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
            <span>Runtime</span>
            <span className="text-right text-mint">Ollama</span>
            <span>Default model</span>
            <span className="text-right text-mint">llama3.2:3b</span>
            <span>Cloud AI</span>
            <span className="text-right text-mint">Off</span>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/[0.82] px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-3">
            <Image
              src="/illuvrse-mascot.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-violet/50"
            />
            <div className="font-semibold text-violet-200">ILLUVRSE</div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    active ? "bg-violet/30 text-white" : "bg-white/[0.04] text-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <SafetyNote />
          {children}
        </section>
      </div>
    </main>
  );
}

function SafetyNote() {
  return (
    <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-300/25 bg-amber-300/[0.08] px-4 py-3 text-sm text-amber-100">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
      <p>
        Approval required before destructive actions, online posting, sending messages,
        purchases, file deletion, account access, or changing sensitive settings.
      </p>
    </div>
  );
}
