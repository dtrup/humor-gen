import type { ComedyVoice, JokeFormat, OperationType } from "../types";

export type MutationType =
    | "sharpen_twist"
    | "increase_misdirection"
    | "trim_setup"
    | "swap_operation"
    | "change_format"
    | "amplify_violation";

export function createMutateJokePrompt(
    jokeText: string,
    mutationType: MutationType,
    currentMechanism: {
        operation: OperationType;
        twistWord: string;
        setup: string;
        alternative: string;
    },
    voice: ComedyVoice,
    format: JokeFormat = "one_liner"
): string {
    const mutationInstructions: Record<MutationType, string> = {
        sharpen_twist: `
      Focus on the twist word "${currentMechanism.twistWord}".
      - Find a more precise, punchy replacement
      - Move it later in the sentence if possible
      - Consider phonetic impact and surprise factor
      - The best twist words are unexpected but inevitable in hindsight`,

        increase_misdirection: `
      Strengthen the default interpretation before breaking it.
      - Add details that make the default seem MORE true
      - Lean into clichés or expectations
      - Make the audience MORE confident in the wrong direction
      - The snap will be stronger when they fall further`,

        trim_setup: `
      Cut ruthlessly. Every word must earn its place.
      - Remove adjectives that don't add
      - Combine phrases where possible
      - Delete anything the audience already assumes
      - The goal is maximum payload per word`,

        swap_operation: `
      The current operation is ${currentMechanism.operation}. Try a different one:
      - emptying: Remove expected meaning/motive
      - loading: Attach unexpected meaning
      - exposure: Make the binding visible
      - reversal: Flip expectations
      - overliteralization: Take figurative literally
      - categoryCrossing: Violate categories
      Keep the core insight but change HOW you deliver the violation.`,

        change_format: `
      The current format is ${format}. Try:
      - one_liner: Single sentence, punch at end
      - setup_punchline: Clear two-part structure
      - story: Longer build with multiple beats
      - callback: Reference an earlier element
      Maintain the mechanism but reshape the delivery.`,

        amplify_violation: `
      Push the violation harder.
      - The alternative "${currentMechanism.alternative}" could be more extreme
      - Find a more surprising interpretation
      - While maintaining benignness, maximize the gap
      - Make the snap more satisfying`
    };

    return `You are mutating an existing joke to improve it.

## Original Joke
"${jokeText}"

## Current Mechanism
- Operation: ${currentMechanism.operation}
- Setup: ${currentMechanism.setup}
- Twist word: ${currentMechanism.twistWord}
- Alternative (snap target): ${currentMechanism.alternative}

## Mutation Type: ${mutationType}
${mutationInstructions[mutationType]}

## Voice: ${voice}
Maintain this comedic voice in the mutation.

## Output Format

Return JSON:
{
  "mutatedJoke": "the new version of the joke",
  "changes": [
    "Description of change 1",
    "Description of change 2"
  ],
  "newTwistWord": "the twist word in the new version",
  "explanation": "Why this mutation should work better",
  "scores": {
    "bindingStrength": 0.0-1.0,
    "violationMagnitude": 0.0-1.0,
    "repairability": 0.0-1.0,
    "benignness": 0.0-1.0,
    "economy": 0.0-1.0,
    "originality": 0.0-1.0,
    "overall": 0.0-1.0
  }
}

Generate the best possible mutation.`;
}
