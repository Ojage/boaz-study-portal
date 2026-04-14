import { create } from "zustand";
import type { AuthUser } from "../contracts/api-contracts";
import type { MockProfile } from "../services/mock/auth.mock";
import { mockLogin, mockLoginWithCredentials, mockMe } from "../services/mock/auth.mock";

export type AuthStatus = "anonymous" | "authenticating" | "authenticated";

const STORAGE_KEY_TOKEN = "studyportal.auth.token";
const STORAGE_KEY_USER = "studyportal.auth.user";

function safeReadToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  } catch {
    return null;
  }
}

function safeReadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function safeWriteSession(token: string, user: AuthUser) {
  try {
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch {
    // ignore
  }
}

function safeClearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  } catch {
    // ignore
  }
}

export interface AuthState {
  status: AuthStatus;
  token: string | null;
  user: AuthUser | null;
  error: string | null;
  loginWithMock: (profile: MockProfile) => Promise<void>;
  loginWithCredentials: (login: string, password: string) => Promise<void>;
  hydrateFromToken: (token: string) => Promise<void>;
  logout: () => void;
  setActiveSpace: (spaceId: string) => void;
}

const initialToken = safeReadToken();
const initialUser = safeReadUser();
const initialStatus: AuthStatus = initialToken
  ? initialUser
    ? "authenticated"
    : "authenticating"
  : "anonymous";

export const useAuthStore = create<AuthState>((set, get) => ({
  status: initialStatus,
  token: initialToken,
  user: initialUser,
  error: null,

  loginWithMock: async (profile) => {
    set({ status: "authenticating", error: null });
    try {
      const res = await mockLogin(profile);
      safeWriteSession(res.data.token, res.data.user);
      set({ status: "authenticated", token: res.data.token, user: res.data.user });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      safeClearSession();
      set({ status: "anonymous", token: null, user: null, error: message });
    }
  },

  loginWithCredentials: async (login, password) => {
    set({ status: "authenticating", error: null });
    try {
      const res = await mockLoginWithCredentials({ login, password });
      safeWriteSession(res.data.token, res.data.user);
      set({ status: "authenticated", token: res.data.token, user: res.data.user });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      safeClearSession();
      set({ status: "anonymous", token: null, user: null, error: message });
    }
  },

  hydrateFromToken: async (token) => {
    set({ status: "authenticating", error: null, token });
    try {
      const res = await mockMe(token);
      if (!res.data) {
        safeClearSession();
        set({ status: "anonymous", token: null, user: null, error: "Session expired" });
        return;
      }
      safeWriteSession(token, res.data);
      set({ status: "authenticated", user: res.data, token });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Session failed";
      safeClearSession();
      set({ status: "anonymous", token: null, user: null, error: message });
    }
  },

  logout: () => {
    safeClearSession();
    set({ status: "anonymous", token: null, user: null, error: null });
  },

  setActiveSpace: (spaceId) => {
    const { user } = get();
    if (!user) return;
    if (!user.spaceIds.includes(spaceId)) return;
    const next = { ...user, activeSpaceId: spaceId };
    const { token } = get();
    if (token) safeWriteSession(token, next);
    set({ user: next });
  },
}));
