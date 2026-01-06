"use client";

import { ReactNode, useState } from "react";

interface ExpandableProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export function Expandable({
  trigger,
  children,
  defaultExpanded = false,
  className = "",
}: ExpandableProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={className}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-transparent text-fg-secondary text-sm hover:text-fg-primary hover:border-border-accent transition-colors duration-150"
      >
        <span className="text-xs transition-transform duration-150" style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>
          ▸
        </span>
        {trigger}
      </button>
      {isExpanded && (
        <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

interface ExpandablePanelProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export function ExpandablePanel({
  title,
  children,
  defaultExpanded = false,
  className = "",
}: ExpandablePanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-bg-base/50 rounded-lg ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-bg-elevated/50 rounded-lg transition-colors duration-150"
      >
        <span className="text-sm text-fg-secondary">{title}</span>
        <span
          className="text-fg-muted transition-transform duration-150"
          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}
