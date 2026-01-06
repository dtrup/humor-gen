import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { HUMOR_SYSTEM_PROMPT } from "@/lib/constants";
import { createMutateJokePrompt, MutationType } from "@/lib/prompts/mutate-joke";
import type { ComedyVoice, JokeFormat, OperationType } from "@/lib/types";

interface MutateJokeRequest {
    jokeText: string;
    mutationType: MutationType;
    currentMechanism: {
        operation: OperationType;
        twistWord: string;
        setup: string;
        alternative: string;
    };
    voice: ComedyVoice;
    format?: JokeFormat;
}

export async function POST(request: NextRequest) {
    try {
        const body: MutateJokeRequest = await request.json();
        const { jokeText, mutationType, currentMechanism, voice, format } = body;

        if (!jokeText || !mutationType || !currentMechanism) {
            return NextResponse.json(
                { error: "Missing required fields: jokeText, mutationType, currentMechanism" },
                { status: 400 }
            );
        }

        // Create prompt
        const prompt = createMutateJokePrompt(
            jokeText,
            mutationType,
            currentMechanism,
            voice,
            format
        );

        // Call Gemini
        const textContent = await generateContent(HUMOR_SYSTEM_PROMPT, prompt);

        // Parse JSON from response
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Could not parse JSON from response");
        }

        const result = JSON.parse(jsonMatch[0]);

        return NextResponse.json({
            ...result,
            mutationType,
            originalJoke: jokeText,
        });
    } catch (error) {
        console.error("Mutate joke error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to mutate joke" },
            { status: 500 }
        );
    }
}
