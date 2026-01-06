import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { HUMOR_SYSTEM_PROMPT } from "@/lib/constants";
import { createAnalyzeJokePrompt } from "@/lib/prompts/analyze-joke";
import type { AnalyzeJokeRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeJokeRequest = await request.json();
    const { jokeText, intendedMechanism } = body;

    if (!jokeText) {
      return NextResponse.json(
        { error: "Joke text is required" },
        { status: 400 }
      );
    }

    // Create prompt
    const prompt = createAnalyzeJokePrompt(jokeText, intendedMechanism);

    // Call Gemini
    const textContent = await generateContent(HUMOR_SYSTEM_PROMPT, prompt);

    // Parse JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyze joke error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze joke" },
      { status: 500 }
    );
  }
}
