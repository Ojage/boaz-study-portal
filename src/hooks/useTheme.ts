import { useCallback, useEffect, useMemo } from "react";
import { useThemeStore } from "../store/theme.store";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const resolved = useMemo(() => (theme === "system" ? getSystemTheme() : theme), [theme]);

  const applyTheme = useCallback(
    (next: "light" | "dark") => {
      document.documentElement.dataset.theme = next;
    },
    [],
  );

  useEffect(() => {
    applyTheme(resolved);
  }, [applyTheme, resolved]);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme(getSystemTheme());
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [applyTheme, theme]);

  return { theme, resolvedTheme: resolved, setTheme };
}
