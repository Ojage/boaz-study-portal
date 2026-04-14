import { Card } from "../../../components/ui/Card";
import { useTranslation } from "react-i18next";

export function PlaceholderPage({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation("translation");
  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-lg font-semibold text-text">{t(titleKey)}</h2>
      <p className="mt-2 text-body text-muted">Coming soon.</p>
    </Card>
  );
}
