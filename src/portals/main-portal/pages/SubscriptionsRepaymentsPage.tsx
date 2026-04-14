import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import { useAuth } from "../../../hooks/useAuth";
import type { RepaymentSchedule } from "../../../contracts/boaz-contracts";
import { mockGetRepaymentSchedules } from "../../../services/mock";

export function SubscriptionsRepaymentsPage() {
  const { t } = useTranslation("translation");
  const { user } = useAuth();
  const [items, setItems] = useState<RepaymentSchedule[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    void mockGetRepaymentSchedules({ userId: user.id })
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  }, [user]);

  const schedules = useMemo(() => items, [items]);

  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-lg font-bold text-[color:var(--primary)]">
        {t("student.subscriptions.repayments.title")}
      </h2>
      <p className="mt-1 text-sm text-muted">{t("student.subscriptions.repayments.subtitle")}</p>

      <div className="mt-5 grid gap-4">
        {loading ? (
          <div className="text-sm text-muted">{t("common.loading")}</div>
        ) : schedules.length ? (
          schedules.map((s) => (
            <div key={s.id} className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
              <div className="text-sm font-semibold text-text">
                {t("student.subscriptions.repayments.schedule", { id: s.id })}
              </div>
              <div className="mt-3 grid gap-2">
                {s.installments.map((i) => (
                  <div key={i.id} className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--card-border)] bg-card/40 px-3 py-2">
                    <div className="text-xs text-muted">{new Date(i.dueDate).toLocaleDateString()}</div>
                    <div className="text-xs font-semibold text-text">{i.amountXaf.toLocaleString()} XAF</div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-muted">{i.status}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted">{t("student.subscriptions.repayments.empty")}</div>
        )}
      </div>
    </Card>
  );
}

