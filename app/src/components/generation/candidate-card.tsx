"use client";

import { useState } from "react";
import { Tag, ScoreBarGroup, Button } from "@/components/ui";
import { MechanismView } from "./mechanism-view";
import type { JokeScores, OperationType, ViolationType } from "@/lib/types";

type MutationType =
  | "sharpen_twist"
  | "increase_misdirection"
  | "trim_setup"
  | "swap_operation"
  | "change_format"
  | "amplify_violation";

const MUTATION_OPTIONS: { value: MutationType; label: string; description: string }[] = [
  { value: "sharpen_twist", label: "✂️ Sharpen Twist", description: "Find a punchier twist word" },
  { value: "trim_setup", label: "🔪 Trim Setup", description: "Cut ruthlessly for economy" },
  { value: "increase_misdirection", label: "🎭 More Misdirection", description: "Strengthen the default binding" },
  { value: "swap_operation", label: "🔄 Swap Operation", description: "Try a different humor operation" },
  { value: "amplify_violation", label: "💥 Amplify", description: "Push the violation harder" },
  { value: "change_format", label: "📝 Change Format", description: "Reshape the delivery" },
];

interface CandidateMechanism {
  default: string;
  twist: string;
  repairPath: string;
  twistWord: string;
  benignness: string;
}

interface MutationResult {
  mutatedJoke: string;
  changes: string[];
  explanation: string;
  scores: JokeScores;
}

interface CandidateCardProps {
  id: string;
  text: string;
  operation: OperationType;
  violationType: ViolationType;
  scores: JokeScores;
  mechanism: CandidateMechanism;
  onRate?: (rating: "up" | "down") => void;
  onMutate?: (mutationType: MutationType) => Promise<MutationResult | null>;
  onSave?: () => void;
  currentRating?: "up" | "down";
}

export function CandidateCard({
  text,
  operation,
  violationType,
  scores,
  mechanism,
  onRate,
  onMutate,
  onSave,
  currentRating,
}: CandidateCardProps) {
  const [showMechanism, setShowMechanism] = useState(false);
  const [showMutations, setShowMutations] = useState(false);
  const [selectedMutation, setSelectedMutation] = useState<MutationType>("sharpen_twist");
  const [isMutating, setIsMutating] = useState(false);
  const [mutationResult, setMutationResult] = useState<MutationResult | null>(null);

  // Format operation name for display
  const formatOperation = (op: string) => {
    return op.replace(/([A-Z])/g, " $1").trim();
  };

  // Handle mutation
  const handleMutate = async () => {
    if (!onMutate) return;

    setIsMutating(true);
    try {
      const result = await onMutate(selectedMutation);
      if (result) {
        setMutationResult(result);
      }
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="p-5 rounded-lg bg-bg-base/40 border border-border">
      {/* Joke text */}
      <p className="text-base leading-relaxed text-fg-primary mb-4">
        "{text}"
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Tag variant="default">{formatOperation(operation)}</Tag>
        <Tag variant="info">{violationType}</Tag>
      </div>

      {/* Scores */}
      <ScoreBarGroup
        scores={{
          snap: scores.bindingStrength * 100,
          original: scores.originality * 100,
          economy: scores.economy * 100,
        }}
        colorByValue
        className="mb-4"
      />

      {/* Mechanism toggle */}
      <button
        onClick={() => setShowMechanism(!showMechanism)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-transparent text-fg-secondary text-sm hover:text-fg-primary hover:border-border-accent transition-colors duration-150 mb-4"
      >
        <span
          className="text-xs transition-transform duration-150"
          style={{ transform: showMechanism ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          ▸
        </span>
        Mechanism
      </button>

      {showMechanism && (
        <div className="mb-4">
          <MechanismView mechanism={mechanism} />
        </div>
      )}

      {/* Mutation Result */}
      {mutationResult && (
        <div className="mb-4 p-4 rounded-lg bg-accent-faint/30 border border-accent/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-accent text-sm font-medium">✨ Mutated Version</span>
          </div>
          <p className="text-base text-fg-primary mb-3">"{mutationResult.mutatedJoke}"</p>
          <div className="text-xs text-fg-muted space-y-1">
            <p className="text-fg-secondary">{mutationResult.explanation}</p>
            {mutationResult.changes.map((change, i) => (
              <p key={i}>• {change}</p>
            ))}
          </div>
        </div>
      )}

      {/* Mutations Panel */}
      {showMutations && (
        <div className="mb-4 p-4 rounded-lg bg-bg-overlay border border-border">
          <p className="text-sm text-fg-secondary mb-3">Select a mutation to improve this joke:</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {MUTATION_OPTIONS.map((mutation) => (
              <button
                key={mutation.value}
                onClick={() => setSelectedMutation(mutation.value)}
                className={`
                  text-left px-3 py-2 rounded text-xs transition-all
                  ${selectedMutation === mutation.value
                    ? "bg-accent-faint border border-accent text-accent"
                    : "bg-bg-base/30 border border-border text-fg-muted hover:border-border-accent"
                  }
                `}
                title={mutation.description}
              >
                <span className="font-medium">{mutation.label}</span>
                <span className="block text-fg-muted mt-0.5">{mutation.description}</span>
              </button>
            ))}
          </div>
          <Button
            size="sm"
            onClick={handleMutate}
            disabled={isMutating}
            className="w-full"
          >
            {isMutating ? "Mutating..." : "Apply Mutation →"}
          </Button>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRate?.("up")}
          className={`${currentRating === "up" ? "bg-success text-white" : "bg-success-muted text-success hover:bg-success/20"}`}
        >
          👍
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRate?.("down")}
          className={`${currentRating === "down" ? "bg-error text-white" : "bg-error-muted text-error hover:bg-error/20"}`}
        >
          👎
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowMutations(!showMutations)}
          className={showMutations ? "border-accent text-accent" : ""}
        >
          🧬 Mutate
        </Button>
        <Button variant="secondary" size="sm" onClick={onSave}>
          💾 Save
        </Button>
      </div>
    </div>
  );
}

