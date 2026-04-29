"use client";

import { PERSONAS, PERSONA_ORDER, PersonaId } from "@/lib/personas";

interface Props {
  active: PersonaId;
  onChange: (id: PersonaId) => void;
}

export function PersonaSwitcher({ active, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-panel/60 p-1 backdrop-blur">
      {PERSONA_ORDER.map((id) => {
        const persona = PERSONAS[id];
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={[
              "group relative flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
              isActive
                ? "bg-bg-elevated text-fg shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_4px_16px_-8px_rgba(0,0,0,0.5)]"
                : "text-fg-muted hover:text-fg",
            ].join(" ")}
            aria-pressed={isActive}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: persona.accent }}
            />
            <span className="hidden sm:inline">{persona.name.split(" ")[0]}</span>
            <span className="sm:hidden">{persona.initials}</span>
          </button>
        );
      })}
    </div>
  );
}
