import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const hydrateFromToken = useAuthStore((s) => s.hydrateFromToken);

  useEffect(() => {
    if (!token) return;
    if (user) return;
    if (status !== "authenticating") return;
    void hydrateFromToken(token);
  }, [hydrateFromToken, status, token, user]);

  return <>{children}</>;
}

