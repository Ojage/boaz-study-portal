import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { TextField } from "../../../components/ui/TextField";
import { useAuth } from "../../../hooks/useAuth";
import type { WalletState, WalletTopUpRequest } from "../../../contracts/boaz-contracts";
import { mockGetWallet, mockListWalletTopUps, mockRequestWalletTopUp, resetBoazDb } from "../../../services/mock";
import blueishImg from "../../../assets/blueish.jpg";
import walletImg from "../../../assets/images/wallet.png";
import walletSmallImg from "../../../assets/images/WalletSmall.png";
import serviceSmallImg from "../../../assets/images/ServiceSmall.png";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../router/paths";
import { Icon } from "../../../components/ui/Icon";
import {
  ArrowDownTrayIcon,
  ArrowRightIcon,
  XMarkIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  ExclamationTriangleIcon,
  ShareIcon,
  ArrowUpRightIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";



function formatXaf(amountXaf: number): string {
  return `${amountXaf.toLocaleString()} XAF`;
}

function fileToMeta(file: File) {
  return {
    id: `doc-${crypto.randomUUID()}`,
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    createdAt: new Date().toISOString(),
  };
}

export function WalletPage() {
  const { t } = useTranslation("translation");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [topUps, setTopUps] = useState<WalletTopUpRequest[]>([]);
  const [amount, setAmount] = useState("50000");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  const refresh = () => {
    if (!user) return;
    void mockGetWallet({ userId: user.id }).then((r) => setWallet(r.data));
    void mockListWalletTopUps().then((r) => setTopUps(r.data.filter((x) => x.createdByUserId === user.id)));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const pending = useMemo(() => topUps.filter((x) => x.status === "PENDING"), [topUps]);
  const history = useMemo(() => wallet?.transactions ?? [], [wallet]);
  const balance = wallet?.balanceXaf ?? 0;

  const credited = useMemo(
    () => history.filter((tx) => tx.type === "TOP_UP").reduce((sum, tx) => sum + tx.amountXaf, 0),
    [history],
  );
  const debited = useMemo(
    () => history.filter((tx) => tx.type === "SUBSCRIPTION_PAYMENT").reduce((sum, tx) => sum + tx.amountXaf, 0),
    [history],
  );

  const creditPct = useMemo(() => {
    const total = credited + debited;
    if (total <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((credited / total) * 100)));
  }, [credited, debited]);

  const debitPct = useMemo(() => 100 - creditPct, [creditPct]);

  const selectedTxDetails = useMemo(() => {
    const selectedTx = history.find(x => x.id === selectedTxId);
    if (!selectedTx) return null;
    const isPositive = selectedTx.type === "TOP_UP";
    const title = selectedTx.note || (isPositive ? "Recharge compte" : "Paiement service");
    const serviceType = isPositive ? "Dépôt Wallet" : "Achat de Service";
    const proformaId = selectedTx.referenceId || "-";
    const category = isPositive ? "Recharge" : "Paiement";
    const paymentMethod = "Wallet / Virement";
    const fee = "0 XAF";
    const dDate = new Date(selectedTx.createdAt);
    const dateFormatted = dDate.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "medium" }).replace(",", " à");

    return {
      title,
      amount: formatXaf(selectedTx.amountXaf),
      isPositive,
      serviceType,
      proformaId,
      category,
      statusText: selectedTx.status === "APPROVED" ? "Validé" : "En attente",
      balanceBefore: "-",
      balanceAfter: "-",
      paymentMethod,
      transactionId: selectedTx.id,
      fee,
      date: dateFormatted,
      reference: selectedTx.referenceId || "-",
      docs: [
        { name: `Document_${selectedTx.id.substring(0, 5)}.pdf`, generatedAt: `Généré le ${dDate.toLocaleDateString("fr-FR")}` }
      ]
    };
  }, [selectedTxId, history]);

  async function submitTopUp() {
    if (!user) return;
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return;
    setSubmitting(true);
    try {
      await mockRequestWalletTopUp({
        userId: user.id,
        amountXaf: n,
        receipt: receipt ? fileToMeta(receipt) : undefined,
      });
      setReceipt(null);
      refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-5">
      <Card className="p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[color:var(--primary)]">{t("student.wallet.title")}</h2>
            <p className="mt-1 text-sm text-muted">{t("student.wallet.subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                resetBoazDb();
                location.reload();
              }}
            >
              {t("common.clearSession")}
            </Button>
            <Button variant="outline" type="button" onClick={refresh}>
              {t("common.refresh")}
            </Button>
          </div>
        </div>

        <div className="mt-6 mx-auto w-full max-w-5xl">
          <div
            className="overflow-hidden rounded-3xl border border-[color:var(--card-border)] shadow-card"
            style={{
              backgroundImage: `url(${blueishImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-[#0B1B3A]/35 backdrop-blur-[2px]">
              <div className="p-6 md:p-10">
                <div className="text-xs font-semibold text-white/80">
                  {t("student.wallet.hero.greeting", { name: user?.fullName?.split(" ")[0] ?? t("student.wallet.hero.defaultName") })}
                </div>
                <div className="mt-1 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                  {formatXaf(balance)}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    className="min-w-0 bg-[#0A3DFF] hover:bg-[#0832d6] active:bg-[#072bbd]"
                    onClick={() => setShowAccount(true)}
                  >
                    {t("student.wallet.hero.viewAccount")}
                    <Icon icon={ArrowRightIcon} />
                  </Button>
                  <Button
                    type="button"
                    className="min-w-0 bg-[#0A3DFF] hover:bg-[#0832d6] active:bg-[#072bbd]"
                    onClick={() => navigate(PATHS.app.root)}
                  >
                    {t("student.wallet.hero.subscribe")}
                    <Icon icon={ArrowRightIcon} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card className="p-6 rounded-[1.5rem] shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="text-xl font-bold text-[#0B1B3A]">Solde Créditeur</div>
                <button
                  type="button"
                  className="text-xs font-bold text-[#0A3DFF] hover:underline uppercase tracking-wide"
                  onClick={() => setShowAccount(true)}
                >
                  VOIR PLUS
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between gap-6">
                <div className="flex shrink-0">
                  <img src={walletImg} alt="" className="h-[4.5rem] w-[4.5rem] object-contain drop-shadow-sm" />
                </div>
                <div className="flex-1 mt-1">
                  <div className="text-center font-bold text-black mb-2 text-base">{formatXaf(credited)}</div>
                  <div className="h-2 w-full rounded-full flex relative overflow-hidden items-center justify-center">
                    <div className="h-full bg-[#0A3DFF]" style={{ width: `${creditPct}%` }} />
                    <div className="h-full bg-[#0B1B3A] w-0.5" />
                    <div className="h-full bg-[#FB8133]" style={{ width: `${debitPct}%` }} />
                  </div>
                  <div className="mt-2 text-center text-xs text-[#718096]">More money left than you made 👀</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-[1.5rem] shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="text-xl font-bold text-[#0B1B3A]">Solde débiteur</div>
                <button
                  type="button"
                  className="text-xs font-bold text-[#0A3DFF] hover:underline uppercase tracking-wide"
                  onClick={() => setShowAccount(true)}
                >
                  VOIR PLUS
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between gap-6">
                <div className="flex shrink-0">
                  <img src={walletImg} alt="" className="h-[4.5rem] w-[4.5rem] object-contain drop-shadow-sm" />
                </div>
                <div className="flex-1 mt-1">
                  <div className="text-center font-bold text-black mb-2 text-base">{formatXaf(debited)}</div>
                  <div className="h-2 w-full rounded-full flex items-center bg-[#E2E8F0] relative">
                    <div className="h-full bg-[#48BB78] rounded-full absolute left-0" style={{ width: `${debitPct}%` }} />
                    <div className="h-3.5 bg-[#A0AEC0] w-[2px] absolute right-4" />
                  </div>
                  <div className="mt-2 text-center text-xs text-[#718096]">Looking good so far 👌🏼</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-gray-100 shadow-sm bg-white p-6 md:px-8">
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-100">
              <div className="text-lg font-bold text-[#0B1B3A]">Historique des transactions</div>
              <button
                type="button"
                className="text-xs font-bold text-[#0A3DFF] hover:underline uppercase tracking-wide"
                onClick={() => setShowAccount(true)}
              >
                VOIR TOUT
              </button>
            </div>

            <div className="mt-2 grid gap-0">
              {history.length ? (
                history.slice(0, 6).map((tx) => {
                  const isTopUp = tx.type === "TOP_UP";
                  const imgUrl = isTopUp ? walletSmallImg : serviceSmallImg;
                  const dateFormatted = new Date(tx.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long" });

                  return (
                    <div 
                      key={tx.id}
                      className="flex items-center justify-between gap-3 border-b border-gray-100 py-5 cursor-pointer hover:bg-gray-50 px-2 rounded-xl transition-colors"
                      onClick={() => setSelectedTxId(tx.id)}
                    >
                      <div className="flex min-w-0 items-center gap-5">
                        <div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-2xl bg-[#F8F9Fa] shrink-0 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]">
                          <img src={imgUrl} alt="" className="h-7 w-7 object-contain" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-base font-semibold text-[#0B1B3A]">{tx.note || (isTopUp ? "Recharge compte" : "Paiement service")}</div>
                          <div className="truncate text-sm text-[#A0AEC0] mt-0.5">{dateFormatted}</div>
                        </div>
                      </div>
                      <div className="text-[15px] font-bold text-black tracking-wide">{formatXaf(tx.amountXaf)}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-gray-500 py-5 px-2">Aucune transaction pour le moment</div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {showAccount ? (
        <Card className="p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-base font-bold text-text">{t("student.wallet.account.title")}</div>
              <div className="mt-1 text-sm text-muted">{t("student.wallet.account.subtitle")}</div>
            </div>
            <Button type="button" variant="outline" onClick={() => setShowAccount(false)}>
              {t("student.wallet.account.close")}
            </Button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Card className="p-4 md:col-span-1">
              <div className="text-sm font-bold text-text">{t("student.wallet.topup.title")}</div>
              <div className="mt-3 grid gap-2">
                <TextField
                  label={t("student.wallet.topup.amount")}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  name="amount"
                  inputMode="numeric"
                />
                <div className="grid gap-1">
                  <div className="text-xs font-semibold text-text">{t("student.wallet.topup.receipt")}</div>
                  <input type="file" accept="application/pdf,image/*" onChange={(e) => setReceipt(e.target.files?.[0] ?? null)} />
                  {receipt ? <div className="text-xs text-muted">{receipt.name}</div> : null}
                </div>
                <Button type="button" disabled={submitting} onClick={() => void submitTopUp()}>
                  <Icon icon={ArrowDownTrayIcon} />
                  {t("student.wallet.topup.submit")}
                </Button>
              </div>
            </Card>

            <Card className="p-4 md:col-span-2">
              <div className="text-sm font-bold text-text">{t("student.wallet.pending.title")}</div>
              <div className="mt-3 grid gap-2">
                {pending.length ? (
                  pending.map((x) => (
                    <div key={x.id} className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--card-border)] bg-bg px-3 py-2">
                      <div className="text-xs text-muted">{formatXaf(x.amountXaf)}</div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-muted">{x.status}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted">{t("student.wallet.pending.empty")}</div>
                )}
              </div>
            </Card>
          </div>
        </Card>
      ) : null}

      {/* Transaction Details Modal */}
      {selectedTxDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-[17px]">Détails de la transaction</h3>
                <InformationCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <button onClick={() => setSelectedTxId(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Summary item */}
              <div className="flex items-start justify-between">
                <div className="flex gap-4 items-center">
                  <div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-xl bg-orange-50 text-orange-500 shrink-0">
                    <DocumentTextIcon className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 font-bold tracking-wider uppercase mb-0.5">Transaction</div>
                    <div className="font-bold text-gray-900 text-base leading-snug">{selectedTxDetails.title}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold flex items-center justify-end gap-1 ${selectedTxDetails.isPositive ? 'text-green-600' : 'text-red-500'} text-[17px] tracking-wide`}>
                    {!selectedTxDetails.isPositive && <ArrowUpRightIcon className="h-4 w-4" strokeWidth={2.5} />}
                    {selectedTxDetails.isPositive ? '+' : '-'} {selectedTxDetails.amount}
                  </div>
                  <div className="mt-1.5 flex justify-end">
                    <div className="bg-[#4CAF50] text-white text-[10px] tracking-widest font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 bg-white rounded-full opacity-80" />
                      PAYÉE
                    </div>
                  </div>
                </div>
              </div>

              {/* DÉTAILS DU SERVICE */}
              <div>
                <h4 className="text-[11px] text-[#0A3DFF] font-bold uppercase tracking-widest mb-3 px-1">DÉTAILS DU SERVICE</h4>
                <div className="border border-gray-200 rounded-xl bg-white text-[13px] divide-y divide-gray-100">
                  <div className="flex justify-between items-center p-4">
                    <span className="text-gray-500">Type de service</span>
                    <span className="font-semibold text-gray-900 text-right">{selectedTxDetails.serviceType}</span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-gray-500">N° Proforma</span>
                    <span className="font-semibold text-gray-900 flex items-center gap-2">
                      {selectedTxDetails.proformaId}
                      {selectedTxDetails.proformaId !== '-' && <DocumentDuplicateIcon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-gray-500">Catégorie</span>
                    <span className="font-semibold text-gray-900">{selectedTxDetails.category}</span>
                  </div>
                </div>
              </div>

              {/* STATUT & WALLET */}
              <div>
                <h4 className="text-[11px] text-[#0A3DFF] font-bold uppercase tracking-widest mb-3 px-1">STATUT & WALLET</h4>
                <div className="border border-gray-200 rounded-xl bg-white text-[13px] divide-y divide-gray-100">
                  <div className="p-4 flex items-center gap-2.5 bg-gray-50/50 rounded-t-xl">
                    <CheckCircleIcon className="h-[22px] w-[22px] text-green-500" />
                    <span className="font-bold text-gray-900">{selectedTxDetails.statusText}</span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-gray-500">Solde avant</span>
                    <span className="font-bold text-gray-900">{selectedTxDetails.balanceBefore}</span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-gray-500">Solde après</span>
                    <span className="font-bold text-gray-900">{selectedTxDetails.balanceAfter}</span>
                  </div>
                </div>
              </div>

              {/* DÉTAILS DU PAIEMENT */}
              <div>
                <h4 className="text-[11px] text-[#0A3DFF] font-bold uppercase tracking-widest mb-3 px-1">DÉTAILS DU PAIEMENT</h4>
                <div className="border border-gray-200 rounded-xl bg-white text-[13px] divide-y divide-gray-100">
                  <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-t-xl">
                    <span className="text-gray-500">Méthode</span>
                    <span className="font-semibold text-gray-900">{selectedTxDetails.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-gray-500">ID Transaction</span>
                    <span className="font-semibold text-gray-900 flex items-center gap-2">
                      {selectedTxDetails.transactionId}
                      <DocumentDuplicateIcon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-gray-500">Frais</span>
                    <span className="font-semibold text-gray-900">{selectedTxDetails.fee}</span>
                  </div>
                </div>
              </div>

              {/* INFORMATIONS DE BASE */}
              <div>
                <h4 className="text-[11px] text-[#0A3DFF] font-bold uppercase tracking-widest mb-3 px-1">INFORMATIONS DE BASE</h4>
                <div className="border border-gray-200 rounded-xl bg-white text-[13px] divide-y divide-gray-100">
                  <div className="flex justify-between items-center p-4">
                    <span className="text-gray-500">Date</span>
                    <span className="font-semibold text-gray-900 flex items-center gap-2">
                      <ClockIcon className="h-[18px] w-[18px] text-gray-400" />
                      {selectedTxDetails.date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-gray-500">Référence</span>
                    <span className="font-semibold text-gray-900 flex items-center gap-2">
                      {selectedTxDetails.reference}
                      <DocumentDuplicateIcon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents liés */}
              <div>
                <h4 className="text-[15px] font-bold text-gray-900 mb-3 px-1">Documents liés</h4>
                <div className="grid gap-3">
                  {selectedTxDetails.docs.map((doc, i) => (
                    <div key={i} className="flex justify-between items-center border border-gray-200 rounded-xl p-3.5 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-50/50 border border-orange-100 text-[#FB8133] shrink-0">
                          <DocumentTextIcon className="h-[22px] w-[22px]" />
                        </div>
                        <div className="min-w-0 pr-2">
                          <div className="text-[13px] font-bold text-gray-900 truncate">{doc.name}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5 truncate">{doc.generatedAt}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button type="button" className="h-[34px] w-[34px] flex items-center justify-center rounded-md bg-[#0A3DFF]/10 text-[#0A3DFF] hover:bg-[#0A3DFF]/20 transition-colors cursor-pointer">
                          <ArrowDownTrayIcon className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                        <button type="button" className="h-[34px] w-[34px] flex items-center justify-center rounded-md bg-[#FB8133]/10 text-[#FB8133] hover:bg-[#FB8133]/20 transition-colors cursor-pointer">
                          <ShareIcon className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t border-gray-100 flex gap-3 shrink-0">
              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 px-2 bg-white border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-[11px] md:text-xs font-bold shrink-0 shadow-sm cursor-pointer whitespace-nowrap">
                <PrinterIcon className="h-[18px] w-[18px]" /> Imprimer le reçu
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 px-2 bg-orange-50 border border-orange-200 text-[#FB8133] rounded-xl hover:bg-orange-100 transition-colors text-[11px] md:text-xs font-bold shrink-0 shadow-sm cursor-pointer whitespace-nowrap">
                <ExclamationTriangleIcon className="h-[18px] w-[18px]" /> Contester la transaction
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 px-2 bg-[#0A3DFF] hover:bg-[#0832d6] text-white rounded-xl transition-colors text-[11px] md:text-xs font-bold shrink-0 shadow-sm cursor-pointer whitespace-nowrap">
                <ShareIcon className="h-[18px] w-[18px]" /> Partager le reçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
