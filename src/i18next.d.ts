import "i18next";
import type { DefaultResources } from "./i18n/en";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    fallbackNS: "translation";
    resources: {
      translation: DefaultResources;
    };
  }
}


