import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../hooks/useAuth";
import type { Subscription } from "../../../contracts/boaz-contracts";
import { mockListMySubscriptions } from "../../../services/mock";
import { PATHS } from "../../../router/paths";
import { useNavigate } from "react-router-dom";

function statusLabel(status: Subscription["status"]): string {
  switch (status) {
    case "DRAFT":
      return "Brouillon";
    case "SUBMITTED":
      return "Soumis";
    case "UNDER_REVIEW":
      return "En cours";
    case "APPROVED":
      return "Approuvé";
    case "REJECTED":
      return "Rejeté";
  }
}

export function SubscriptionsServicesPage() {
  const { t } = useTranslation("translation");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    void mockListMySubscriptions({ userId: user.id })
      .then((r) => setItems(r.data.filter((s) => s.serviceId !== "FINANCING_REQUEST")))
      .finally(() => setLoading(false));
  }, [user]);

  const rows = useMemo(() => items, [items]);

  return (
    <Card className="p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[color:var(--primary)]">
            {t("student.subscriptions.services.title")}
          </h2>
          <p className="mt-1 text-sm text-muted">{t("student.subscriptions.services.subtitle")}</p>
        </div>
        <Button type="button" onClick={() => navigate(PATHS.app.root)}>
          {t("student.subscriptions.services.new")}
        </Button>
      </div>

      <div className="mt-5 grid gap-3">
        {loading ? (
          <div className="text-sm text-muted">{t("common.loading")}</div>
        ) : rows.length ? (
          rows.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-text">
                    {t("student.subscriptions.services.item", { id: s.id })}
                  </div>
                  <div className="text-xs text-muted">
                    {t("student.subscriptions.services.status", { status: statusLabel(s.status) })}
                    {s.reviewNote ? ` • ${s.reviewNote}` : ""}
                  </div>
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {s.serviceId}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted">{t("student.subscriptions.services.empty")}</div>
        )}
      </div>
    </Card>
  );
}

