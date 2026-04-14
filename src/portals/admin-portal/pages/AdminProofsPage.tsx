import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { TextField } from "../../../components/ui/TextField";
import type { UploadedDocumentMeta, WalletTopUpRequest } from "../../../contracts/boaz-contracts";
import { mockListPaymentProofs, mockListWalletTopUps, mockReviewWalletTopUp } from "../../../services/mock";

export function AdminProofsPage() {
  const { t } = useTranslation("translation");
  const [topUps, setTopUps] = useState<WalletTopUpRequest[]>([]);
  const [proofs, setProofs] = useState<UploadedDocumentMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [noteById, setNoteById] = useState<Record<string, string>>({});

  const refresh = () => {
    setLoading(true);
    Promise.all([mockListWalletTopUps(), mockListPaymentProofs({})])
      .then(([a, b]) => {
        setTopUps(a.data);
        setProofs(b.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const pending = useMemo(() => topUps.filter((x) => x.status === "PENDING"), [topUps]);

  async function reviewTopUp(topUpId: string, status: "APPROVED" | "REJECTED") {
    setLoading(true);
    try {
      await mockReviewWalletTopUp({ topUpId, status, note: noteById[topUpId] || undefined });
      refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[color:var(--primary)]">{t("admin.titles.proofs")}</h2>
          <p className="mt-1 text-sm text-muted">{t("admin.proofs.subtitle", { defaultValue: "Validate wallet top-ups and review uploaded proofs." })}</p>
        </div>
        <Button type="button" variant="outline" onClick={refresh} disabled={loading}>
          {t("common.refresh")}
        </Button>
      </div>

      <div className="mt-6">
        <div className="text-sm font-bold text-text">{t("admin.proofs.pendingTopups", { defaultValue: "Pending wallet top-ups" })}</div>
        <div className="mt-3 grid gap-3">
          {loading ? (
            <div className="text-sm text-muted">{t("common.loading")}</div>
          ) : pending.length ? (
            pending.map((x) => (
              <div key={x.id} className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-text">
                      #{x.id} • {x.amountXaf.toLocaleString()} XAF
                    </div>
                    <div className="text-xs text-muted">
                      {x.createdByUserId} • {x.receipt?.name ?? t("admin.proofs.noReceipt", { defaultValue: "No receipt" })}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <TextField
                      label={t("admin.subscriptions.note", { defaultValue: "Note" })}
                      value={noteById[x.id] ?? ""}
                      onChange={(e) => setNoteById((m) => ({ ...m, [x.id]: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button type="button" onClick={() => void reviewTopUp(x.id, "APPROVED")} disabled={loading}>
                        {t("admin.subscriptions.approve", { defaultValue: "Approve" })}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => void reviewTopUp(x.id, "REJECTED")} disabled={loading}>
                        {t("admin.subscriptions.reject", { defaultValue: "Reject" })}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted">{t("admin.proofs.nonePending", { defaultValue: "No top-ups pending." })}</div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="text-sm font-bold text-text">{t("admin.proofs.allProofs", { defaultValue: "All uploaded payment proofs" })}</div>
        <div className="mt-3 grid gap-2">
          {loading ? (
            <div className="text-sm text-muted">{t("common.loading")}</div>
          ) : proofs.length ? (
            proofs.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--card-border)] bg-bg px-3 py-2">
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold text-text">{p.name}</div>
                  <div className="truncate text-[11px] text-muted">{p.id}</div>
                </div>
                <div className="text-xs text-muted">{(p.sizeBytes / 1024).toFixed(0)} KB</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted">{t("admin.proofs.none", { defaultValue: "No payment proofs yet." })}</div>
          )}
        </div>
      </div>
    </Card>
  );
}

