import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL, MAX_TOKENS, HUMOR_SYSTEM_PROMPT } from "@/lib/anthropic";
import { createExtractBindingsPrompt } from "@/lib/prompts/extract-bindings";
import { AUDIENCES } from "@/lib/constants";
import type { ExtractBindingsRequest, ExtractBindingsResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: ExtractBindingsRequest = await request.json();
    const { topic, voice, audienceId } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // Get audience context
    const audience = AUDIENCES.find((a) => a.id === audienceId) || AUDIENCES[1];
    const audienceContext = `${audience.name} audience (${audience.description}). Taboo tolerance: ${audience.tabooTolerance}%.`;

    // Create prompt
    const prompt = createExtractBindingsPrompt(topic, voice, audienceContext);

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

    const result: ExtractBindingsResponse = JSON.parse(jsonMatch[0]);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Extract bindings error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to extract bindings" },
      { status: 500 }
    );
  }
}
