"use client";

interface MechanismData {
  default: string;
  twist: string;
  repairPath: string;
  twistWord: string;
  benignness: string;
}

interface MechanismViewProps {
  mechanism: MechanismData;
}

export function MechanismView({ mechanism }: MechanismViewProps) {
  return (
    <div className="p-4 rounded-lg bg-bg-base/50 text-sm leading-relaxed space-y-3">
      <div>
        <span className="text-fg-muted">Default binding: </span>
        <span className="text-fg-secondary">{mechanism.default}</span>
      </div>

      <div>
        <span className="text-fg-muted">Detachment: </span>
        <span className="text-accent">{mechanism.twist}</span>
      </div>

      <div>
        <span className="text-fg-muted">Repair path: </span>
        <span className="text-fg-secondary">{mechanism.repairPath}</span>
      </div>

      <div>
        <span className="text-fg-muted">Twist word: </span>
        <span className="text-success font-mono">"{mechanism.twistWord}"</span>
      </div>

      <div>
        <span className="text-fg-muted">Benignness: </span>
        <span className="text-fg-secondary">{mechanism.benignness}</span>
      </div>
    </div>
  );
}
