"use client";

import { useState } from "react";

interface ConceptTooltipProps {
    term: string;
    definition: string;
    example?: string;
    children: React.ReactNode;
    onLearnMore?: () => void;
}

export function ConceptTooltip({
    term,
    definition,
    example,
    children,
    onLearnMore,
}: ConceptTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <span className="relative inline-block">
            <span
                className="text-accent border-b border-dashed border-accent cursor-help"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </span>
            {isVisible && (
                <div className="absolute z-30 left-0 bottom-full mb-2 w-64 p-3 rounded-lg bg-bg-elevated border border-border shadow-xl">
                    <div className="text-sm font-medium text-accent mb-1">{term}</div>
                    <p className="text-xs text-fg-secondary mb-2">{definition}</p>
                    {example && (
                        <p className="text-xs text-fg-muted italic mb-2">"{example}"</p>
                    )}
                    {onLearnMore && (
                        <button
                            onClick={onLearnMore}
                            className="text-xs text-accent hover:underline"
                        >
                            Learn more →
                        </button>
                    )}
                    {/* Arrow pointing down */}
                    <div className="absolute left-4 bottom-0 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border" />
                </div>
            )}
        </span>
    );
}

// Pre-defined concepts for consistent usage
export const CONCEPTS = {
    binding: {
        term: "Binding",
        definition: "The automatic interpretation that forms when we hear or read something. Language carries default meanings.",
        example: "'You're on mute' → default meaning: helpful technical notification",
    },
    detachment: {
        term: "Detachment",
        definition: "The moment when the expected meaning is broken or replaced with something unexpected.",
        example: "The twist word or phrase that breaks the default interpretation",
    },
    operation: {
        term: "Operation",
        definition: "The technique used to break the default binding. There are 8 main types: emptying, loading, exposure, etc.",
        example: "Exposure: making visible what everyone knows but doesn't say",
    },
    repair: {
        term: "Repair",
        definition: "Finding a coherent alternative interpretation that makes sense. The audience 'snaps' to the new meaning.",
        example: "The 'aha!' moment when the joke lands",
    },
    benignness: {
        term: "Benignness",
        definition: "The safety that makes a violation enjoyable rather than upsetting. Distance strategies like self-inclusion or fiction.",
        example: "Self-deprecation makes criticism safe because you include yourself",
    },
    voice: {
        term: "Comedic Voice",
        definition: "The persona or style that shapes how jokes are delivered. Each voice has preferred operations and tones.",
        example: "Deadpan: flat delivery, understated. Observational: 'we all do this' energy.",
    },
    audience: {
        term: "Audience",
        definition: "Who the joke is for. Affects taboo tolerance, shared knowledge, and what needs explaining.",
        example: "Family-friendly avoids adult themes. Edgy pushes boundaries.",
    },
} as const;
