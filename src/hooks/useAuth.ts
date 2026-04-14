import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const status = useAuthStore((s) => s.status);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const error = useAuthStore((s) => s.error);
  const loginWithMock = useAuthStore((s) => s.loginWithMock);
  const loginWithCredentials = useAuthStore((s) => s.loginWithCredentials);
  const hydrateFromToken = useAuthStore((s) => s.hydrateFromToken);
  const logout = useAuthStore((s) => s.logout);
  const setActiveSpace = useAuthStore((s) => s.setActiveSpace);

  return {
    status,
    token,
    user,
    error,
    isAuthenticated: status === "authenticated",
    loginWithMock,
    loginWithCredentials,
    hydrateFromToken,
    logout,
    setActiveSpace,
  };
}
