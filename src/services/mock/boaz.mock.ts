import type {
  BoazDb,
  FinancingRequest,
  Invoice,
  RepaymentInstallment,
  RepaymentSchedule,
  ReviewStatus,
  ServiceId,
  Subscription,
  SubscriptionApplicantInfo,
  UploadedDocumentMeta,
  WalletState,
  WalletTopUpRequest,
} from "../../contracts/boaz-contracts";
import type { ApiResponse } from "../../contracts/api-contracts";
import { nowIso, toApiResponse, withDelay } from "./mock-utils";
import { ensureWallet, getBoazDb, seedBoazDbIfEmpty, setBoazDb } from "./boaz-storage";

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

function upsertById<T extends { id: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx === -1) return [item, ...list];
  return list.map((x) => (x.id === item.id ? item : x));
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

export interface CreateSubscriptionInput {
  userId: string;
  serviceId: ServiceId;
  applicant: SubscriptionApplicantInfo;
}

export async function mockCreateSubscriptionDraft(
  input: CreateSubscriptionInput,
  delayMs?: number,
): Promise<ApiResponse<Subscription>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db = getBoazDb();
    const ts = nowIso();
    const sub: Subscription = {
      id: newId("sub"),
      serviceId: input.serviceId,
      createdByUserId: input.userId,
      applicant: input.applicant,
      documents: [],
      status: "DRAFT",
      reviewStatus: "PENDING",
      createdAt: ts,
      updatedAt: ts,
    };
    setBoazDb({ ...db, subscriptions: [sub, ...db.subscriptions] });
    return toApiResponse(sub, "Mock subscription draft created");
  }, delayMs);
}

export async function mockUpdateSubscription(
  input: { subscriptionId: string; patch: Partial<Pick<Subscription, "applicant" | "documents" | "payment" | "status">> },
  delayMs?: number,
): Promise<ApiResponse<Subscription>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db = getBoazDb();
    const sub = db.subscriptions.find((s) => s.id === input.subscriptionId);
    if (!sub) {
      throw new Error("Subscription not found");
    }
    const next: Subscription = {
      ...sub,
      ...input.patch,
      updatedAt: nowIso(),
    };
    setBoazDb({ ...db, subscriptions: upsertById(db.subscriptions, next) });
    return toApiResponse(next, "Mock subscription updated");
  }, delayMs);
}

export async function mockListMySubscriptions(
  input: { userId: string },
  delayMs?: number,
): Promise<ApiResponse<Subscription[]>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db = getBoazDb();
    return toApiResponse(
      db.subscriptions.filter((s) => s.createdByUserId === input.userId),
      "Mock subscriptions fetched",
    );
  }, delayMs);
}

export async function mockListAllSubscriptions(delayMs?: number): Promise<ApiResponse<Subscription[]>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db = getBoazDb();
    return toApiResponse(db.subscriptions, "Mock subscriptions fetched (admin)");
  }, delayMs);
}

export async function mockReviewSubscription(
  input: { subscriptionId: string; status: ReviewStatus; note?: string },
  delayMs?: number,
): Promise<ApiResponse<Subscription>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db = getBoazDb();
    const sub = db.subscriptions.find((s) => s.id === input.subscriptionId);
    if (!sub) throw new Error("Subscription not found");

    const ts = nowIso();
    const approved = input.status === "APPROVED";
    const rejected = input.status === "REJECTED";
    const nextSub: Subscription = {
      ...sub,
      reviewStatus: input.status,
      reviewNote: input.note,
      status: approved ? "APPROVED" : rejected ? "REJECTED" : "UNDER_REVIEW",
      updatedAt: ts,
    };

    const nextInvoices: Invoice[] = approved
      ? [
          {
            id: newId("inv"),
            createdByUserId: sub.createdByUserId,
            subscriptionId: sub.id,
            amountXaf: servicePriceXaf(sub.serviceId),
            createdAt: ts,
          },
          ...db.invoices,
        ]
      : db.invoices;

    setBoazDb({
      ...db,
      subscriptions: upsertById(db.subscriptions, nextSub),
      invoices: nextInvoices,
    });

    return toApiResponse(nextSub, "Mock subscription reviewed");
  }, delayMs);
}

export async function mockListPaymentProofs(
  input: { userId?: string },
  delayMs?: number,
): Promise<ApiResponse<UploadedDocumentMeta[]>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db = getBoazDb();
    if (!input.userId) return toApiResponse(db.paymentProofs, "Mock proofs fetched");
    // Proofs are stored as documents; link is maintained by the UI (subscription/wallet-topup referencing proof id).
    // For now, return all proofs created by the user (best-effort: name-based id prefix + timestamp).
    return toApiResponse(db.paymentProofs, "Mock proofs fetched");
  }, delayMs);
}

