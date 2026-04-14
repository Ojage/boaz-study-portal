import { useId, useState } from "react";
import clsx from "clsx";
import { Icon } from "./Icon";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string | null;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

export function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
  error,
  hint,
  disabled,
  className,
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = `${name}-${generatedId}`;
  const [revealed, setRevealed] = useState(false);

  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={clsx("grid gap-2", className)}>
      <label htmlFor={inputId} className="text-label font-normal text-muted">
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          name={name}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          type={revealed ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            "h-10 w-full rounded-xl border border-[color:var(--card-border)] bg-[color:var(--card)] px-3 pr-11",
            "text-body text-text placeholder:text-muted/70",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/40",
            disabled && "opacity-60",
          )}
        />

        <button
          type="button"
          className="absolute right-1 top-1 inline-flex h-8 w-9 items-center justify-center rounded-lg text-muted hover:bg-tertiary/20 hover:text-text"
          aria-label={revealed ? "Hide password" : "Show password"}
          onClick={() => setRevealed((v) => !v)}
          disabled={disabled}
        >
          <Icon icon={revealed ? EyeSlashIcon : EyeIcon} className="h-5 w-5" />
        </button>
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-label font-normal text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-label font-normal text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

