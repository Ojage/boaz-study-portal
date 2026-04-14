import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/auth.store";
import {
  initKeycloak,
  getKeycloakToken,
  isKeycloakAuthenticated,
} from "../../services/keycloak.service";

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const hydrateFromToken = useAuthStore((s) => s.hydrateFromToken);
  const keycloakInitialised = useRef(false);

  // ------------------------------------------------------------------
  // 1. Initialise Keycloak once on mount.
  //    If Keycloak reports an active session, pull the token into the
  //    store so the rest of the app remains unaware of the adapter.
  // ------------------------------------------------------------------
  useEffect(() => {
    if (keycloakInitialised.current) return;
    keycloakInitialised.current = true;

    void initKeycloak().then((authenticated) => {
      if (authenticated) {
        const kcToken = getKeycloakToken();
        if (kcToken) {
          void hydrateFromToken(kcToken);
        }
      }
    });
  }, [hydrateFromToken]);

  // ------------------------------------------------------------------
  // 2. Hydrate user profile from an existing token (e.g. after a page
  //    reload where the token was persisted in localStorage).
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!token) return;
    if (user) return;
    if (status !== "authenticating") return;
    void hydrateFromToken(token);
  }, [hydrateFromToken, status, token, user]);

  return <>{children}</>;
}
