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
    <div className="relative min-h-dvh bg-bg text-fg">
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-paper" />

      <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-border bg-bg-panel text-fg">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 8c0-3 2.5-5.5 6-5.5s6 2.5 6 5.5c0 2-1 3.5-2.5 4.5L11 14H5l-.5-1.5C3 11.5 2 10 2 8z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-semibold tracking-tight">Personae</div>
              <div className="text-[11px] tracking-[0.18em] text-fg-subtle">Persona Chat</div>
            </div>
          </div>
          <PersonaSwitcher active={activeId} onChange={switchPersona} />
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-bg-panel/90 p-4">
              <PersonaHeader persona={persona} />
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                Chat with <span className="text-fg">{persona.name}</span>. Keep it focused, and the
                persona will keep it crisp. Try a prompt below to get started.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-bg-panel/90 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-fg">Suggestions</h3>
                <span className="text-[11px] tracking-[0.18em] text-fg-subtle">Quick</span>
              </div>
              <div className="mt-3">
                <SuggestionChips persona={persona} onPick={onPickSuggestion} />
              </div>
            </section>
          </aside>

          <section className="flex min-h-[70vh] flex-col rounded-2xl border border-border bg-bg-panel/90">
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
              <div className="space-y-3">
                {messages.map((m) => (
                  <Message key={m.id} message={m} persona={persona} />
                ))}
                {loading && <TypingIndicator persona={persona} />}
              </div>
            </div>
            <div className="border-t border-border bg-bg-elevated/80 px-4 py-4 sm:px-6">
              <Composer
                value={input}
                onChange={setInput}
                onSubmit={() => void send(input)}
                disabled={loading}
                placeholder={`Message ${persona.name.split(" ")[0]}…`}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
