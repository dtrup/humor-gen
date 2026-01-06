import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { HUMOR_SYSTEM_PROMPT } from "@/lib/constants";
import { createGenerateJokesPrompt } from "@/lib/prompts/generate-jokes";
import { AUDIENCES } from "@/lib/constants";
import type { GenerateJokesRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateJokesRequest = await request.json();
    const {
      selectedBindings,
      operationWeights,
      styleDials,
      voice,
      audienceId,
      format = "one_liner",
    } = body;

    if (!selectedBindings || selectedBindings.length === 0) {
      return NextResponse.json(
        { error: "At least one binding is required" },
        { status: 400 }
      );
    }

    // Get audience context
    const audience = AUDIENCES.find((a) => a.id === audienceId) || AUDIENCES[1];
    const audienceContext = `${audience.name} audience (${audience.description}). Taboo tolerance: ${audience.tabooTolerance}%. Keep content appropriate for this level.`;

    // Create prompt
    const prompt = createGenerateJokesPrompt(
      selectedBindings,
      voice,
      operationWeights,
      styleDials,
      format,
      audienceContext
    );

    // Call Gemini
    const textContent = await generateContent(HUMOR_SYSTEM_PROMPT, prompt);

    // Parse JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }

    const result = JSON.parse(jsonMatch[0]);

    // Add metadata to candidates
    const candidates = result.candidates.map((c: Record<string, unknown>, idx: number) => ({
      ...c,
      id: c.id || `gen-${Date.now()}-${idx}`,
      voice,
      format,
      created: new Date().toISOString(),
    }));

    return NextResponse.json({ candidates });
  } catch (error) {
    console.error("Generate jokes error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate jokes" },
      { status: 500 }
    );
  }
}
