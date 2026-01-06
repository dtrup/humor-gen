"use client";

import { useState } from "react";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  tooltip?: string;
  showValue?: boolean;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  label,
  tooltip,
  showValue = true,
  leftLabel,
  rightLabel,
  className = "",
}: SliderProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Top row: label and value */}
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span
              className="text-sm text-fg-secondary capitalize cursor-help"
              title={tooltip}
            >
              {label.replace(/([A-Z])/g, " $1").trim()}
              {tooltip && <span className="ml-1 text-fg-muted text-xs">ⓘ</span>}
            </span>
          )}
          {showValue && (
            <span className="text-sm text-fg-muted font-data">{value}%</span>
          )}
        </div>
      )}

      {/* Left/Right labels row */}
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between items-center mb-1.5 text-xs text-fg-muted">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}

      {/* Slider track */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-1 appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--accent) ${percentage}%, var(--bg-overlay) ${percentage}%)`,
          }}
        />
      </div>

      {/* Custom tooltip (appears below) */}
      {tooltip && showTooltip && (
        <div className="absolute left-0 right-0 top-full mt-1 z-20">
          <div className="bg-bg-elevated border border-border rounded px-2 py-1.5 text-xs text-fg-secondary shadow-lg">
            {tooltip}
          </div>
        </div>
      )}
    </div>
  );
}

interface SliderGroupProps<T extends Record<string, number>> {
  values: T;
  onChange: (key: keyof T & string, value: number) => void;
  tooltips?: Record<string, string>;
  className?: string;
}

export function SliderGroup<T extends Record<string, number>>({
  values,
  onChange,
  tooltips,
  className = ""
}: SliderGroupProps<T>) {
  return (
    <div className={`space-y-5 ${className}`}>
      {(Object.entries(values) as [keyof T & string, number][]).map(([key, value]) => (
        <Slider
          key={key}
          label={key}
          value={value}
          onChange={(v) => onChange(key, v)}
          tooltip={tooltips?.[key]}
        />
      ))}
    </div>
  );
}
