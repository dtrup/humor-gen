import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL, MAX_TOKENS, HUMOR_SYSTEM_PROMPT } from "@/lib/anthropic";
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

    // Call Claude
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: HUMOR_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text content
    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
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
