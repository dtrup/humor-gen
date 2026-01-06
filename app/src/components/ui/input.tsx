"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = "", ...props }, ref) => {
    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="text-label block mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full
            bg-bg-base
            border border-border
            rounded-md
            px-4 py-3
            text-fg-primary
            placeholder:text-fg-faint
            focus:outline-none focus:border-accent
            transition-colors duration-150
            ${error ? "border-error" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, fullWidth = true, className = "", ...props }, ref) => {
    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="text-label block mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full
            bg-bg-base
            border border-border
            rounded-md
            px-4 py-3
            text-fg-primary
            placeholder:text-fg-faint
            focus:outline-none focus:border-accent
            transition-colors duration-150
            resize-none
            ${error ? "border-error" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-error">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
