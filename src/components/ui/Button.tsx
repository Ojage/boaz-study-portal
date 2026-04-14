import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "activity";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[12px] px-3 h-8 min-w-[110px] " +
    "text-[13px] font-semibold leading-none select-none whitespace-nowrap " +
    "transition duration-150 " +
    "enabled:hover:-translate-y-px enabled:active:translate-y-0 " +
    "disabled:opacity-[0.55] disabled:cursor-not-allowed " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[color:var(--primary)] text-white shadow-soft hover:bg-[color:var(--primary-hover)] active:bg-[color:var(--primary-active)]",
    secondary:
      "bg-[color:var(--secondary)] text-white shadow-soft hover:bg-[color:var(--secondary-hover)] active:bg-[color:var(--secondary-active)]",
    outline:
      "bg-transparent text-text border border-border shadow-none hover:bg-tertiary/20 active:bg-tertiary/30",
    ghost:
      "bg-transparent text-text border border-transparent shadow-none hover:bg-tertiary/20 active:bg-tertiary/30",
    activity:
      "h-auto min-h-[34.753px] min-w-[165.077px] rounded-[30px] px-5 py-2 " +
      "bg-[#FFA600] text-white border border-[#FB8133] " +
      "shadow-[-15px_15px_20px_0px_#0000001A] " +
      "hover:bg-[#ff9a00] active:bg-[#f08f00]",
  };

  return (
    <button
      {...props}
      className={clsx(
        base,
        variants[variant],
        className,
      )}
    />
  );
}