export async function mockCreatePaymentProof(
  input: { document: UploadedDocumentMeta },
  delayMs?: number,
): Promise<ApiResponse<UploadedDocumentMeta>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db0 = getBoazDb();
    const next = { ...db0, paymentProofs: [input.document, ...db0.paymentProofs] };
    setBoazDb(next);
    return toApiResponse(input.document, "Mock payment proof created");
  }, delayMs);
}

export interface CreateWalletTopUpInput {
  userId: string;
  amountXaf: number;
  receipt?: UploadedDocumentMeta;
}

export async function mockRequestWalletTopUp(
  input: CreateWalletTopUpInput,
  delayMs?: number,
): Promise<ApiResponse<WalletTopUpRequest>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db0 = getBoazDb();
    const ts = nowIso();
    const req: WalletTopUpRequest = {
      id: newId("topup"),
      createdByUserId: input.userId,
      amountXaf: input.amountXaf,
      receipt: input.receipt,
      status: "PENDING",
      createdAt: ts,
      updatedAt: ts,
    };
    const db = { ...db0, walletTopUps: [req, ...db0.walletTopUps] };
    setBoazDb(db);
    return toApiResponse(req, "Mock wallet top-up requested");
  }, delayMs);
}

export async function mockListWalletTopUps(delayMs?: number): Promise<ApiResponse<WalletTopUpRequest[]>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db = getBoazDb();
    return toApiResponse(db.walletTopUps, "Mock wallet top-ups fetched");
  }, delayMs);
}

export async function mockReviewWalletTopUp(
  input: { topUpId: string; status: ReviewStatus; note?: string },
  delayMs?: number,
): Promise<ApiResponse<WalletTopUpRequest>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db0 = getBoazDb();
    const topUp = db0.walletTopUps.find((t) => t.id === input.topUpId);
    if (!topUp) throw new Error("Top-up not found");

    const ts = nowIso();
    const reviewed: WalletTopUpRequest = {
      ...topUp,
      status: input.status,
      reviewNote: input.note,
      updatedAt: ts,
    };

    let db: BoazDb = { ...db0, walletTopUps: upsertById(db0.walletTopUps, reviewed) };

    if (input.status === "APPROVED") {
      const ensured = ensureWallet(db, topUp.createdByUserId);
      db = ensured.db;
      const wallet = ensured.wallet;
      const tx = {
        id: newId("wtx"),
        type: "TOP_UP" as const,
        amountXaf: topUp.amountXaf,
        status: "APPROVED" as const,
        createdAt: ts,
        note: "Wallet top-up approved",
        referenceId: topUp.id,
      };
      const nextWallet: WalletState = {
        ...wallet,
        balanceXaf: wallet.balanceXaf + topUp.amountXaf,
        transactions: [tx, ...wallet.transactions],
      };
      db = {
        ...db,
        wallets: db.wallets.map((w) => (w.userId === nextWallet.userId ? nextWallet : w)),
      };
    }

    setBoazDb(db);
    return toApiResponse(reviewed, "Mock wallet top-up reviewed");
  }, delayMs);
}

export async function mockGetWallet(
  input: { userId: string },
  delayMs?: number,
): Promise<ApiResponse<WalletState>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db0 = getBoazDb();
    const { db, wallet } = ensureWallet(db0, input.userId);
    if (db !== db0) setBoazDb(db);
    return toApiResponse(wallet, "Mock wallet fetched");
  }, delayMs);
}

export async function mockPaySubscriptionFromWallet(
  input: { userId: string; subscriptionId: string },
  delayMs?: number,
): Promise<ApiResponse<{ wallet: WalletState; subscription: Subscription }>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    let db0 = getBoazDb();
    const sub = db0.subscriptions.find((s) => s.id === input.subscriptionId);
    if (!sub) throw new Error("Subscription not found");
    if (sub.createdByUserId !== input.userId) throw new Error("Forbidden");

    const price = servicePriceXaf(sub.serviceId);
    const ensured = ensureWallet(db0, input.userId);
    db0 = ensured.db;
    const wallet = ensured.wallet;
    if (wallet.balanceXaf < price) throw new Error("Insufficient wallet balance");

    const ts = nowIso();
    const tx = {
      id: newId("wtx"),
      type: "SUBSCRIPTION_PAYMENT" as const,
      amountXaf: price,
      status: "APPROVED" as const,
      createdAt: ts,
      note: `Payment for ${sub.serviceId}`,
      referenceId: sub.id,
    };

    const nextWallet: WalletState = {
      ...wallet,
      balanceXaf: wallet.balanceXaf - price,
      transactions: [tx, ...wallet.transactions],
    };

    const nextSub: Subscription = {
      ...sub,
      payment: { method: "WALLET", paidAt: ts },
      status: "SUBMITTED",
      reviewStatus: "PENDING",
      updatedAt: ts,
    };

    const nextDb: BoazDb = {
      ...db0,
      wallets: db0.wallets.map((w) => (w.userId === nextWallet.userId ? nextWallet : w)),
      subscriptions: upsertById(db0.subscriptions, nextSub),
    };

    setBoazDb(nextDb);
    return toApiResponse({ wallet: nextWallet, subscription: nextSub }, "Mock subscription paid (wallet)");
  }, delayMs);
}

