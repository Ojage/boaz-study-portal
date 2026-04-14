function base64UrlEncodeUtf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecodeToUtf8(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function createUnsignedJwt(payload: Record<string, unknown>): string {
  const header = { alg: "none", typ: "JWT" } as const;
  const headerPart = base64UrlEncodeUtf8(JSON.stringify(header));
  const payloadPart = base64UrlEncodeUtf8(JSON.stringify(payload));
  return `${headerPart}.${payloadPart}.`;
}

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const json = base64UrlDecodeToUtf8(parts[1] ?? "");
    const payload = JSON.parse(json);
    if (payload && typeof payload === "object") return payload as Record<string, unknown>;
    return null;
  } catch {
    return null;
  }
}
