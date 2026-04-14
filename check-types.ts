import { useTranslation } from "react-i18next";
import "./src/i18next.d.ts";

const { t } = useTranslation("translation");
// @ts-expect-error
type Keys = Parameters<typeof t>[0];
// Let's see what Keys is.
// We can't easily print it, but we can check if it includes a relative key.
const k1: Keys = "admin.topbar.organization"; 
const k2: Keys = "translation:admin.topbar.organization";
