import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../hooks/useAuth";
import type { FinancingRequest } from "../../../contracts/boaz-contracts";
import { mockListMyFinancingRequests } from "../../../services/mock";
import { PATHS } from "../../../router/paths";

export function SubscriptionsFinancingPage() {
  const { t } = useTranslation("translation");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<FinancingRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    void mockListMyFinancingRequests({ userId: user.id })
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  }, [user]);

  const rows = useMemo(() => items, [items]);

  return (
    <Card className="p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[color:var(--primary)]">
            {t("student.subscriptions.financing.title")}
          </h2>
          <p className="mt-1 text-sm text-muted">{t("student.subscriptions.financing.subtitle")}</p>
        </div>
        <Button type="button" onClick={() => navigate(PATHS.app.financingNew)}>
          {t("student.subscriptions.financing.new")}
        </Button>
      </div>

      <div className="mt-5 grid gap-3">
        {loading ? (
          <div className="text-sm text-muted">{t("common.loading")}</div>
        ) : rows.length ? (
          rows.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-text">
                    {t("student.subscriptions.financing.item", { id: r.id })}
                  </div>
                  <div className="text-xs text-muted">
                    {t("student.subscriptions.financing.status", { status: r.status })}
                    {r.reviewNote ? ` • ${r.reviewNote}` : ""}
                  </div>
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {r.school.university}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted">{t("student.subscriptions.financing.empty")}</div>
        )}
      </div>
    </Card>
  );
}

