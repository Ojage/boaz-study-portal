import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { AppLanguage } from "../i18n/resources";
import { storeLanguage } from "../i18n/language";

export function useLanguage() {
  const { i18n } = useTranslation();
  const language = (i18n.language ?? "en") as AppLanguage;

  const setLanguage = useCallback(
    async (lang: AppLanguage) => {
      storeLanguage(lang);
      document.documentElement.lang = lang;
      await i18n.changeLanguage(lang);
    },
    [i18n],
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return { language, setLanguage };
}

