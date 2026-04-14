export interface ErrorReportInput {
  error: unknown;
  componentStack?: string;
  source?: "error-boundary" | "window.onerror" | "unhandledrejection";
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function formatError(error: unknown): { name: string; message: string; stack?: string } {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { name: "UnknownError", message: safeStringify(error) };
}

export function buildErrorReport(input: ErrorReportInput): string {
  const { name, message, stack } = formatError(input.error);
  const now = new Date();
  const url = typeof location !== "undefined" ? location.href : "unknown";
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
  const language = typeof navigator !== "undefined" ? navigator.language : "unknown";
  const theme = typeof document !== "undefined" ? document.documentElement.dataset.theme ?? "unknown" : "unknown";

  const meta = {
    source: input.source ?? "error-boundary",
    time: now.toISOString(),
    url,
    userAgent,
    language,
    theme,
    mode: typeof import.meta !== "undefined" ? import.meta.env.MODE : "unknown",
  };

  const lines: string[] = [];
  lines.push("StudyPortal — Error Report");
  lines.push("");
  lines.push("Meta:");
  lines.push(safeStringify(meta));
  lines.push("");
  lines.push("Error:");
  lines.push(safeStringify({ name, message }));
  if (stack) {
    lines.push("");
    lines.push("Stack:");
    lines.push(stack);
  }
  if (input.componentStack) {
    lines.push("");
    lines.push("Component stack:");
    lines.push(input.componentStack.trim());
  }
  lines.push("");
  return lines.join("\n");
}

