import type { BoazDb, WalletState } from "../../contracts/boaz-contracts";
import { nowIso } from "./mock-utils";

const STORAGE_KEY = "boazStudyPortal.db.v1";

function parseDb(raw: string | null): BoazDb | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const db = parsed as BoazDb;
    if (db.version !== 1) return null;
    return db;
  } catch {
    return null;
  }
}

function emptyDb(): BoazDb {
  return {
    version: 1,
    subscriptions: [],
    paymentProofs: [],
    walletTopUps: [],
    financingRequests: [],
    repaymentSchedules: [],
    invoices: [],
    wallets: [],
  };
}

export function getBoazDb(): BoazDb {
  const db = parseDb(localStorage.getItem(STORAGE_KEY));
  if (db) return db;
  const fresh = emptyDb();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

export function setBoazDb(next: BoazDb): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function ensureWallet(db: BoazDb, userId: string): { db: BoazDb; wallet: WalletState } {
  const existing = db.wallets.find((w) => w.userId === userId);
  if (existing) return { db, wallet: existing };
  const wallet: WalletState = { userId, balanceXaf: 0, transactions: [] };
  const next = { ...db, wallets: [...db.wallets, wallet] };
  return { db: next, wallet };
}

export function resetBoazDb(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function seedBoazDbIfEmpty(): void {
  const db = getBoazDb();
  const hasData =
    db.subscriptions.length ||
    db.walletTopUps.length ||
    db.financingRequests.length ||
    db.wallets.length ||
    db.invoices.length;
  if (hasData) return;

  const seededAt = nowIso();
  const next: BoazDb = {
    ...db,
    wallets: [
      {
        userId: "user-std-001",
        balanceXaf: 250_000,
        transactions: [
          {
            id: "DEP-78542-9022",
            type: "TOP_UP",
            amountXaf: 500_000,
            status: "APPROVED",
            createdAt: "2025-01-25T10:15:00.000Z",
            note: "Recharge compte débiteur",
            referenceId: "rec-123",
          },
          {
            id: "PROF-78542-9021",
            type: "SUBSCRIPTION_PAYMENT",
            amountXaf: 250_000,
            status: "APPROVED",
            createdAt: "2025-04-30T14:32:47.000Z",
            note: "Service AVI",
            referenceId: "demo-123",
          },
        ],
      },
      {
        userId: "user-admin-001",
        balanceXaf: 0,
        transactions: [],
      },
    ],
    walletTopUps: [
      {
        id: "topup-seed-002",
        createdByUserId: "user-std-001",
        amountXaf: 250_000,
        receipt: {
          id: "doc-seed-001",
          name: "recu-virement-250000.pdf",
          mimeType: "application/pdf",
          sizeBytes: 248_000,
          createdAt: "2026-01-25T10:00:00.000Z",
        },
        status: "APPROVED",
        reviewNote: "Validé",
        createdAt: "2026-01-25T10:00:00.000Z",
        updatedAt: "2026-01-25T12:00:00.000Z",
      },
    ],
    subscriptions: [],
    financingRequests: [],
    repaymentSchedules: [],
    invoices: [],
    paymentProofs: [],
    version: 1,
  };

  // No-op marker to keep a deterministic "first write" timestamp for debugging.
  void seededAt;
  setBoazDb(next);
}
