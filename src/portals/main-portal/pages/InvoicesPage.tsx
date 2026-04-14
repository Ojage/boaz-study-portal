import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import type { Invoice } from "../../../contracts/boaz-contracts";
import { useAuth } from "../../../hooks/useAuth";
import { mockListMyInvoices } from "../../../services/mock";

export function InvoicesPage() {
  const { t } = useTranslation("translation");
  const { user } = useAuth();
  const [items, setItems] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    void mockListMyInvoices({ userId: user.id })
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  }, [user]);

  const rows = useMemo(() => items, [items]);

  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-lg font-bold text-[color:var(--primary)]">{t("student.invoices.title")}</h2>
      <p className="mt-1 text-sm text-muted">{t("student.invoices.subtitle")}</p>

      <div className="mt-5 grid gap-3">
        {loading ? (
          <div className="text-sm text-muted">{t("common.loading")}</div>
        ) : rows.length ? (
          rows.map((x) => (
            <div key={x.id} className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-text">{x.id}</div>
                  <div className="text-xs text-muted">
                    {new Date(x.createdAt).toLocaleDateString()} • {t("student.invoices.subscription", { id: x.subscriptionId })}
                  </div>
                </div>
                <div className="text-xs font-semibold text-text">{x.amountXaf.toLocaleString()} XAF</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted">{t("student.invoices.empty")}</div>
        )}
      </div>
    </Card>
  );
}

