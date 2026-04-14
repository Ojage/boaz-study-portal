import Keycloak from "keycloak-js";

// ---------------------------------------------------------------------------
// Configuration — driven by Vite env vars so values can differ per environment
// without touching source code.
// ---------------------------------------------------------------------------
const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL as string;
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM as string;
const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string;

if (!KEYCLOAK_URL || !KEYCLOAK_REALM || !KEYCLOAK_CLIENT_ID) {
  console.error(
    "[KeycloakService] Missing required env vars: " +
      "VITE_KEYCLOAK_URL, VITE_KEYCLOAK_REALM, VITE_KEYCLOAK_CLIENT_ID",
  );
}

// ---------------------------------------------------------------------------
// Singleton Keycloak instance
// ---------------------------------------------------------------------------
const keycloak = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID,
});

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

/**
 * Initialises the Keycloak adapter in "check-sso" mode so the app can boot
 * without a full redirect when the user is not authenticated.
 *
 * Returns `true` when Keycloak reports an active, authenticated session.
 */
export async function initKeycloak(): Promise<boolean> {
  try {
    const authenticated = await keycloak.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
      checkLoginIframe: false,
    });

    if (authenticated) {
      // Schedule an automatic token refresh 60 s before expiry
      keycloak.onTokenExpired = () => {
        keycloak.updateToken(60).catch(() => {
          console.warn("[KeycloakService] Token refresh failed — logging out");
          keycloak.logout();
        });
      };
    }

    return authenticated;
  } catch (err) {
    console.error("[KeycloakService] Initialisation failed:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Redirects the user to the Keycloak login page. */
export function keycloakLogin(): void {
  void keycloak.login();
}

/** Clears the Keycloak session and redirects to the post-logout URI. */
export function keycloakLogout(): void {
  void keycloak.logout({ redirectUri: window.location.origin });
}

/** Returns the current raw access token, or null if not authenticated. */
export function getKeycloakToken(): string | null {
  return keycloak.token ?? null;
}

/** Returns true when the adapter considers the session authenticated. */
export function isKeycloakAuthenticated(): boolean {
  return keycloak.authenticated ?? false;
}

/**
 * Forces a token refresh and returns the refreshed token.
 * Throws if the refresh fails.
 */
export async function refreshKeycloakToken(
  minValiditySeconds = 60,
): Promise<string> {
  await keycloak.updateToken(minValiditySeconds);
  if (!keycloak.token) throw new Error("Token unavailable after refresh");
  return keycloak.token;
}

/** Exposes the raw Keycloak instance for advanced use-cases. */
export { keycloak };
