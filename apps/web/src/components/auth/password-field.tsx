"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function PasswordField({
  label,
  error,
  hint,
  showStrength,
  value = "",
  className,
  ...props
}: {
  label?: string;
  error?: string;
  hint?: string;
  showStrength?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? getPasswordStrength(String(value)) : null;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="relative">
        <input
          {...props}
          type={visible ? "text" : "password"}
          value={value}
          className={cn(
            "pr-11",
            error && "border-danger focus:border-danger"
          )}
          aria-invalid={error ? true : undefined}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors p-0.5"
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {showStrength && String(value).length > 0 && strength && (
        <div className="space-y-1.5 pt-0.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  level <= strength.score
                    ? strength.score <= 1
                      ? "bg-danger"
                      : strength.score <= 2
                        ? "bg-warning"
                        : "bg-accent"
                    : "bg-border"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted">{strength.label}</p>
        </div>
      )}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

function getPasswordStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const normalized = Math.min(4, Math.max(1, Math.ceil(score * 0.8)));

  const labels: Record<number, string> = {
    1: "Weak — add numbers and mixed case",
    2: "Fair — try a longer password",
    3: "Good — almost there",
    4: "Strong password",
  };

  return { score: normalized, label: labels[normalized] };
}
