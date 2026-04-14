import type { ISODateString } from "./api-contracts";

export type ServiceId =
  | "IRREVOCABLE_TRANSFER"
  | "HOUSING_ATTESTATION"
  | "INSURANCE"
  | "FINANCING_REQUEST";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PaymentMethod = "WALLET" | "BANK_TRANSFER_PROOF";

export interface UploadedDocumentMeta {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: ISODateString;
}

export interface SubscriptionApplicantInfo {
  firstName: string;
  lastName: string;
  phone: string;
  nationality: string;
  destinationCountry?: string;
  university?: string;
  notes?: string;
}

export interface SubscriptionPaymentInfo {
  method: PaymentMethod;
  proofDocumentId?: string;
  paidAt?: ISODateString;
}

export type SubscriptionStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export interface Subscription {
  id: string;
  serviceId: ServiceId;
  createdByUserId: string;
  applicant: SubscriptionApplicantInfo;
  documents: UploadedDocumentMeta[];
  payment?: SubscriptionPaymentInfo;
  status: SubscriptionStatus;
  reviewStatus: ReviewStatus;
  reviewNote?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type WalletTransactionType = "TOP_UP" | "SUBSCRIPTION_PAYMENT";
export type WalletTransactionStatus = ReviewStatus;

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amountXaf: number;
  status: WalletTransactionStatus;
  createdAt: ISODateString;
  note?: string;
  referenceId?: string;
}

export interface WalletState {
  userId: string;
  balanceXaf: number;
  transactions: WalletTransaction[];
}

export interface WalletTopUpRequest {
  id: string;
  createdByUserId: string;
  amountXaf: number;
  receipt?: UploadedDocumentMeta;
  status: ReviewStatus;
  reviewNote?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface FinancingProfileStep {
  firstName: string;
  lastName: string;
  identityNumber: string;
  country: string;
}

export interface FinancingSchoolStep {
  university: string;
  program: string;
  startDate?: string;
}

export interface FinancingGuarantorStep {
  guarantorFullName: string;
  guarantorPhone: string;
  guarantorRelationship: string;
}

export interface RepaymentInstallment {
  id: string;
  dueDate: ISODateString;
  amountXaf: number;
  status: "PENDING" | "PAID" | "LATE";
}

export interface RepaymentSchedule {
  id: string;
  financingRequestId: string;
  installments: RepaymentInstallment[];
}

export interface FinancingRequest {
  id: string;
  createdByUserId: string;
  profile: FinancingProfileStep;
  school: FinancingSchoolStep;
  guarantor: FinancingGuarantorStep;
  documents: UploadedDocumentMeta[];
  status: ReviewStatus;
  reviewNote?: string;
  repaymentScheduleId?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Invoice {
  id: string;
  createdByUserId: string;
  subscriptionId: string;
  amountXaf: number;
  createdAt: ISODateString;
}

export interface BoazDb {
  version: 1;
  subscriptions: Subscription[];
  paymentProofs: UploadedDocumentMeta[];
  walletTopUps: WalletTopUpRequest[];
  financingRequests: FinancingRequest[];
  repaymentSchedules: RepaymentSchedule[];
  invoices: Invoice[];
  wallets: WalletState[];
}

