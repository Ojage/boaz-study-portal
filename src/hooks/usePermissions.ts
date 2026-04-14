import { useMemo } from "react";
import { parseJwtPayload } from "../utils/jwt";
import { useAuthStore } from "../store/auth.store";

function readAuthoritiesFromToken(token: string): string[] {
  const payload = parseJwtPayload(token);
  const value = payload?.authorities;
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
    return value;
  }
  return [];
}

export interface PermissionsApi {
  authorities: string[];
  has: (permission: string) => boolean;
  hasAny: (permissions: string[]) => boolean;
  hasAll: (permissions: string[]) => boolean;
}

export function usePermissions(): PermissionsApi {
  const token = useAuthStore((s) => s.token);
  const userAuthorities = useAuthStore((s) => s.user?.authorities ?? []);

  const authorities = useMemo(() => {
    if (token) return readAuthoritiesFromToken(token);
    return userAuthorities;
  }, [token, userAuthorities]);

  return useMemo(() => {
    const set = new Set(authorities);
    return {
      authorities,
      has: (permission) => set.has(permission),
      hasAny: (permissions) => permissions.some((p) => set.has(p)),
      hasAll: (permissions) => permissions.every((p) => set.has(p)),
    };
  }, [authorities]);
}
