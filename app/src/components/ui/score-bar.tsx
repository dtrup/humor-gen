"use client";

interface ScoreBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md";
  colorByValue?: boolean;
  className?: string;
}

export function ScoreBar({
  value,
  max = 100,
  label,
  showValue = false,
  size = "sm",
  colorByValue = false,
  className = "",
}: ScoreBarProps) {
  const percentage = Math.min(100, (value / max) * 100);

  const getColor = () => {
    if (!colorByValue) return "bg-accent";
    if (percentage >= 75) return "bg-success";
    if (percentage >= 50) return "bg-accent";
    return "bg-error";
  };

  const heightClass = size === "sm" ? "h-1" : "h-1.5";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <span className="text-xs text-fg-muted capitalize min-w-[60px]">
          {label}
        </span>
      )}
      <div className={`flex-1 ${heightClass} bg-bg-overlay rounded-full overflow-hidden`}>
        <div
          className={`h-full ${getColor()} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="text-xs text-fg-muted font-data min-w-[32px] text-right">
          {value}
        </span>
      )}
    </div>
  );
}

interface ScoreBarGroupProps {
  scores: Record<string, number>;
  excludeKeys?: string[];
  colorByValue?: boolean;
  className?: string;
}

export function ScoreBarGroup({
  scores,
  excludeKeys = ["overall"],
  colorByValue = false,
  className = "",
}: ScoreBarGroupProps) {
  const filteredScores = Object.entries(scores).filter(
    ([key]) => !excludeKeys.includes(key)
  );

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {filteredScores.map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="text-xs text-fg-muted capitalize">{key}</span>
          <div className="w-12 h-1.5 bg-bg-overlay rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                colorByValue
                  ? value >= 75
                    ? "bg-success"
                    : value >= 50
                    ? "bg-accent"
                    : "bg-error"
                  : "bg-accent"
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
