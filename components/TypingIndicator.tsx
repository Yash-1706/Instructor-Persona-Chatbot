"use client";

import { Persona } from "@/lib/personas";

export function TypingIndicator({ persona }: { persona: Persona }) {
  return (
    <div className="flex animate-fade-in items-end gap-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated text-xs font-semibold text-fg"
        style={{ borderColor: `${persona.accent}55` }}
      >
        {persona.initials}
      </div>
      <div className="rounded-2xl border border-border bg-bg-panel px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-fg-muted [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-fg-muted [animation-delay:200ms]" />
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-fg-muted [animation-delay:400ms]" />
        </div>
      </div>
    </div>
  );
}
