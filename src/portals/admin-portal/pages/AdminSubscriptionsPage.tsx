import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { TextField } from "../../../components/ui/TextField";
import type { FinancingRequest, Subscription } from "../../../contracts/boaz-contracts";
import {
  mockListAllFinancingRequests,
  mockListAllSubscriptions,
  mockReviewFinancingRequest,
  mockReviewSubscription,
} from "../../../services/mock";
import type { ReactNode } from "react";

function RowShell({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-text">{title}</div>
          <div className="text-xs text-muted">{subtitle}</div>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </div>
  );
}

export function AdminSubscriptionsPage() {
  const { t } = useTranslation("translation");
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [fin, setFin] = useState<FinancingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [noteById, setNoteById] = useState<Record<string, string>>({});
  const [amountById, setAmountById] = useState<Record<string, string>>({});

  const refresh = () => {
    setLoading(true);
    Promise.all([mockListAllSubscriptions(), mockListAllFinancingRequests()])
      .then(([s, f]) => {
        setSubs(s.data);
        setFin(f.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const pendingSubs = useMemo(() => subs.filter((s) => s.reviewStatus === "PENDING"), [subs]);
  const pendingFin = useMemo(() => fin.filter((r) => r.status === "PENDING"), [fin]);

  async function reviewSubscription(subscriptionId: string, status: "APPROVED" | "REJECTED") {
    setLoading(true);
    try {
      await mockReviewSubscription({ subscriptionId, status, note: noteById[subscriptionId] || undefined });
      refresh();
    } finally {
      setLoading(false);
    }
  }

  async function reviewFinancing(financingRequestId: string, status: "APPROVED" | "REJECTED") {
    setLoading(true);
    try {
      const raw = amountById[financingRequestId];
      const approvedAmountXaf = raw ? Number(raw) : undefined;
      await mockReviewFinancingRequest({
        financingRequestId,
        status,
        note: noteById[financingRequestId] || undefined,
        approvedAmountXaf: status === "APPROVED" ? approvedAmountXaf : undefined,
      });
      refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[color:var(--primary)]">
            {t("admin.titles.subscriptions")}
          </h2>
          <p className="mt-1 text-sm text-muted">{t("admin.subscriptions.subtitle", { defaultValue: "Review pending dossiers and financing requests." })}</p>
        </div>
        <Button type="button" variant="outline" onClick={refresh} disabled={loading}>
          {t("common.refresh")}
        </Button>
      </div>

      <div className="mt-6">
        <div className="text-sm font-bold text-text">{t("admin.subscriptions.pendingSubs", { defaultValue: "Pending subscriptions" })}</div>
        <div className="mt-3 grid gap-3">
          {loading ? (
            <div className="text-sm text-muted">{t("common.loading")}</div>
          ) : pendingSubs.length ? (
            pendingSubs.map((s) => (
              <RowShell
                key={s.id}
                title={`#${s.id} • ${s.serviceId}`}
                subtitle={`${s.applicant.firstName} ${s.applicant.lastName} • ${s.applicant.phone || "-"}`}
                right={
                  <div className="grid gap-2">
                    <TextField
                      label={t("admin.subscriptions.note", { defaultValue: "Note" })}
                      value={noteById[s.id] ?? ""}
                      onChange={(e) => setNoteById((m) => ({ ...m, [s.id]: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button type="button" onClick={() => void reviewSubscription(s.id, "APPROVED")} disabled={loading}>
                        {t("admin.subscriptions.approve", { defaultValue: "Approve" })}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => void reviewSubscription(s.id, "REJECTED")} disabled={loading}>
                        {t("admin.subscriptions.reject", { defaultValue: "Reject" })}
                      </Button>
                    </div>
                  </div>
                }
              />
            ))
          ) : (
            <div className="text-sm text-muted">{t("admin.subscriptions.none", { defaultValue: "Nothing pending." })}</div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="text-sm font-bold text-text">{t("admin.subscriptions.pendingFin", { defaultValue: "Pending financing requests" })}</div>
        <div className="mt-3 grid gap-3">
          {loading ? (
            <div className="text-sm text-muted">{t("common.loading")}</div>
          ) : pendingFin.length ? (
            pendingFin.map((r) => (
              <RowShell
                key={r.id}
                title={`#${r.id} • ${r.school.university}`}
                subtitle={`${r.profile.firstName} ${r.profile.lastName} • ${r.guarantor.guarantorFullName}`}
                right={
                  <div className="grid gap-2">
                    <TextField
                      label={t("admin.subscriptions.approvedAmount", { defaultValue: "Approved amount (XAF)" })}
                      value={amountById[r.id] ?? ""}
                      onChange={(e) => setAmountById((m) => ({ ...m, [r.id]: e.target.value }))}
                      inputMode="numeric"
                      placeholder="600000"
                    />
                    <TextField
                      label={t("admin.subscriptions.note", { defaultValue: "Note" })}
                      value={noteById[r.id] ?? ""}
                      onChange={(e) => setNoteById((m) => ({ ...m, [r.id]: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button type="button" onClick={() => void reviewFinancing(r.id, "APPROVED")} disabled={loading}>
                        {t("admin.subscriptions.approve", { defaultValue: "Approve" })}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => void reviewFinancing(r.id, "REJECTED")} disabled={loading}>
                        {t("admin.subscriptions.reject", { defaultValue: "Reject" })}
                      </Button>
                    </div>
                  </div>
                }
              />
            ))
          ) : (
            <div className="text-sm text-muted">{t("admin.subscriptions.noneFin", { defaultValue: "No financing requests pending." })}</div>
          )}
        </div>
      </div>
    </Card>
  );
}
