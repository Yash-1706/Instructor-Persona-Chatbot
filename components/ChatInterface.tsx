"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PERSONAS, PersonaId } from "@/lib/personas";
import { ChatMessage, Message } from "./Message";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestionChips } from "./SuggestionChips";
import { Composer } from "./Composer";
import { PersonaHeader } from "./PersonaHeader";
import { PersonaSwitcher } from "./PersonaSwitcher";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function ChatInterface() {
  const [activeId, setActiveId] = useState<PersonaId>("anshuman");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const persona = PERSONAS[activeId];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const switchPersona = useCallback((id: PersonaId) => {
    if (id === activeId) return;
    setActiveId(id);
    setMessages([]);
    setInput("");
  }, [activeId]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: ChatMessage = { id: uid(), role: "user", content: trimmed };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personaId: activeId,
            messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong. Please try again.");
        }

        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "assistant", content: data.reply },
        ]);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Network error. Check your connection and retry.";
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "assistant", content: msg, error: true },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [activeId, loading, messages]
  );

  const onPickSuggestion = (s: string) => {
    setInput(s);
    void send(s);
  };

  return (
    <div className="flex h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 8c0-3 2.5-5.5 6-5.5s6 2.5 6 5.5c0 2-1 3.5-2.5 4.5L11 14H5l-.5-1.5C3 11.5 2 10 2 8z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Personae</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                Scaler · Persona Chat
              </div>
            </div>
          </div>
          <PersonaSwitcher active={activeId} onChange={switchPersona} />
        </div>
      </header>

      <div className="relative flex-1 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid opacity-[0.6]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-60"
          style={{
            background: `radial-gradient(ellipse at top, ${persona.accent}22, transparent 60%)`,
          }}
        />
        <div ref={scrollRef} className="relative h-full overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 pb-40 pt-6 sm:px-6 sm:pt-10">
            <section className="mb-6 rounded-2xl border border-border bg-bg-panel/40 p-5 backdrop-blur">
              <PersonaHeader persona={persona} />
              <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                You're chatting with an AI persona of <span className="text-fg">{persona.name}</span>.
                Responses are generated and may not reflect their actual views — but the system prompt
                is researched and constraint-checked. Try a starter:
              </p>
              <div className="mt-4">
                <SuggestionChips persona={persona} onPick={onPickSuggestion} />
              </div>
            </section>

            <div className="space-y-4">
              {messages.map((m) => (
                <Message key={m.id} message={m} persona={persona} />
              ))}
              {loading && <TypingIndicator persona={persona} />}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg via-bg/90 to-transparent pb-4 pt-12">
          <div className="pointer-events-auto mx-auto w-full max-w-3xl px-4 sm:px-6">
            <Composer
              value={input}
              onChange={setInput}
              onSubmit={() => void send(input)}
              disabled={loading}
              placeholder={`Message ${persona.name.split(" ")[0]}…`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
