import type { Binding, ComedyVoice, OperationWeights, StyleDials, JokeFormat } from "../types";

export function createGenerateJokesPrompt(
  bindings: Binding[],
  voice: ComedyVoice,
  operationWeights: OperationWeights,
  styleDials: StyleDials,
  format: JokeFormat,
  audienceContext: string
): string {
  // Convert weights to guidance
  const preferredOps = Object.entries(operationWeights)
    .filter(([_, weight]) => weight > 60)
    .map(([op]) => op);

  const styleGuidance = getStyleGuidance(styleDials);

  const bindingsJson = JSON.stringify(bindings, null, 2);

  return `Generate jokes using these meaning-bindings as raw material.

## Target Bindings
${bindingsJson}

## Comedic Voice: ${voice}
${getVoiceDescription(voice)}

## Preferred Operations
Focus on these detachment operations (weighted higher): ${preferredOps.join(", ") || "any"}

## Style Guidance
${styleGuidance}

## Format
Generate jokes in the "${format}" format.

## Audience
${audienceContext}

## Output Format

Return a JSON object:
{
  "candidates": [
    {
      "id": "unique-id",
      "text": "the actual joke text",
      "format": "${format}",
      "setup": "the setup portion that builds the default",
      "twist": "where the detachment happens",
      "twistWord": "the specific word/phrase that triggers the snap",
      "targetBindingId": "which binding this exploits",
      "operation": "emptying|loading|exposure|reflection|reversal|overliteralization|categoryCrossing|compression",
      "violationType": "semantic|pragmatic|causal|epistemic|normative|narrative",
      "alternativeModel": "the new interpretation audience snaps to",
      "repairPath": "how audience gets from default to alternative",
      "benignessStrategy": "fictional_distance|archetypal_target|self_inclusion|affectionate_framing|absurdity_escape|consent_reclamation|temporal_distance|status_leveling",
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
  ]
}

## Key Principles

1. **Strong Setup**: The default interpretation must form quickly and confidently
2. **Clean Detachment**: The operation should be clear, not muddy
3. **Fast Repair**: Audience should "snap" to the alternative quickly
4. **Economy**: Maximum payoff per word - don't overexplain
5. **Twist Placement**: Put the twist word as late as possible

Generate 5 distinct candidates using different operations or targeting different aspects of the bindings.`;
}

function getVoiceDescription(voice: ComedyVoice): string {
  const descriptions: Record<ComedyVoice, string> = {
    deadpan: "Flat, understated delivery. Let the absurdity speak for itself. No emotional tells.",
    observational: 'Shared recognition style. "We all do this" energy. Find the universal in the specific.',
    absurdist: "Push logic to extremes. Accept ridiculous premises as given. Straight-faced nonsense.",
    self_deprecating: "Self as primary target. Vulnerability as comedy. The speaker is the butt of the joke.",
    dark: "Find humor in uncomfortable places. Transgressive but earned. Not shock for shock's sake.",
    surreal: "Dream logic. Category violations. Things that shouldn't go together, presented as natural.",
    sardonic: "Bitter wit. Cynical edge. See through pretense and call it out.",
    whimsical: "Playful, light touch. Gentle absurdity. Joy in small observations.",
    dry_wit: "Understated cleverness. The humor is in what's NOT said. Ironic distance.",
    physical: "Action-based humor. Visual elements. Exaggerated physical reality.",
    wordplay: "Linguistic play. Puns, double meanings, phonetic similarities. Sound as comedy.",
  };
  return descriptions[voice] || descriptions.observational;
}

function getStyleGuidance(dials: StyleDials): string {
  const lines: string[] = [];

  if (dials.violation > 60) {
    lines.push("- Push harder on the violation. Be sharp, not gentle.");
  } else if (dials.violation < 40) {
    lines.push("- Keep violations mild. Gentle subversion rather than disruption.");
  }

  if (dials.abstraction > 60) {
    lines.push("- Go abstract. Universal patterns over specific details.");
  } else if (dials.abstraction < 40) {
    lines.push("- Stay concrete and specific. Ground in real details.");
  }

  if (dials.verbosity > 60) {
    lines.push("- Elaborate style allowed. Build atmosphere, use rhythm.");
  } else if (dials.verbosity < 40) {
    lines.push("- Maximum economy. Every word must earn its place.");
  }

  if (dials.meta > 60) {
    lines.push("- Self-aware and meta-referential. Comment on the form.");
  } else if (dials.meta < 40) {
    lines.push("- Play it straight. No self-reference or meta-commentary.");
  }

  if (dials.darkness > 60) {
    lines.push("- Darker territory allowed. Uncomfortable truths, mortality, failure.");
  } else if (dials.darkness < 40) {
    lines.push("- Keep it light. Nothing too heavy or uncomfortable.");
  }

  if (dials.wordplay > 60) {
    lines.push("- Emphasize linguistic play. Puns, double meanings, sound patterns.");
  } else if (dials.wordplay < 40) {
    lines.push("- Situational humor over wordplay. Comedy of circumstances.");
  }

  return lines.length > 0 ? lines.join("\n") : "- Balanced style across all dimensions.";
}
