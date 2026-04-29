import { NextRequest, NextResponse } from "next/server";
import { PERSONAS, PersonaId } from "@/lib/personas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  personaId: PersonaId;
  messages: ChatMessage[];
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing GROQ_API_KEY. Add it to your environment." },
      { status: 500 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const persona = PERSONAS[body.personaId];
  if (!persona) {
    return NextResponse.json({ error: "Unknown persona." }, { status: 400 });
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "messages must be a non-empty array." }, { status: 400 });
  }

  const baseURL = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
  const envModel = process.env.GROQ_MODEL;
  const model =
    envModel && envModel !== "llama-3.1-70b-versatile"
      ? envModel
      : "llama-3.1-8b-instant";
  const endpoint = `${baseURL.replace(/\/$/, "")}/chat/completions`;
  const payload = {
    model,
    temperature: 0.7,
    max_tokens: 600,
    messages: [
      { role: "system", content: persona.systemPrompt },
      ...body.messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => null)) as
      | { choices?: Array<{ message?: { content?: string } }>;
          error?: { message?: string };
          message?: string }
      | null;

    if (!response.ok) {
      const message = data?.error?.message || data?.message || "Unexpected error.";
      return NextResponse.json(
        { error: `Couldn't reach the model: ${message}` },
        { status: response.status }
      );
    }

    const reply = data?.choices?.[0]?.message?.content?.trim() ?? "";
    if (!reply) {
      return NextResponse.json(
        { error: "The model returned an empty response. Please try again." },
        { status: 502 }
      );
    }
    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error contacting the model.";
    return NextResponse.json(
      { error: `Couldn't reach the model: ${message}` },
      { status: 502 }
    );
  }
}
