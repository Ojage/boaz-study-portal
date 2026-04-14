import type { ReactNode } from "react";
import { usePermissions } from "../hooks/usePermissions";

export type PermissionMode = "all" | "any";

export interface ProtectedComponentProps {
  permissions: string[] | string;
  mode?: PermissionMode;
  fallback?: ReactNode;
  children: ReactNode;
}

export function ProtectedComponent({
  permissions,
  mode = "all",
  fallback = null,
  children,
}: ProtectedComponentProps) {
  const { hasAll, hasAny } = usePermissions();
  const list = Array.isArray(permissions) ? permissions : [permissions];
  const allowed = mode === "all" ? hasAll(list) : hasAny(list);

  return <>{allowed ? children : fallback}</>;
}
