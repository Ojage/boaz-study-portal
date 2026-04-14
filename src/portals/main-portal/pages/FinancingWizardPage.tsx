import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { TextField } from "../../../components/ui/TextField";
import { useAuth } from "../../../hooks/useAuth";
import type {
  FinancingGuarantorStep,
  FinancingProfileStep,
  FinancingSchoolStep,
  UploadedDocumentMeta,
} from "../../../contracts/boaz-contracts";
import { mockCreateFinancingRequest } from "../../../services/mock";
import { PATHS } from "../../../router/paths";

type LocalDoc = {
  file: File;
  meta: UploadedDocumentMeta;
  url: string;
};

function fileToMeta(file: File): UploadedDocumentMeta {
  return {
    id: `doc-${crypto.randomUUID()}`,
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    createdAt: new Date().toISOString(),
  };
}

function Stepper({ step }: { step: number }) {
  const steps = ["1", "2", "3", "4"];
  return (
    <div className="grid gap-2 md:grid-cols-4">
      {steps.map((s, idx) => {
        const active = idx + 1 === step;
        return (
          <div
            key={s}
            className={[
              "rounded-2xl border px-3 py-3 text-center text-sm font-semibold",
              active
                ? "border-[color:var(--primary)] bg-[color:var(--primary)]/10 text-text"
                : "border-[color:var(--card-border)] bg-bg text-muted",
            ].join(" ")}
          >
            Étape {s}
          </div>
        );
      })}
    </div>
  );
}

