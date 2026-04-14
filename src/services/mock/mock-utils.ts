import type { ApiResponse, ISODateString } from "../../contracts/api-contracts";

export const DEFAULT_DELAY_MS = 600;

export function nowIso(): ISODateString {
  return new Date().toISOString();
}

export function toApiResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    timestamp: nowIso(),
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function withDelay<T>(
  factory: () => T | Promise<T>,
  delayMs: number = DEFAULT_DELAY_MS,
): Promise<T> {
  await delay(delayMs);
  return await factory();
}
