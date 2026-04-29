"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Persona } from "@/lib/personas";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

export function Message({ message, persona }: { message: ChatMessage; persona: Persona }) {
  const isUser = message.role === "user";

  return (
    <div
      className={[
        "flex w-full animate-slide-up gap-3",
        isUser ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      {!isUser && (
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated text-xs font-semibold text-fg"
          style={{
            borderColor: `${persona.accent}55`,
          }}
          aria-hidden
        >
          {persona.initials}
        </div>
      )}
      <div
        className={[
          "message-prose max-w-[85%] rounded-2xl border px-4 py-3 text-[15px] leading-relaxed sm:max-w-[72%]",
          isUser
            ? "border-accent/20 bg-accent-subtle text-fg"
            : message.error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-border bg-bg-panel text-fg",
        ].join(" ")}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}
