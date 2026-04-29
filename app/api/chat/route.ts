import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
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
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing OPENAI_API_KEY. Add it to your environment." },
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

  const baseURL = process.env.OPENAI_BASE_URL || undefined;
  const client = new OpenAI({ apiKey, baseURL });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.7,
      max_tokens: 600,
      messages: [
        { role: "system", content: persona.systemPrompt },
        ...body.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!reply) {
      return NextResponse.json(
        { error: "The model returned an empty response. Please try again." },
        { status: 502 }
      );
    }
    return NextResponse.json({ reply });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error contacting the model.";
    const status =
      err instanceof OpenAI.APIError && typeof err.status === "number" ? err.status : 502;
    return NextResponse.json(
      { error: `Couldn't reach the model: ${message}` },
      { status }
    );
  }
}
