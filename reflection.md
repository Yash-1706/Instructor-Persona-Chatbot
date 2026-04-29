# Reflection

## What worked

The biggest unlock was realizing that **adjectives don't carry a persona, examples do.** My first drafts were dense paragraphs of "be warm, be technical, be direct" — the model produced three personas that all sounded like the same helpful assistant wearing different name tags. The moment I added three fully-written ideal Q→A pairs to each system prompt, the voices snapped into focus. Anshuman's clipped first-principles style, Abhimanyu's story-led builder energy, and Kshitij's question-back teaching cadence became distinguishable on the first try. Few-shot examples are not optional decoration; they are the persona's bones.

The second thing that worked was **forcing differentiation deliberately**. All three personas live in adjacent territory (Scaler, engineering education, India tech). Without active differentiation they blurred. I gave each persona one signature move that the other two are forbidden from copying — Anshuman's sharp closing question, Abhimanyu's "what's *your* situation" pivot, Kshitij's tiny concrete example. Once those moves were locked in, the personalities held under almost any user input.

## What GIGO taught me

Garbage In, Garbage Out hit me in two places. **First, in the prompt itself.** My initial CoT instruction said "think step by step before answering" — generic, lazy, useless. The model still produced generic answers. I rewrote each persona's CoT with *specific* steps tied to that persona's reasoning style ("what is the person *actually* asking under the literal question?" for Anshuman; "what stage of building is this person at?" for Abhimanyu). Specificity in the prompt produced specificity in the output. Lazy in, lazy out — exactly as advertised.

**Second, in research.** I almost wrote Anshuman's prompt from a single LinkedIn bio. The result was a hollow, marketing-flavored persona. Going back to actual content — listening to how he frames problems on talks, the specific phrases he repeats, his stance on AI tools and fundamentals — completely changed the prompt. The model only sounds authentic if the *input* contains authentic specifics. There is no shortcut around the research; a beautiful prompt template fed shallow facts produces a shallow output.

## What I would improve

If I had another week:

1. **Streaming responses.** Right now the typing indicator runs until the full reply lands; streaming would feel snappier and let the user start reading mid-generation.
2. **Prompt evals.** I tested by hand. With 30+ canned questions per persona run through both `gpt-4o-mini` and a stronger model, I could regression-test prompt edits objectively instead of vibe-checking.
3. **Memory between sessions.** Persona switching correctly resets the conversation, but a returning user has to start over. A simple per-persona localStorage history would help.
4. **Better safety rails.** The "if user is in distress, drop persona" instruction works on the obvious cases but I haven't stress-tested edge prompts. Real product usage would need a content-classification layer in front of the model.
5. **Voice mode.** All three personas are public speakers; reading their responses aloud (TTS with voice cloning ethics handled properly) would be genuinely powerful for a learning product.

The single biggest lesson: **prompt engineering is product design.** Every line in `lib/personas.ts` is a product decision about how this character should behave under uncertainty. Treating the system prompt as a throwaway string is the failure mode; treating it as a spec for a teammate is the unlock.

(~470 words)
