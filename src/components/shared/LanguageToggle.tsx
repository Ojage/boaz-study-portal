import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks/useLanguage";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { LanguageIcon } from "@heroicons/react/24/outline";

export function LanguageToggle() {
  const { t } = useTranslation("translation");
  const { language, setLanguage } = useLanguage();

  const next = language === "en" ? "fr" : "en";
  const label = language === "en" ? "EN" : "FR";

  return (
    <Button
      variant="outline"
      title={t("language.switchTitle")}
      onClick={() => void setLanguage(next)}
    >
      <Icon icon={LanguageIcon} />
      {label}
    </Button>
  );
}
