import { useMemo, useState } from "react";
import { Logo } from "./Logo";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { buildErrorReport } from "../../utils/error-report";
import { PATHS } from "../../router/paths";

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

export function ErrorBoundaryPage({
  error,
  componentStack,
  onReset,
}: {
  error: unknown;
  componentStack?: string;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState<null | "ok" | "fail">(null);

  const reportId = useMemo(() => {
    const now = new Date();
    const rand = Math.random().toString(16).slice(2, 8).toUpperCase();
    const stamp = now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
    return `SP-${stamp}-${rand}`;
  }, []);

  const report = useMemo(
    () => buildErrorReport({ error, componentStack, source: "error-boundary" }),
    [error, componentStack],
  );

  const message =
    error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  return (
    <main className="min-h-[100svh] bg-bg">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="flex items-start justify-between gap-3">
          <Logo heightPx={48} />
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              location.reload();
            }}
          >
            Reset app
          </Button>
        </div>

        <h1 className="mt-8">Something went wrong</h1>
        <p className="mt-4 text-body text-muted">
          The application crashed while rendering this page. Copy the error
          details below and share them with the developer team.
        </p>

        <Card className="mt-6 p-5">
          <div className="text-label font-normal text-muted">
            Error ID: <span className="font-semibold text-text">{reportId}</span>
          </div>
          <div className="text-sm font-semibold text-text">Error message</div>
          <p className="mt-2 text-body text-text break-words">{message}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => {
                void copyToClipboard(report).then((ok) =>
                  setCopied(ok ? "ok" : "fail"),
                );
              }}
            >
              Copy error report
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${reportId}.txt`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              }}
            >
              Download report
            </Button>
            <Button variant="secondary" type="button" onClick={onReset}>
              Try again
            </Button>
            <Button variant="outline" type="button" onClick={() => location.assign(PATHS.login)}>
              Go to login
            </Button>
          </div>

          {copied ? (
            <p className="mt-3 text-label font-normal text-muted">
              {copied === "ok"
                ? "Copied to clipboard."
                : "Copy failed. Select the text below and copy manually."}
            </p>
          ) : null}

          <details className="mt-5 rounded-xl border border-[color:var(--card-border)] bg-bg p-3">
            <summary className="text-sm font-semibold text-text">
              Technical details (expand)
            </summary>
            <pre className="mt-3 max-h-[360px] overflow-auto whitespace-pre-wrap break-words text-[12px] leading-snug text-text">
{`# ${reportId}\n\n${report}`}
            </pre>
          </details>
        </Card>

        <p className="mt-6 text-label font-normal text-muted">
          Tip: reproduce the issue and paste the report into your bug ticket. It
          includes URL, theme, browser, and stack traces when available.
        </p>
      </div>
    </main>
  );
}
