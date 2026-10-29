"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AuthFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  autoComplete?: string;
  error?: string;
  disabled?: boolean;
  hint?: string;
  showPasswordToggle?: boolean;
}

export function AuthField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  disabled,
  hint,
  showPasswordToggle = true,
}: AuthFieldProps) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const canRevealPassword = isPassword && showPasswordToggle;
  const inputType = canRevealPassword && showPassword ? "text" : type;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[11px] font-medium text-ink"
        >
          {label}
        </label>
        {hint ? (
          <span className="text-[10px] text-muted">{hint}</span>
        ) : null}
      </div>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-10 w-full rounded-lg border bg-white pl-3.5 text-[12.5px] text-ink outline-none transition placeholder:text-muted/55 focus:border-forest/40 disabled:opacity-60 ${
            canRevealPassword ? "pr-10" : "pr-3.5"
          } ${
            error
              ? "border-danger/50 focus:border-danger"
              : "border-line"
          }`}
        />
        {canRevealPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
            className="absolute right-2.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted transition hover:bg-paper-deep hover:text-forest"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[11px] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
