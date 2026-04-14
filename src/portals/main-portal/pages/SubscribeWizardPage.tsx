import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../hooks/useAuth";
import type { ServiceId, Subscription, SubscriptionApplicantInfo, UploadedDocumentMeta } from "../../../contracts/boaz-contracts";
import {
  mockCreateSubscriptionDraft,
  mockGetWallet,
  mockPaySubscriptionFromWallet,
  mockUpdateSubscription,
} from "../../../services/mock";
import { PATHS } from "../../../router/paths";

type LocalDoc = {
  file: File;
  meta: UploadedDocumentMeta;
  url: string;
};

function AviSummaryScreen({ onStart }: { onStart: () => void }) {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const steps = [
    { title: "Informations Personnelles", buttonText: "Revenir", hint: "Ici, veuillez remplir vos informations personnelles" },
    { title: "Détails de la Formation", buttonText: "Aller à l'étape", hint: "Indiquez les informations relatives à l'établissement ou la formation choisie." },
    { title: "Informations Financières et Autres", buttonText: "Aller à l'étape", hint: "Veuillez préciser le montant et la source de vos revenus." },
    { title: "Principe de paiement", buttonText: "Aller à l'étape", hint: "Prenez connaissance de nos conditions et de la structure tarifaire." },
    { title: "Mode de paiement", buttonText: "Aller à l'étape", hint: "Sélectionnez votre moyen de paiement principal." },
    { title: "Etablissement bancaire", buttonText: "Aller à l'étape", hint: "Choisissez l'établissement bancaire partenaire ou saisissez le vôtre." },
    { title: "Coordonnées bancaires", buttonText: "Aller à l'étape", hint: "Renseignez vos identifiants bancaires (IBAN, BIC, etc.)." },
    { title: "Proforma", buttonText: "Aller à l'étape", hint: "Générez et validez le document proforma attestant vos démarches." },
    { title: "Mon contrat", buttonText: "Aller à l'étape", hint: "Lisez et acceptez les conditions et le contrat final généré." },
    { title: "Dépot de preuve", buttonText: "Déposer la preuve", hint: "Téléchargez le reçu ou la preuve pour valider votre demande." },
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-6 md:p-12 max-w-4xl mx-auto shadow-sm mt-2">
      <h2 className="text-[22px] font-medium text-center text-black mb-8">Parcours à suivre</h2>
      
      <div className="space-y-3.5 max-w-[600px] mx-auto">
        {steps.map((step, idx) => {
          const num = (idx + 1).toString().padStart(2, "0");
          const isActive = expandedIndex === idx;
          
          return (
            <div key={idx} className="flex items-start">
              {/* Circle + Line */}
              <div className="flex items-center pt-0.5 shrink-0">
                <div className={`flex items-center justify-center w-[38px] h-[38px] rounded-full border ${isActive ? "border-[#0A3DFF] text-[#0A3DFF]" : "border-[#B0B0B0] text-[#B0B0B0]"} font-bold text-[15px] bg-white z-10 shrink-0 transition-colors`}>
                  {num}
                </div>
                <div className={`w-5 h-[2px] ${isActive ? "bg-[#0A3DFF]" : "bg-[#B0B0B0]"} shrink-0 transition-colors`} />
              </div>
              
              {/* Box */}
              <div className={`flex-1 rounded-[6px] border ${isActive ? "border-[#0A3DFF]" : "border-[#B0B0B0]"} overflow-hidden bg-white shrink-0 transition-colors`}>
                <div 
                  className="flex items-center justify-between pl-4 pr-0 h-10 cursor-pointer select-none"
                  onClick={() => setExpandedIndex(isActive ? -1 : idx)}
                >
                  <span className={`font-semibold text-[13px] ${isActive ? "text-[#0A3DFF]" : "text-[#B0B0B0]"} transition-colors`}>
                    {step.title}
                  </span>
                  
                  <div className="flex items-center h-full">
                    {isActive ? (
                      <button type="button" className="bg-[#0A3DFF] text-white text-[11px] font-semibold px-6 py-1 rounded-full mr-1.5 shadow-sm transition-colors">
                        {step.buttonText}
                      </button>
                    ) : (
                      <button type="button" className="border border-[#B0B0B0] text-[#B0B0B0] bg-white text-[11px] font-semibold px-4 py-1 rounded-full mr-1.5 transition-colors group-hover:bg-gray-50">
                        {step.buttonText}
                      </button>
                    )}
                    
                    {/* Grey Dropdown Tab on Right Edge */}
                    <div className={`w-[38px] h-full bg-[#D9D9D9] border-l ${isActive ? 'border-[#0A3DFF]' : 'border-[#B0B0B0]'} flex items-center justify-center transition-colors`}>
                      <svg className={`w-[14px] h-[14px] text-[#555555] transform transition-transform ${isActive ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isActive && step.hint && (
                  <div className="border-t border-[#0A3DFF] px-4 py-3.5 text-[#555555] text-[13px] bg-white transition-opacity">
                    {step.hint}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer Buttons */}
      <div className="mt-14 flex items-center justify-center gap-12">
        <button type="button" className="flex items-center justify-center gap-2 bg-[#8C8C8C] hover:bg-[#7A7A7A] text-white font-semibold text-[15px] px-5 py-3 rounded-md transition-colors shadow">
          Télécharger un résumé
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        
        <button 
          type="button"
          onClick={onStart}
          className="bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold text-[15px] px-14 py-3 border border-[#3367D6] rounded-full transition-colors shadow"
        >
          Commencer
        </button>
      </div>
    </div>
  );
}

function isServiceId(value: string | undefined): value is ServiceId {
  return (
    value === "IRREVOCABLE_TRANSFER" ||
    value === "HOUSING_ATTESTATION" ||
    value === "INSURANCE" ||
    value === "FINANCING_REQUEST"
  );
}

function servicePriceXaf(serviceId: ServiceId): number {
  switch (serviceId) {
    case "IRREVOCABLE_TRANSFER":
      return 150_000;
    case "HOUSING_ATTESTATION":
      return 120_000;
    case "INSURANCE":
      return 80_000;
    case "FINANCING_REQUEST":
      return 0;
  }
}

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
  const stepsDef = [
    "Informations Personnelles",
    "Détails de la Formation",
    "Informations Financières\net Autres Détails"
  ];
  return (
    <div className="w-full max-w-[560px] mx-auto mb-20 mt-6 relative">
      <div className="flex items-center justify-between relative z-10 px-8">
        <div className="absolute left-[12%] right-[12%] top-1/2 -translate-y-1/2 h-[1px] bg-[#CBD5E1] z-0"></div>
        {stepsDef.map((title, idx) => {
          const num = (idx + 1).toString().padStart(2, "0");
          const isActive = step === (idx + 1);
          const isPast = step > (idx + 1);
          
          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className={`flex items-center justify-center w-[30px] h-[30px] rounded-full text-[12px] tracking-[0.02em] font-semibold ${isActive || isPast ? "bg-[#3A73FA] text-white" : "bg-white border-[1.5px] border-[#CBD5E1] text-[#A0AEC0]"}`}>
                {num}
              </div>
              <div className={`absolute top-10 whitespace-pre-wrap text-center leading-[1.3] w-36 text-[11px] font-medium ${isActive ? "text-[#3A73FA]" : "text-[#A0AEC0]"}`}>
                {title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SubscribeWizardPage() {
  const { t } = useTranslation("translation");
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const serviceId = params.serviceId;

  const [step, setStep] = useState(() => (serviceId === "IRREVOCABLE_TRANSFER" ? 0 : 1));
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);

  const [applicant, setApplicant] = useState<SubscriptionApplicantInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    nationality: "",
    destinationCountry: "",
    university: "",
    notes: "",
  });

  const [docs, setDocs] = useState<LocalDoc[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const selectedDoc = useMemo(() => docs.find((d) => d.meta.id === selectedDocId) ?? null, [docs, selectedDocId]);

  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const price = isServiceId(serviceId) ? servicePriceXaf(serviceId) : 0;

  useEffect(() => {
    return () => {
      docs.forEach((d) => URL.revokeObjectURL(d.url));
    };
  }, [docs]);

  useEffect(() => {
    if (!user) return;
    void mockGetWallet({ userId: user.id }).then((r) => setWalletBalance(r.data.balanceXaf));
  }, [user]);

  if (!isServiceId(serviceId) || serviceId === "FINANCING_REQUEST") {
    return (
      <Card className="p-5 md:p-6">
        <h2 className="text-lg font-bold text-[color:var(--primary)]">{t("student.subscribe.invalid")}</h2>
        <p className="mt-2 text-sm text-muted">{t("student.subscribe.invalidHint")}</p>
        <div className="mt-4">
          <Button type="button" onClick={() => navigate(PATHS.app.root)}>
            {t("student.subscribe.backHome")}
          </Button>
        </div>
      </Card>
    );
  }

  async function ensureDraft(): Promise<Subscription> {
    if (!user) throw new Error("Not authenticated");
    if (subscription) return subscription;
    const resp = await mockCreateSubscriptionDraft({ userId: user.id, serviceId: serviceId as ServiceId, applicant });
    setSubscription(resp.data);
    return resp.data;
  }

  async function nextFromStep1() {
    setLoading(true);
    try {
      const sub = await ensureDraft();
      const updated = await mockUpdateSubscription({
        subscriptionId: sub.id,
        patch: { applicant },
      });
      setSubscription(updated.data);
      setStep(2);
    } finally {
      setLoading(false);
    }
  }

  async function nextFromStep2() {
    setLoading(true);
    try {
      const sub = await ensureDraft();
      const updated = await mockUpdateSubscription({
        subscriptionId: sub.id,
        patch: { documents: docs.map((d) => d.meta) },
      });
      setSubscription(updated.data);
      setStep(3);
    } finally {
      setLoading(false);
    }
  }

  async function payFromWallet() {
    if (!user) return;
    const sub = await ensureDraft();
    setLoading(true);
    try {
      const resp = await mockPaySubscriptionFromWallet({ userId: user.id, subscriptionId: sub.id });
      setSubscription(resp.data.subscription);
      setWalletBalance(resp.data.wallet.balanceXaf);
      navigate(PATHS.app.subscriptions.services);
    } finally {
      setLoading(false);
    }
  }

  if (step === 0) {
    return <AviSummaryScreen onStart={() => setStep(1)} />;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Top Banner specific to this page */}
      <div className="w-full bg-white rounded-2xl h-[72px] flex items-center justify-between px-8 shadow-sm">
        <h1 className="text-[20px] font-semibold text-[#0B1B3A]">
          {serviceId === 'IRREVOCABLE_TRANSFER' ? 'Obtenir mon A.V.I' : t("student.subscribe.title")}
        </h1>
      </div>

      <div className="w-full bg-white rounded-[24px] p-6 md:p-12 shadow-sm min-h-[600px] border border-gray-100">
        <Stepper step={step} />

        {step === 1 ? (
          <div className="mt-14 max-w-4xl mx-auto px-4 md:px-8">
            <div className="grid gap-x-12 gap-y-7 md:grid-cols-2">
              {/* Left Column */}
              <div className="flex flex-col gap-7">
                <input
                  className="w-full h-[46px] px-5 rounded-xl bg-[#F8F9Fa] border-0 text-[13px] placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#3A73FA]/50 shadow-sm"
                  placeholder="Moni"
                  value={applicant.firstName}
                  onChange={(e) => setApplicant((a) => ({ ...a, firstName: e.target.value }))}
                />
                <input
                  className="w-full h-[46px] px-5 rounded-xl bg-[#F8F9Fa] border-0 text-[13px] placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#3A73FA]/50 shadow-sm"
                  placeholder="Roy"
                  value={applicant.lastName}
                  onChange={(e) => setApplicant((a) => ({ ...a, lastName: e.target.value }))}
                />
                <input
                  className="w-full h-[46px] px-5 rounded-xl bg-[#F8F9Fa] border-0 text-[13px] placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#3A73FA]/50 shadow-sm"
                  placeholder="Moniroy22@mail.com"
                  value={applicant.notes ?? ''} 
                  onChange={(e) => setApplicant((a) => ({ ...a, notes: e.target.value }))}
                />
                <div>
                  <div className="text-[10px] font-semibold text-[#718096] mb-2 uppercase tracking-wide">Numéro de téléphone</div>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 h-[46px] px-4 bg-[#F8F9Fa] rounded-xl text-[13px] text-[#A0AEC0] shrink-0 border-0 shadow-sm cursor-pointer hover:bg-gray-100 transition">
                      <span className="text-[#4A5568] font-medium">🇨🇲 +237</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <input
                      className="flex-1 h-[46px] px-5 rounded-xl bg-[#F8F9Fa] border-0 text-[13px] text-[#4A5568] focus:ring-2 focus:ring-[#3A73FA]/50 placeholder-[#A0AEC0] shadow-sm"
                      placeholder="696418984"
                      value={applicant.phone}
                      onChange={(e) => setApplicant((a) => ({ ...a, phone: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-7 pt-1">
                <input
                  className="w-full h-[46px] px-5 rounded-xl bg-[#F8F9Fa] border-0 text-[13px] placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#3A73FA]/50 shadow-sm"
                  placeholder="Numéro de passeport"
                  value={applicant.nationality} 
                  onChange={(e) => setApplicant((a) => ({ ...a, nationality: e.target.value }))}
                />
                <div>
                  <div className="text-[10px] font-semibold text-[#718096] mb-2 uppercase tracking-wide">Date de délivrance du passeport</div>
                  <div className="relative">
                    <input
                      className="w-full h-[46px] px-5 rounded-xl bg-[#F8F9Fa] border-0 text-[13px] placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#3A73FA]/50 shadow-sm"
                      placeholder="jj/mm/aa"
                      value={applicant.destinationCountry ?? ''} 
                      onChange={(e) => setApplicant((a) => ({ ...a, destinationCountry: e.target.value }))}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#A0AEC0]">
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-[#718096] mb-2 uppercase tracking-wide">Date d'expiration du passeport</div>
                  <div className="relative">
                    <input
                      className="w-full h-[46px] px-5 rounded-xl bg-[#F8F9Fa] border-0 text-[13px] placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#3A73FA]/50 shadow-sm"
                      placeholder="jj/mm/aa"
                      value={applicant.university ?? ''}
                      onChange={(e) => setApplicant((a) => ({ ...a, university: e.target.value }))}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#A0AEC0]">
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-[#718096] mb-2 uppercase tracking-wide">Scan du passeport</div>
                  <div className="flex h-[46px] bg-[#F8F9Fa] rounded-xl overflow-hidden cursor-pointer shadow-sm border-0">
                    <div className="h-full px-5 bg-[#E2E8F0]/70 flex items-center justify-center text-[12px] font-medium text-[#4A5568] hover:bg-[#E2E8F0] transition">
                      Choisir un fichier
                    </div>
                    <div className="h-full px-4 flex items-center text-[12px] text-[#A0AEC0]">
                      Aucun fichier sélectionné
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-16 pb-4">
              <button 
                type="button" 
                onClick={() => setStep(0)} 
                disabled={loading}
                className="px-10 py-[10px] rounded-full bg-[#E2E8F0] text-[#718096] font-semibold text-[13px] hover:bg-[#CBD5E1] transition-colors"
              >
                Annuler
              </button>
              <button 
                type="button" 
                onClick={() => void nextFromStep1()} 
                disabled={loading}
                className="px-10 py-[10px] rounded-full bg-[#3A73FA] text-white font-semibold text-[13px] hover:bg-[#3A73FA]/90 transition-colors shadow-sm"
              >
                Suivant
              </button>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-14 grid gap-4">
            <div className="grid gap-3 md:grid-cols-5">
              <div className="md:col-span-2">
                <div className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
                  <div className="text-sm font-semibold text-text">{t("student.subscribe.step3.uploadTitle")}</div>
                  <p className="mt-1 text-xs text-muted">{t("student.subscribe.step3.uploadHint")}</p>
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
                        if (mapped[0]) setSelectedDocId(mapped[0].meta.id);
                        e.currentTarget.value = "";
                      }}
                    />
                  </div>

                  <div className="mt-4 grid gap-2">
                    {docs.length ? (
                      docs.map((d) => (
                        <button
                          type="button"
                          key={d.meta.id}
                          onClick={() => setSelectedDocId(d.meta.id)}
                          className={[
                            "text-left rounded-xl border px-3 py-2 text-xs transition",
                            selectedDocId === d.meta.id
                              ? "border-[#3A73FA] bg-[#3A73FA]/10 text-[#3A73FA]"
                              : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100",
                          ].join(" ")}
                        >
                          <div className="truncate font-semibold">{d.meta.name}</div>
                          <div className="truncate">{(d.meta.sizeBytes / 1024).toFixed(0)} KB</div>
                        </button>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">{t("student.subscribe.step3.empty")}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
                  <div className="text-sm font-semibold text-text">{t("student.subscribe.step3.previewTitle")}</div>
                  <div className="mt-3">
                    {selectedDoc ? (
                      selectedDoc.file.type === "application/pdf" ? (
                        <embed
                          src={selectedDoc.url}
                          type="application/pdf"
                          className="h-[420px] w-full rounded-xl border border-[color:var(--card-border)] bg-white"
                        />
                      ) : (
                        <img
                          src={selectedDoc.url}
                          alt=""
                          className="max-h-[420px] w-full rounded-xl border border-[color:var(--card-border)] object-contain bg-white"
                        />
                      )
                    ) : (
                      <div className="text-sm text-gray-400">{t("student.subscribe.step3.noPreview")}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-16 pb-4">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                disabled={loading}
                className="px-10 py-[10px] rounded-full bg-[#E2E8F0] text-[#718096] font-semibold text-[13px] hover:bg-[#CBD5E1] transition-colors"
              >
                Annuler
              </button>
              <button 
                type="button" 
                onClick={() => void nextFromStep2()} 
                disabled={loading}
                className="px-10 py-[10px] rounded-full bg-[#3A73FA] text-white font-semibold text-[13px] hover:bg-[#3A73FA]/90 transition-colors shadow-sm"
              >
                Suivant
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-14 max-w-3xl mx-auto grid gap-4">
            <div className="rounded-2xl border border-[color:var(--card-border)] bg-bg p-6 text-center">
              <div className="text-lg font-semibold text-[#0B1B3A]">{t("student.subscribe.step4.title")}</div>
              <div className="mt-3 text-sm text-[#718096]">
                {t("student.subscribe.step4.price", { price: price.toLocaleString() })}
              </div>
              <div className="mt-1 text-sm font-medium text-[#48BB78]">
                {t("student.subscribe.step4.walletBalance", { balance: (walletBalance ?? 0).toLocaleString() })}
              </div>

              <div className="mt-8 flex justify-center">
                <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-left">
                  <div className="text-sm font-bold text-[#0B1B3A]">{t("student.subscribe.step4.walletTitle")}</div>
                  <p className="mt-1.5 text-xs text-[#718096]">{t("student.subscribe.step4.walletHint")}</p>
                  
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      disabled={loading || (walletBalance ?? 0) < price || price === 0}
                      onClick={() => void payFromWallet()}
                      className="w-full px-6 py-[11px] rounded-xl bg-[#3A73FA] text-white font-semibold text-[13px] hover:bg-[#3A73FA]/90 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {t("student.subscribe.step4.walletPay")}
                    </button>
                  </div>
                  
                  {(walletBalance ?? 0) < price ? (
                    <p className="mt-3 text-center text-xs font-semibold text-red-500">{t("student.subscribe.step4.insufficient")}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-16 pb-4">
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                disabled={loading}
                className="px-10 py-[10px] rounded-full bg-[#E2E8F0] text-[#718096] font-semibold text-[13px] hover:bg-[#CBD5E1] transition-colors"
              >
                Annuler
              </button>
              <div className="text-xs text-[#A0AEC0] font-medium pt-2">
                {subscription ? t("student.subscribe.step4.ref", { id: subscription.id }) : ""}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

