"use client";

import { Card } from "@/components/ui";
import { Button } from "@/components/ui";
import type { FailureAnalysis } from "@/lib/types";

interface LearningPanelProps {
  dimension: string;
  failureAnalysis?: FailureAnalysis;
  principle: string;
  suggestions: string[];
  onTryFix?: () => void;
  onSeeTheory?: () => void;
}

export function LearningPanel({
  dimension,
  failureAnalysis,
  principle,
  suggestions,
  onTryFix,
  onSeeTheory,
}: LearningPanelProps) {
  return (
    <div className="bg-warning-muted/30 rounded-xl p-6 border border-warning/20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">💡</span>
        <h3 className="text-base font-medium text-accent">
          Learning Moment
        </h3>
      </div>

      {/* Diagnosis */}
      {failureAnalysis && (
        <p className="text-sm text-fg-secondary leading-relaxed mb-4">
          This joke scored low on{" "}
          <strong className="text-accent">{dimension}</strong>.{" "}
          {failureAnalysis.diagnosis}
        </p>
      )}

      {/* Principle */}
      <div className="px-4 py-3 bg-bg-base/30 rounded-lg text-sm text-fg-muted mb-4">
        <strong className="text-accent">Principle:</strong> {principle}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-fg-muted mb-2">Suggestions:</p>
          <ul className="text-sm text-fg-secondary space-y-1">
            {suggestions.map((suggestion, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-fg-muted">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onTryFix}
          className="bg-accent-muted text-accent border-accent/30 hover:bg-accent/20"
        >
          Try tighter version
        </Button>
        <Button variant="secondary" size="sm" onClick={onSeeTheory}>
          See theory: {dimension}
        </Button>
      </div>
    </div>
  );
}