export interface CreateFinancingRequestInput {
  userId: string;
  profile: FinancingRequest["profile"];
  school: FinancingRequest["school"];
  guarantor: FinancingRequest["guarantor"];
  documents: UploadedDocumentMeta[];
}

export async function mockCreateFinancingRequest(
  input: CreateFinancingRequestInput,
  delayMs?: number,
): Promise<ApiResponse<FinancingRequest>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db0 = getBoazDb();
    const ts = nowIso();
    const req: FinancingRequest = {
      id: newId("fin"),
      createdByUserId: input.userId,
      profile: input.profile,
      school: input.school,
      guarantor: input.guarantor,
      documents: input.documents,
      status: "PENDING",
      createdAt: ts,
      updatedAt: ts,
    };
    setBoazDb({ ...db0, financingRequests: [req, ...db0.financingRequests] });
    return toApiResponse(req, "Mock financing request created");
  }, delayMs);
}

export async function mockListMyFinancingRequests(
  input: { userId: string },
  delayMs?: number,
): Promise<ApiResponse<FinancingRequest[]>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db = getBoazDb();
    return toApiResponse(
      db.financingRequests.filter((r) => r.createdByUserId === input.userId),
      "Mock financing requests fetched",
    );
  }, delayMs);
}

export async function mockListAllFinancingRequests(delayMs?: number): Promise<ApiResponse<FinancingRequest[]>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db = getBoazDb();
    return toApiResponse(db.financingRequests, "Mock financing requests fetched (admin)");
  }, delayMs);
}

function buildRepaymentSchedule(financingRequestId: string, totalXaf: number): RepaymentSchedule {
  const months = 6;
  const perMonth = Math.max(1, Math.round(totalXaf / months));
  const start = new Date();
  start.setMonth(start.getMonth() + 1);

  const installments: RepaymentInstallment[] = Array.from({ length: months }).map((_, idx) => {
    const due = new Date(start);
    due.setMonth(start.getMonth() + idx);
    return {
      id: newId("inst"),
      dueDate: due.toISOString(),
      amountXaf: perMonth,
      status: "PENDING",
    };
  });

  return {
    id: newId("sched"),
    financingRequestId,
    installments,
  };
}

export async function mockReviewFinancingRequest(
  input: { financingRequestId: string; status: ReviewStatus; note?: string; approvedAmountXaf?: number },
  delayMs?: number,
): Promise<ApiResponse<FinancingRequest>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db0 = getBoazDb();
    const req = db0.financingRequests.find((r) => r.id === input.financingRequestId);
    if (!req) throw new Error("Financing request not found");

    const ts = nowIso();
    let schedule: RepaymentSchedule | null = null;
    if (input.status === "APPROVED") {
      schedule = buildRepaymentSchedule(req.id, input.approvedAmountXaf ?? 600_000);
    }

    const nextReq: FinancingRequest = {
      ...req,
      status: input.status,
      reviewNote: input.note,
      repaymentScheduleId: schedule?.id,
      updatedAt: ts,
    };

    const nextDb: BoazDb = {
      ...db0,
      financingRequests: upsertById(db0.financingRequests, nextReq),
      repaymentSchedules: schedule ? [schedule, ...db0.repaymentSchedules] : db0.repaymentSchedules,
    };
    setBoazDb(nextDb);
    return toApiResponse(nextReq, "Mock financing request reviewed");
  }, delayMs);
}

export async function mockGetRepaymentSchedules(
  input: { userId: string },
  delayMs?: number,
): Promise<ApiResponse<RepaymentSchedule[]>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db = getBoazDb();
    const myFinancingIds = new Set(
      db.financingRequests.filter((r) => r.createdByUserId === input.userId).map((r) => r.id),
    );
    return toApiResponse(
      db.repaymentSchedules.filter((s) => myFinancingIds.has(s.financingRequestId)),
      "Mock repayment schedules fetched",
    );
  }, delayMs);
}

export async function mockListMyInvoices(
  input: { userId: string },
  delayMs?: number,
): Promise<ApiResponse<Invoice[]>> {
  return await withDelay(() => {
    seedBoazDbIfEmpty();
    const db = getBoazDb();
    return toApiResponse(db.invoices.filter((i) => i.createdByUserId === input.userId), "Mock invoices fetched");
  }, delayMs);
}
