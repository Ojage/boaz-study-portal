import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import type { UploadedDocumentMeta, WalletTopUpRequest } from "../../../contracts/boaz-contracts";
import { useAuth } from "../../../hooks/useAuth";
import { mockListPaymentProofs, mockListWalletTopUps } from "../../../services/mock";

export function ProofsPage() {
  const { t } = useTranslation("translation");
  const { user } = useAuth();
  const [topUps, setTopUps] = useState<WalletTopUpRequest[]>([]);
  const [proofs, setProofs] = useState<UploadedDocumentMeta[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([mockListWalletTopUps(), mockListPaymentProofs({ userId: user.id })])
      .then(([a, b]) => {
        setTopUps(a.data.filter((x) => x.createdByUserId === user.id && Boolean(x.receipt)));
        setProofs(b.data);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const rows = useMemo(() => topUps, [topUps]);
  const uploadedProofs = useMemo(() => proofs, [proofs]);

  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-lg font-bold text-[color:var(--primary)]">{t("student.proofs.title")}</h2>
      <p className="mt-1 text-sm text-muted">{t("student.proofs.subtitle")}</p>

      <div className="mt-5 grid gap-3">
        {loading ? (
          <div className="text-sm text-muted">{t("common.loading")}</div>
        ) : (
          <>
            <div className="text-sm font-bold text-text">{t("student.proofs.topupsTitle", { defaultValue: "Wallet top-up receipts" })}</div>
            {rows.length ? (
              rows.map((x) => (
                <div key={x.id} className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-text">
                        {t("student.proofs.item", { id: x.id })}
                      </div>
                      <div className="text-xs text-muted">
                        {x.receipt?.name} • {x.amountXaf.toLocaleString()} XAF
                      </div>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-muted">{x.status}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted">{t("student.proofs.empty")}</div>
            )}

            <div className="mt-4 text-sm font-bold text-text">{t("student.proofs.paymentsTitle", { defaultValue: "Subscription payment proofs" })}</div>
            {uploadedProofs.length ? (
              uploadedProofs.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--card-border)] bg-bg px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-text">{p.name}</div>
                    <div className="truncate text-[11px] text-muted">{p.id}</div>
                  </div>
                  <div className="text-xs text-muted">{(p.sizeBytes / 1024).toFixed(0)} KB</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted">{t("student.proofs.empty")}</div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
