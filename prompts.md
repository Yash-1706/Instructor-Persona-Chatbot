# prompts.md — Persona System Prompts (Annotated)

This document is the **product decision record** for the three system prompts that power the Personae chatbot. Every prompt deliberately contains:

1. **Persona description** — background, values, tone.
2. **Few-shot examples** — at least 3 ideal Q→A pairs.
3. **Chain-of-Thought instruction** — internal reasoning, hidden from user.
4. **Output format** — sentence count, ending behavior, tone limits.
5. **Constraints** — what the persona must never do.

The actual prompt strings are the source of truth in `lib/personas.ts` (see constants `ANSHUMAN_PROMPT`, `ABHIMANYU_PROMPT`, `KSHITIJ_PROMPT`). What follows is the *why* behind each design choice.

---

## Persona 1 — Anshuman Singh

**Voice target:** the deeply technical co-founder who debugs problems at first principles. Calm, direct, slightly impatient with hand-waving.

### Why these design choices

- **"First principles, then ship"** — opening line establishes a worldview, not a list of skills. The model anchors tone on this phrase across every response.
- **"Slightly impatient with hand-waving"** — this single sentence shifts the model from generic-helpful-assistant into a senior-engineer voice. Without it, GPT defaults to "great question!" sycophancy.
- **Hinglish-aware micro-vocabulary** ("let's say", "see basically", "the real question is") — gives the model concrete lexical handles. We avoid forcing Hindi/Hinglish; it cues *availability* rather than mandate.
- **Few-shot example #1 (DSA failures)** — shows the model how to push back without being mean. The reply ends with a sharp question, modeling our output format.
- **Few-shot example #2 (AI tools vs fundamentals)** — picks a *current, polarizing* topic so the persona's views are unambiguous.
- **Few-shot example #3 (DSA vs dev)** — proves the persona can give balanced advice, not just contrarian takes.
- **CoT step 4 — "honest pushback"** — the personalty is built around questions back to the user; making it a CoT step means the model plans for it instead of tacking on a generic "does that help?".
- **Output format: end with sharp specific question** — single biggest signal that distinguishes Anshuman's voice from Generic AI Assistant.
- **Constraint: "never claim Scaler is the only path"** — protects the real person from being misrepresented and addresses the assignment's "represent them fairly" rule.

### Failure modes we tested against
- Bland "great question, here are 5 tips" → killed by "no bulleted unless absolutely necessary" + sharp-question close.
- Fake humility / corporate tone → killed by "slightly impatient with hand-waving".
- Generic motivational fluff → explicit constraint: "no motivational poster language".

---

## Persona 2 — Abhimanyu Saxena

**Voice target:** builder-CEO. Warmer than Anshuman, faster pace, war stories from Fab and InterviewBit, frames everything around *building*.

### Why these design choices

- **"Founder's founder"** + the Fab.com unicorn-then-crash beat — gives the model a unique experiential frame nobody else has. Models lean on what's specific, so concrete biography beats adjectives.
- **"Thinks in funnels and unit economics, but can drop into a code review"** — prevents the persona from collapsing into pure-MBA mode. Anshuman is "deep technical", Abhimanyu is "deep operator who ships".
- **"You ask the user about *their* situation before generalizing"** — this is the single most differentiating habit between Abhimanyu and Anshuman. Without it the two voices blur.
- **Few-shot example #1 (startup in college)** — distinguishes "starting" from "committing", a real founder distinction. Models the warmth-with-rigor tone.
- **Few-shot example #2 (big tech vs early-stage)** — shows the persona giving a *both-sides* answer with conviction, not fence-sitting.
- **Few-shot example #3 (why Scaler from InterviewBit)** — uses real company history. Grounds the persona in verifiable fact, increasing authenticity.
- **CoT step: "what stage of building is this person at?"** — forces the model to triage before answering. The same advice given to an exploring student vs a stuck founder is wrong; this step prevents that.
- **Output format: 5–7 sentences, one concrete story** — slightly longer than Anshuman because story-telling is core to this voice.
- **Constraint: "no buzzwords"** — explicit because LLMs love "synergy / 10x / disruptive" when prompted to sound founder-y.

### Failure modes we tested against
- Generic founder-influencer tone ("hustle, grind, ship") → killed by anti-buzzword constraint + grounded-in-experience instruction.
- Both-sides-are-valid mush → killed by "give an honest answer with conviction" via the example responses.

---

## Persona 3 — Kshitij Mishra

**Voice target:** the teacher whose superpower is making hard concepts feel inevitable. Patient, asks questions back, uses tiny concrete examples.

### Why these design choices

- **"A teacher first, engineer second"** — opens by ranking identities. The model learns to optimize for *student understanding*, not *correct answer*. This single line changes behavior dramatically.
- **"Allergic to fake understanding"** — protects against the LLM's natural tendency to hand-walk students through every step. Pushes the model to invite real attempts.
- **"You teach by asking questions back. You almost never give the answer first."** — this constraint is bold but produces dramatically more authentic teacher behavior. We accept the tradeoff: sometimes the user has to insist on a direct answer.
- **Hinglish phrases ("ek minute, sochke batao", "ab dekho", "let's dry run this")** — distinct vocabulary signature from the other two personas.
- **Few-shot example #1 (recursion confusion)** — models the "name the real bug" move (it's not recursion, it's *trust*). Pure Kshitij move.
- **Few-shot example #2 (DP intuition)** — shows the "two questions hiding inside" reframing. Teaches a meta-skill, not just an answer.
- **Few-shot example #3 (working professional, am I doing enough)** — non-technical question, technical persona, proves the empathy is genuine and not just patter.
- **CoT step: "what question can I ask to make *them* discover the next step?"** — forces the model to plan an open-ended close instead of a Socratic-by-accident one.
- **Output format: 5–8 sentences with at least one tiny example** — concrete examples are Kshitij's pedagogical signature. The constraint guarantees they show up.
- **Constraint: "never give the full code solution before the student has tried"** — biggest deviation from default LLM behavior. Worth it: this is the entire point of the persona.

### Failure modes we tested against
- "Here's the solution, paste this code" → killed by no-full-solution constraint.
- Performative warmth ("you're amazing!") → killed by "honest, not flattering" + no-emoji rule.
- Lecturing → killed by "teaches by asking questions back".

---

## Cross-cutting design principles

1. **Show, don't tell.** Each prompt has 3 fully-written ideal responses. Few-shot beats adjective lists every time. When we removed examples in early iterations, the personas blurred together.
2. **Constraints are doors, not walls.** Each "never do X" clause exists because we observed the model doing X. Generic constraints don't help; specific ones do.
3. **Differentiation matters.** Anshuman, Abhimanyu, and Kshitij occupy adjacent ground (all Scaler, all engineering education). The prompts go out of their way to *differentiate* — first-principles vs builder-operator vs teacher — because if a user can't tell who they're talking to, the product fails.
4. **Hidden CoT.** Every persona reasons step-by-step but is told **not to show the reasoning**. The user sees a confident, polished reply; the model still benefits from the planning step.
5. **Same skeleton, different soul.** All three prompts follow the exact same structure (Who you are → How you talk → Few-shot → CoT → Output → Constraints). This makes the codebase maintainable and lets us A/B-test individual sections without re-architecting.
6. **GIGO discipline.** Every line in every prompt earns its place. If a sentence didn't change model behavior in testing, it was cut.
