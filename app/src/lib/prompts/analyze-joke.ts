export function createAnalyzeJokePrompt(
  jokeText: string,
  intendedMechanism?: {
    defaultBinding: string;
    operation: string;
    alternative: string;
  }
): string {
  const mechanismContext = intendedMechanism
    ? `
## Intended Mechanism (if provided)
- Default binding: ${intendedMechanism.defaultBinding}
- Operation: ${intendedMechanism.operation}
- Alternative: ${intendedMechanism.alternative}
`
    : "";

  return `Analyze this joke for its humor mechanics and quality.

## Joke
"${jokeText}"
${mechanismContext}

## Your Analysis Task

1. **Identify the mechanism**: What default interpretation is set up? What operation detaches from it? What's the alternative the audience snaps to?

2. **Score the joke** on these dimensions (0.0 to 1.0):
   - **bindingStrength**: How automatic/strong is the default interpretation?
   - **violationMagnitude**: How far is the alternative from the default?
   - **repairability**: How quickly can the audience find the alternative?
   - **benignness**: Is this safe/appropriate for a general audience?
   - **economy**: Payoff per word - is there wasted setup?
   - **originality**: Is this a fresh take or well-worn territory?

3. **Identify failure modes** (if any):
   - confusion: Repair is too hard, audience stays lost
   - flatness: Violation too weak, no real surprise
   - offense: Benignness insufficient, feels mean
   - weak_snap: Default wasn't strong enough
   - telegraphed: Twist was too obvious
   - overexplained: Setup killed the snap

## Output Format

Return JSON:
{
  "mechanism": {
    "default": "the default interpretation that forms",
    "twist": "what operation/detachment happens",
    "twistWord": "the specific word that triggers it",
    "alternative": "what the audience snaps to",
    "repairPath": "how they get there",
    "benignessStrategy": "what makes it safe"
  },
  "scores": {
    "bindingStrength": 0.0-1.0,
    "violationMagnitude": 0.0-1.0,
    "repairability": 0.0-1.0,
    "benignness": 0.0-1.0,
    "economy": 0.0-1.0,
    "originality": 0.0-1.0,
    "overall": 0.0-1.0
  },
  "failureAnalysis": {
    "failureMode": "none|confusion|flatness|offense|weak_snap|telegraphed|overexplained",
    "diagnosis": "explanation of what's not working (or 'No significant issues' if solid)",
    "suggestions": ["specific suggestions for improvement"]
  },
  "strengths": ["what works well about this joke"],
  "improvements": ["specific ways to make it better"]
}`;
}
