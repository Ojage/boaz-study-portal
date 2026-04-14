import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  hint?: string;
  error?: string | null;
}

export function TextField({ id, label, hint, error, className, ...props }: TextFieldProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={clsx("grid gap-2", className)}>
      <label htmlFor={inputId} className="text-label font-normal text-muted">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={clsx(
          "h-10 w-full rounded-xl border border-[color:var(--card-border)] bg-[color:var(--card)] px-3",
          "text-body text-text placeholder:text-muted/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/40",
        )}
        {...props}
      />
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
