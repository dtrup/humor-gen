"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "surface" | "elevated" | "interactive" | "active";
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  children,
  className = "",
  variant = "surface",
  padding = "md",
  onClick,
}: CardProps) {
  const baseClasses = "rounded-lg transition-all duration-150";

  const variantClasses = {
    surface: "bg-bg-surface border border-border",
    elevated: "bg-bg-elevated border border-border",
    interactive: "bg-bg-surface border border-border hover:border-border-accent hover:bg-bg-elevated cursor-pointer",
    active: "bg-accent-faint border-2 border-accent",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingMap[padding]} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}

export function CardTitle({ children, className = "", as: Tag = "h3" }: CardTitleProps) {
  return (
    <Tag className={`text-label ${className}`}>
      {children}
    </Tag>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
