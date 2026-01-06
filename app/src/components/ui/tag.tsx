"use client";

import { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  variant?: "default" | "info" | "success" | "warning" | "error";
  size?: "sm" | "md";
  className?: string;
}

export function Tag({
  children,
  variant = "default",
  size = "sm",
  className = "",
}: TagProps) {
  const baseClasses = "inline-flex items-center rounded-full font-medium";

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  const variantClasses = {
    default: "bg-accent-muted text-accent",
    info: "bg-info-muted text-info",
    success: "bg-success-muted text-success",
    warning: "bg-warning-muted text-warning",
    error: "bg-error-muted text-error",
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

interface TagGroupProps {
  tags: Array<{
    label: string;
    variant?: TagProps["variant"];
  }>;
  className?: string;
}

export function TagGroup({ tags, className = "" }: TagGroupProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <Tag key={index} variant={tag.variant}>
          {tag.label}
        </Tag>
      ))}
    </div>
  );
}
