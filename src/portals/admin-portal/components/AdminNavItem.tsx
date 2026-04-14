import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

export function AdminNavItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
          isActive
            ? "bg-[color:var(--nav-active-bg)] text-[color:var(--nav-active-fg)]"
            : "text-muted hover:bg-tertiary/20 hover:text-text",
        )
      }
    >
      <span className="text-current">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
}
