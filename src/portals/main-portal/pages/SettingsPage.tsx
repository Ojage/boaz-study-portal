import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../hooks/useAuth";

export function SettingsPage() {
  const { t } = useTranslation("translation");
  const { user } = useAuth();

  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-lg font-bold text-[color:var(--primary)]">{t("student.settings.title")}</h2>
      <p className="mt-1 text-sm text-muted">{t("student.settings.subtitle")}</p>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
          <div className="text-sm font-semibold text-text">{t("student.settings.profile")}</div>
          <div className="mt-2 text-xs text-muted">{user?.fullName}</div>
          <div className="text-xs text-muted">{user?.email}</div>
        </div>

        <div className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
          <div className="text-sm font-semibold text-text">{t("student.settings.session")}</div>
          <div className="mt-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                location.reload();
              }}
            >
              {t("common.clearSession")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

