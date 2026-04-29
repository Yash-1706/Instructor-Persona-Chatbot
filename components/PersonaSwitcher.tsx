"use client";

import { PERSONAS, PERSONA_ORDER, PersonaId } from "@/lib/personas";

interface Props {
  active: PersonaId;
  onChange: (id: PersonaId) => void;
}

export function PersonaSwitcher({ active, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-panel p-1">
      {PERSONA_ORDER.map((id) => {
        const persona = PERSONAS[id];
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={[
              "group relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              isActive
                ? "bg-accent-subtle text-fg"
                : "text-fg-muted hover:text-fg",
            ].join(" ")}
            aria-pressed={isActive}
          >
            <span
              className="h-2 w-2 rounded-full"
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
