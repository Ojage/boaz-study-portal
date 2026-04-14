import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { useTheme } from "../../hooks/useTheme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ThemeToggle() {
  const { t } = useTranslation("translation");
  const { theme, resolvedTheme, setTheme } = useTheme();

  const next = theme === "light" ? "dark" : "light";
  const mode = theme === "system" ? t("theme.system") : t(`theme.${theme}`);
  const label = t("theme.label", { mode });
  const icon = resolvedTheme === "dark" ? MoonIcon : SunIcon;

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === "system" ? "dark" : next)}
      title={t("theme.toggleTitle")}
    >
      <Icon icon={icon} />
      {label}
    </Button>
  );
}
