import { en } from "./en";
import { fr } from "./fr";

export const defaultNS = "translation" as const;

export const resources = {
  en: { [defaultNS]: en },
  fr: { [defaultNS]: fr },
} as const;

export type AppLanguage = keyof typeof resources;

