"use client";

import { Persona } from "@/lib/personas";

export function PersonaHeader({ persona }: { persona: Persona }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-base font-semibold text-white"
        style={{
          background: `linear-gradient(135deg, ${persona.accent}, ${persona.accent}88)`,
          boxShadow: `0 8px 24px -10px ${persona.accent}66`,
        }}
      >
        {persona.initials}
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg bg-emerald-500" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-base font-semibold text-fg">{persona.name}</h2>
          <span className="rounded-md border border-border bg-bg-panel px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-fg-muted">
            Online
          </span>
        </div>
        <p className="truncate text-xs text-fg-muted">{persona.title} · {persona.blurb}</p>
      </div>
    </div>
  );
}
