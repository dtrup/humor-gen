"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-md
    transition-all duration-150 ease-out
    cursor-pointer
    disabled:cursor-not-allowed
  `;

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-br from-accent to-[#d4c4a8]
      text-bg-base
      hover:brightness-110
      disabled:bg-bg-overlay disabled:text-fg-muted disabled:from-bg-overlay disabled:to-bg-overlay
    `,
    secondary: `
      bg-transparent
      border border-border
      text-fg-secondary
      hover:border-border-accent hover:text-fg-primary
      disabled:opacity-50
    `,
    ghost: `
      bg-transparent
      text-fg-muted
      hover:bg-bg-elevated hover:text-fg-primary
      disabled:opacity-50
    `,
    danger: `
      bg-error-muted
      text-error
      hover:bg-error/20
      disabled:opacity-50
    `,
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
