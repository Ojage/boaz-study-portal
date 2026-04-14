import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultNS, resources } from "./resources";
import { detectInitialLanguage } from "./language";

const initialLanguage = detectInitialLanguage();

void i18n.use(initReactI18next).init({
  lng: initialLanguage,
  fallbackLng: "en",
  defaultNS,
  ns: [defaultNS],
  resources,
  interpolation: { escapeValue: false },
});

document.documentElement.lang = initialLanguage;

export { i18n };

