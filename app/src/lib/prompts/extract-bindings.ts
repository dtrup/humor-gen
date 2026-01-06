import type { ComedyVoice } from "../types";

export function createExtractBindingsPrompt(
  topic: string,
  voice: ComedyVoice,
  audienceContext: string
): string {
  return `Analyze the topic "${topic}" for comedic potential.

## Your Task

Extract the default meaning-bindings that form automatically when people encounter this topic. These are the "straight" interpretations that audiences assume before any comedic twist.

## Output Format

Return a JSON object with this structure:
{
  "topic": "${topic}",
  "scripts": ["list of frames/contexts this topic activates"],
  "bindings": [
    {
      "id": "unique-id",
      "carrier": "the word, phrase, or action",
      "defaultMeaning": "what people automatically assume it means",
      "confidence": 0.0-1.0,
      "alternativeMeanings": ["other possible interpretations that could be humorous"],
      "category": "lexical|intentional|causal|normative|role|temporal|epistemic"
    }
  ],
  "roles": [
    {
      "label": "role name",
      "agent": "who fills this role",
      "goals": ["what they want"],
      "knowledge": ["what they know or don't know"]
    }
  ],
  "norms": ["social expectations around this topic"],
  "typicalIntentions": ["common motivations/goals"]
}

## Guidelines

1. Focus on bindings with HIGH confidence (>0.7) that are nearly automatic
2. Look for bindings where the gap between "official meaning" and "actual meaning" is wide
3. Consider what's unsaid, assumed, or politely ignored
4. Think about the ${voice} comedic voice - what bindings would that voice target?
5. Audience context: ${audienceContext}

## Categories Explained

- **lexical**: word meaning, category membership
- **intentional**: speech acts, stated vs actual motives
- **causal**: why things happen, cause-effect assumptions
- **normative**: social rules, etiquette, expectations
- **role**: who does what, status relationships
- **temporal**: timing, sequence, "when" assumptions
- **epistemic**: who knows what, assumed knowledge

Extract 4-8 strong bindings with clear comedic potential.`;
}