export function FinancingWizardPage() {
  const { t } = useTranslation("translation");
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<FinancingProfileStep>({
    firstName: "",
    lastName: "",
    identityNumber: "",
    country: "",
  });
  const [school, setSchool] = useState<FinancingSchoolStep>({
    university: "",
    program: "",
    startDate: "",
  });
  const [guarantor, setGuarantor] = useState<FinancingGuarantorStep>({
    guarantorFullName: "",
    guarantorPhone: "",
    guarantorRelationship: "",
  });

  const [docs, setDocs] = useState<LocalDoc[]>([]);
  const selected = useMemo(() => docs[0] ?? null, [docs]);

  useEffect(() => {
    return () => {
      docs.forEach((d) => URL.revokeObjectURL(d.url));
    };
  }, [docs]);

  async function submit() {
    if (!user) return;
    setLoading(true);
    try {
      await mockCreateFinancingRequest({
        userId: user.id,
        profile,
        school,
        guarantor,
        documents: docs.map((d) => d.meta),
      });
      navigate(PATHS.app.subscriptions.financing);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-lg font-bold text-[color:var(--primary)]">{t("student.financing.title")}</h2>
      <p className="mt-1 text-sm text-muted">{t("student.financing.subtitle")}</p>

      <div className="mt-5">
        <Stepper step={step} />
      </div>

      {step === 1 ? (
        <div className="mt-6 grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label={t("student.financing.step1.firstName")}
              value={profile.firstName}
              onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
            />
            <TextField
              label={t("student.financing.step1.lastName")}
              value={profile.lastName}
              onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
            />
            <TextField
              label={t("student.financing.step1.identity")}
              value={profile.identityNumber}
              onChange={(e) => setProfile((p) => ({ ...p, identityNumber: e.target.value }))}
            />
            <TextField
              label={t("student.financing.step1.country")}
              value={profile.country}
              onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" type="button" onClick={() => navigate(PATHS.app.root)}>
              {t("student.subscribe.backHome")}
            </Button>
            <Button type="button" onClick={() => setStep(2)}>
              {t("student.subscribe.next")}
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-6 grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label={t("student.financing.step2.university")}
              value={school.university}
              onChange={(e) => setSchool((s) => ({ ...s, university: e.target.value }))}
            />
            <TextField
              label={t("student.financing.step2.program")}
              value={school.program}
              onChange={(e) => setSchool((s) => ({ ...s, program: e.target.value }))}
            />
            <TextField
              label={t("student.financing.step2.startDate")}
              value={school.startDate ?? ""}
              onChange={(e) => setSchool((s) => ({ ...s, startDate: e.target.value }))}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" type="button" onClick={() => setStep(1)}>
              {t("student.subscribe.back")}
            </Button>
            <Button type="button" onClick={() => setStep(3)}>
              {t("student.subscribe.next")}
            </Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mt-6 grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label={t("student.financing.step3.guarantorName")}
              value={guarantor.guarantorFullName}
              onChange={(e) => setGuarantor((g) => ({ ...g, guarantorFullName: e.target.value }))}
            />
            <TextField
              label={t("student.financing.step3.guarantorPhone")}
              value={guarantor.guarantorPhone}
              onChange={(e) => setGuarantor((g) => ({ ...g, guarantorPhone: e.target.value }))}
            />
            <TextField
              label={t("student.financing.step3.relationship")}
              value={guarantor.guarantorRelationship}
              onChange={(e) => setGuarantor((g) => ({ ...g, guarantorRelationship: e.target.value }))}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
                <div className="text-sm font-semibold text-text">{t("student.financing.step3.docsTitle")}</div>
                <p className="mt-1 text-xs text-muted">{t("student.financing.step3.docsHint")}</p>
                <div className="mt-3">
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      const mapped: LocalDoc[] = files.map((f) => ({
                        file: f,
                        meta: fileToMeta(f),
                        url: URL.createObjectURL(f),
                      }));
                      setDocs((d) => [...mapped, ...d]);
                      e.currentTarget.value = "";
                    }}
                  />
                </div>
                <div className="mt-4 grid gap-2">
                  {docs.length ? (
                    docs.map((d) => (
                      <div key={d.meta.id} className="rounded-xl border border-[color:var(--card-border)] bg-card/40 px-3 py-2 text-xs text-muted">
                        <div className="truncate font-semibold text-text">{d.meta.name}</div>
                        <div className="truncate">{(d.meta.sizeBytes / 1024).toFixed(0)} KB</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted">{t("student.subscribe.step3.empty")}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
                <div className="text-sm font-semibold text-text">{t("student.financing.step3.previewTitle")}</div>
                <div className="mt-3">
                  {selected ? (
                    selected.file.type === "application/pdf" ? (
                      <embed
                        src={selected.url}
                        type="application/pdf"
                        className="h-[420px] w-full rounded-xl border border-[color:var(--card-border)] bg-card"
                      />
                    ) : (
                      <img
                        src={selected.url}
                        alt=""
                        className="max-h-[420px] w-full rounded-xl border border-[color:var(--card-border)] object-contain bg-card"
                      />
                    )
                  ) : (
                    <div className="text-sm text-muted">{t("student.subscribe.step3.noPreview")}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" type="button" onClick={() => setStep(2)}>
              {t("student.subscribe.back")}
            </Button>
            <Button type="button" onClick={() => setStep(4)}>
              {t("student.subscribe.next")}
            </Button>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="mt-6 grid gap-4">
          <div className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
            <div className="text-sm font-semibold text-text">{t("student.financing.step4.title")}</div>
            <p className="mt-1 text-sm text-muted">{t("student.financing.step4.hint")}</p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-[color:var(--card-border)] bg-card/40 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted">{t("student.financing.step4.profile")}</div>
                <div className="mt-2 text-sm text-text">{profile.firstName} {profile.lastName}</div>
                <div className="text-xs text-muted">{profile.identityNumber}</div>
                <div className="text-xs text-muted">{profile.country}</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--card-border)] bg-card/40 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted">{t("student.financing.step4.school")}</div>
                <div className="mt-2 text-sm text-text">{school.university}</div>
                <div className="text-xs text-muted">{school.program}</div>
                <div className="text-xs text-muted">{school.startDate}</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--card-border)] bg-card/40 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted">{t("student.financing.step4.guarantor")}</div>
                <div className="mt-2 text-sm text-text">{guarantor.guarantorFullName}</div>
                <div className="text-xs text-muted">{guarantor.guarantorPhone}</div>
                <div className="text-xs text-muted">{guarantor.guarantorRelationship}</div>
              </div>
            </div>

            <div className="mt-4 text-xs text-muted">
              {t("student.financing.step4.docsCount", { count: docs.length })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" type="button" onClick={() => setStep(3)} disabled={loading}>
              {t("student.subscribe.back")}
            </Button>
            <Button type="button" onClick={() => void submit()} disabled={loading}>
              {loading ? t("common.loading") : t("student.financing.step4.submit")}
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
