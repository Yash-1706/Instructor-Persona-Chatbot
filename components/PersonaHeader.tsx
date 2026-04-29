"use client";

import { Persona } from "@/lib/personas";

export function PersonaHeader({ persona }: { persona: Persona }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-elevated text-sm font-semibold text-fg"
      >
        {persona.initials}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="truncate font-display text-sm font-semibold text-fg">{persona.name}</h2>
          <span className="text-[10px] uppercase tracking-[0.22em] text-fg-subtle">Active</span>
        </div>
        <p className="truncate text-xs text-fg-muted">{persona.title}</p>
        <p className="truncate text-xs text-fg-subtle">{persona.blurb}</p>
      </div>
    </div>
  );
}
