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
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, ${persona.accent}, ${persona.accent}99)`,
          }}
          aria-hidden
        >
          {persona.initials}
        </div>
      )}
      <div
        className={[
          "message-prose max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed sm:max-w-[75%]",
          isUser
            ? "bg-fg text-bg"
            : message.error
              ? "border border-red-500/30 bg-red-500/5 text-red-200"
              : "border border-border bg-bg-panel text-fg",
        ].join(" ")}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}
