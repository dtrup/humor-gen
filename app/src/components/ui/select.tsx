"use client";

import { ReactNode } from "react";

interface SelectOption {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface SelectCardProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function SelectCard({
  options,
  value,
  onChange,
  columns = 2,
  className = "",
}: SelectCardProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`
              p-3 rounded-lg text-left transition-all duration-150
              ${isSelected
                ? "bg-accent-faint border-2 border-accent"
                : "bg-bg-base/30 border border-border hover:border-border-accent hover:bg-bg-elevated"
              }
            `}
          >
            {option.icon && (
              <div className="text-lg mb-1">{option.icon}</div>
            )}
            <div className={`text-sm font-medium ${isSelected ? "text-accent" : "text-fg-primary"}`}>
              {option.name}
            </div>
            {option.description && (
              <div className="text-xs text-fg-muted mt-0.5">
                {option.description}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface SelectButtonGroupProps {
  options: Array<{ id: string; name: string }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SelectButtonGroup({
  options,
  value,
  onChange,
  className = "",
}: SelectButtonGroupProps) {
  return (
    <div className={`flex gap-1.5 ${className}`}>
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`
              flex-1 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150
              ${isSelected
                ? "bg-accent-faint border-2 border-accent text-accent"
                : "bg-transparent border border-border text-fg-muted hover:border-border-accent hover:text-fg-primary"
              }
            `}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );
}

interface TabsProps {
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex gap-1 bg-bg-base/30 p-1 rounded-lg w-fit ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              px-6 py-2.5 rounded-md text-sm font-medium capitalize transition-all duration-150
              ${isActive
                ? "bg-accent-muted text-accent"
                : "text-fg-muted hover:text-fg-primary"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
