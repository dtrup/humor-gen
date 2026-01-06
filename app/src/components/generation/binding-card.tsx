"use client";

import type { Binding } from "@/lib/types";

interface BindingCardProps {
  binding: Binding;
  isSelected: boolean;
  onToggle: () => void;
}

export function BindingCard({ binding, isSelected, onToggle }: BindingCardProps) {
  return (
    <div
      onClick={onToggle}
      className={`
        p-4 rounded-lg cursor-pointer transition-all duration-150
        ${isSelected
          ? "bg-accent-faint border-2 border-accent"
          : "bg-bg-base/30 border border-border hover:border-border-accent"
        }
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
    >
      {/* Carrier */}
      <div className="font-mono text-sm text-accent mb-2">
        {binding.carrier}
      </div>

      {/* Default meaning */}
      <div className="text-sm text-fg-secondary mb-3">
        → {binding.defaultMeaning}
      </div>

      {/* Strength bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-16 h-1 bg-bg-overlay rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${binding.confidence * 100}%` }}
          />
        </div>
        <span className="text-xs text-fg-muted font-data">
          {Math.round(binding.confidence * 100)}% strength
        </span>
      </div>

      {/* Alternatives */}
      <div className="text-xs text-fg-muted">
        <span className="text-fg-secondary">Alternatives:</span>
        {binding.alternativeMeanings.map((alt, i) => (
          <div key={i} className="ml-2 mt-0.5">• {alt}</div>
        ))}
      </div>
    </div>
  );
}

interface BindingGridProps {
  bindings: Binding[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function BindingGrid({ bindings, selectedIds, onToggle }: BindingGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {bindings.map((binding) => (
        <BindingCard
          key={binding.id}
          binding={binding}
          isSelected={selectedIds.includes(binding.id)}
          onToggle={() => onToggle(binding.id)}
        />
      ))}
    </div>
  );
}
