import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";
import { PATHS } from "../../router/paths";

export function RequirePermission({
  permissions,
  children,
}: {
  permissions: string[];
  children: ReactNode;
}) {
  const { hasAll } = usePermissions();
  const allowed = hasAll(permissions);

  if (!allowed) return <Navigate to={PATHS.notFound} replace />;
  return <>{children}</>;
}
