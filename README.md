# Personae — Persona-Based AI Chatbot

A production-quality chat app where users hold real conversations with three Scaler / InterviewBit personalities — **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra** — each backed by its own carefully engineered system prompt.

Built for the **Scaler Academy · Prompt Engineering** assignment.

> Live demo: https://instructor-persona-chatbot-c9prh60js.vercel.app/

---

## What's inside

- **Three distinct personas**, each with a deeply researched system prompt (description, few-shot examples, chain-of-thought instruction, output format, and constraints).
- **Linear / Vercel-style UI** — dark, minimal, glassy, mobile-first, with a persona switcher, suggestion chips per persona, typing indicator, and graceful error states.
- **Conversation reset** when the persona is switched — no prompt bleed.
- **Server-only API key**: stored in `GROQ_API_KEY` (OpenAI-compatible fallback supported), never shipped to the browser.
- **TypeScript end-to-end**, no `any`, no shortcuts.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | One-click deploy on Vercel, server-side API route, modern React. |
| Language | TypeScript | Catch contract drift between client and API. |
| Styling | Tailwind CSS | Fast iteration, design system in `tailwind.config.ts`. |
| LLM | Groq (OpenAI-compatible) `llama-3.1-70b-versatile` (default, configurable) | Fast responses with strong instruction-following. |
| Markdown | `react-markdown` + `remark-gfm` | Clean rendering of model output. |

---

## Project structure

```
persona-chatbot/
├── app/
│   ├── api/chat/route.ts      # Server route — calls Groq (OpenAI-compatible)
│   ├── globals.css            # Tailwind layer + custom styling
│   ├── layout.tsx             # Fonts, metadata, viewport
│   └── page.tsx               # Mounts ChatInterface
├── components/
│   ├── ChatInterface.tsx      # Top-level chat shell (state, scroll, switching)
│   ├── PersonaSwitcher.tsx    # Pill switcher for the three personas
│   ├── PersonaHeader.tsx      # Active-persona card
│   ├── Message.tsx            # User & assistant bubbles (markdown-aware)
│   ├── TypingIndicator.tsx    # Animated dots while streaming
│   ├── SuggestionChips.tsx    # Per-persona quick-start questions
│   └── Composer.tsx           # Auto-growing textarea with submit button
├── lib/
│   └── personas.ts            # The three system prompts + metadata
├── .env.example               # Copy to .env.local with your key
├── prompts.md                 # All three system prompts, annotated
├── reflection.md              # 300–500 word reflection
└── README.md
```

---

## Running locally

```bash
# 1. Install
npm install

# 2. Add your key
cp .env.example .env.local
# then edit .env.local and paste your GROQ_API_KEY (or OPENAI_API_KEY)

# 3. Run
npm run dev
# → http://localhost:3000
```

Requirements: Node 18.17+ and a Groq or OpenAI API key.

---

## Deploying to Vercel

- Add `GROQ_API_KEY` in Vercel Project Settings → Environment Variables.
- Optional: set `GROQ_MODEL` and `GROQ_BASE_URL` if you want a different model or endpoint.
- The App Router API route runs as a Vercel Serverless Function (Node.js runtime).

---

## How the prompt is wired

Each persona has its full system prompt defined in `lib/personas.ts`. On every request:

```
[ system: persona.systemPrompt ]
[ user: ... ]
[ assistant: ... ]
[ user: ...latest... ]
```

The full conversation is sent each turn, so the persona's voice stays consistent. Switching the persona on the client clears the message history — preventing context bleed between personalities.

---

