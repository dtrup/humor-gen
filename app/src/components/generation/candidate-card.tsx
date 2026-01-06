"use client";

import { useState } from "react";
import { Tag, ScoreBarGroup, Button } from "@/components/ui";
import { MechanismView } from "./mechanism-view";
import type { JokeScores, OperationType, ViolationType } from "@/lib/types";

interface CandidateMechanism {
  default: string;
  twist: string;
  repairPath: string;
  twistWord: string;
  benignness: string;
}

interface CandidateCardProps {
  id: string;
  text: string;
  operation: OperationType;
  violationType: ViolationType;
  scores: JokeScores;
  mechanism: CandidateMechanism;
  onRate?: (rating: "up" | "down") => void;
  onEdit?: () => void;
  onVariations?: () => void;
  onSave?: () => void;
}

export function CandidateCard({
  text,
  operation,
  violationType,
  scores,
  mechanism,
  onRate,
  onEdit,
  onVariations,
  onSave,
}: CandidateCardProps) {
  const [showMechanism, setShowMechanism] = useState(false);

  // Format operation name for display
  const formatOperation = (op: string) => {
    return op.replace(/([A-Z])/g, " $1").trim();
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

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRate?.("up")}
          className="bg-success-muted text-success hover:bg-success/20"
        >
          👍
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRate?.("down")}
          className="bg-error-muted text-error hover:bg-error/20"
        >
          👎
        </Button>
        <Button variant="secondary" size="sm" onClick={onEdit}>
          ✏️ Edit
        </Button>
        <Button variant="secondary" size="sm" onClick={onVariations}>
          🔄 Variations
        </Button>
        <Button variant="secondary" size="sm" onClick={onSave}>
          💾 Save
        </Button>
      </div>
    </div>
  );
}
