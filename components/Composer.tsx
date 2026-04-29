"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  placeholder: string;
}

export function Composer({ value, onChange, onSubmit, disabled, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  function submit(e?: FormEvent) {
    e?.preventDefault();
    if (disabled || !value.trim()) return;
    onSubmit();
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={submit} className="relative">
      <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-bg-panel/80 p-2 backdrop-blur transition-all focus-within:border-border-strong focus-within:bg-bg-panel">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder={placeholder}
          className="max-h-[200px] flex-1 resize-none bg-transparent px-3 py-2 text-[15px] leading-relaxed text-fg placeholder:text-fg-subtle focus:outline-none"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-fg text-bg transition-all hover:bg-white disabled:cursor-not-allowed disabled:bg-bg-elevated disabled:text-fg-subtle"
          aria-label="Send"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 13V3M8 3L3 8M8 3l5 5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <p className="mt-2 px-2 text-[11px] text-fg-subtle">
        Enter to send · Shift+Enter for new line · Switching personas resets the conversation
      </p>
    </form>
  );
}
