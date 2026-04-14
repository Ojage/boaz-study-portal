import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  children: ReactNode;
}

export function Card({ padded = true, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={clsx(
        "bg-[color:var(--card)] border border-[color:var(--card-border)] rounded-2xl shadow-card",
        padded && "p-4",
        className,
      )}
    />
  );
}
