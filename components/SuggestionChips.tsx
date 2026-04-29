"use client";

import { Persona } from "@/lib/personas";

interface Props {
  persona: Persona;
  onPick: (text: string) => void;
}

export function SuggestionChips({ persona, onPick }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {persona.suggestions.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onPick(s)}
          className="group rounded-xl border border-border bg-bg-elevated px-3 py-2 text-left text-xs text-fg-muted transition-all hover:border-border-strong hover:bg-bg-panel hover:text-fg sm:text-sm"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
