import type { AppLanguage } from "./resources";

const STORAGE_KEY = "studyportal.language";

export function normalizeLanguage(value: string): AppLanguage {
  const v = value.toLowerCase();
  if (v.startsWith("fr")) return "fr";
  return "en";
}

export function readStoredLanguage(): AppLanguage | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeLanguage(raw);
  } catch {
    return null;
  }
}

export function storeLanguage(lang: AppLanguage) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

export function detectInitialLanguage(): AppLanguage {
  const stored = readStoredLanguage();
  if (stored) return stored;
  if (typeof navigator !== "undefined") return normalizeLanguage(navigator.language);
  return "fr";
}

