import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../hooks/useAuth";

export function AffiliationPage() {
  const { t } = useTranslation("translation");
  const { user } = useAuth();

  const code = useMemo(() => {
    const base = user?.username?.toUpperCase().replace(/[^A-Z0-9]/g, "") ?? "STUDENT";
    return `BOAZ-${base.slice(0, 8)}`;
  }, [user?.username]);

  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-lg font-bold text-[color:var(--primary)]">{t("student.affiliation.title")}</h2>
      <p className="mt-1 text-sm text-muted">{t("student.affiliation.subtitle")}</p>

      <div className="mt-5 rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted">{t("student.affiliation.codeLabel")}</div>
        <div className="mt-2 text-2xl font-bold text-text">{code}</div>
        <div className="mt-3">
          <Button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(code);
            }}
          >
            {t("student.affiliation.copy")}
          </Button>
        </div>
      </div>
    </Card>
  );
}

