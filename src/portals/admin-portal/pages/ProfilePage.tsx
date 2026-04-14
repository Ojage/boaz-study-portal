import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import avatar from "../../../assets/images/user_avatar.png";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Icon } from "../../../components/ui/Icon";
import { TextField } from "../../../components/ui/TextField";
import { useAuth } from "../../../hooks/useAuth";
import { parseJwtPayload } from "../../../utils/jwt";
import { ClipboardIcon, KeyIcon, UserCircleIcon } from "@heroicons/react/24/outline";

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ProfilePage() {
  const { t } = useTranslation("translation");
  const { user, token } = useAuth();

  const payload = useMemo(() => (token ? parseJwtPayload(token) : null), [token]);
  const roles = useMemo(() => {
    const value = payload?.roles;
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value as string[];
    return [];
  }, [payload]);
  const authorities = useMemo(() => {
    const value = payload?.authorities;
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value as string[];
    return user?.authorities ?? [];
  }, [payload, user?.authorities]);

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [copied, setCopied] = useState<null | "ok" | "fail">(null);

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card className="p-5 md:p-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-tertiary/25">
            <Icon icon={UserCircleIcon} className="h-7 w-7 text-[color:var(--nav-active-fg)]" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-base font-bold text-text">{t("admin.profile.title")}</div>
            <div className="truncate text-label font-normal text-muted">
              {t("admin.profile.subtitle")}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[color:var(--card-border)] bg-bg p-4">
          <img src={avatar} alt="" className="h-12 w-12 rounded-full" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-text">{user?.fullName ?? "—"}</div>
            <div className="truncate text-label font-normal text-muted">{user?.email ?? "—"}</div>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--card)] p-4">
            <div className="text-label font-normal text-muted">{t("admin.profile.username")}</div>
            <div className="mt-2 break-words text-body text-text">{user?.username ?? "—"}</div>
          </div>
          <div className="rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--card)] p-4">
            <div className="text-label font-normal text-muted">{t("admin.profile.space")}</div>
            <div className="mt-2 break-words text-body text-text">{user?.activeSpaceId ?? "—"}</div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold text-text">{t("admin.profile.permissions")}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {authorities.length ? (
              authorities.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-[color:var(--card-border)] bg-bg px-3 py-1 text-[12px] font-semibold text-text"
                >
                  {a}
                </span>
              ))
            ) : (
              <span className="text-body text-muted">—</span>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        <Card className="p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-base font-bold text-text">{t("admin.profile.details")}</div>
              <div className="mt-2 text-body text-muted">{t("admin.profile.detailsHint")}</div>
            </div>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setFullName(user?.fullName ?? "");
                setEmail(user?.email ?? "");
              }}
            >
              {t("admin.profile.reset")}
            </Button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <TextField
              label={t("admin.profile.fullName")}
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextField
              label={t("admin.profile.email")}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => {
                // No backend yet; update will be wired when API layer is implemented.
                setCopied(null);
              }}
            >
              {t("admin.profile.save")}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                const toCopy = JSON.stringify({ roles, authorities }, null, 2);
                void copyToClipboard(toCopy).then((ok) => setCopied(ok ? "ok" : "fail"));
              }}
            >
              <Icon icon={ClipboardIcon} />
              {t("admin.profile.copyPerms")}
            </Button>
            {token ? (
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  void copyToClipboard(token).then((ok) => setCopied(ok ? "ok" : "fail"));
                }}
              >
                <Icon icon={KeyIcon} />
                {t("admin.profile.copyToken")}
              </Button>
            ) : null}
          </div>

          {copied ? (
            <p className="mt-3 text-label font-normal text-muted">
              {copied === "ok" ? t("admin.profile.copied") : t("admin.profile.copyFailed")}
            </p>
          ) : null}
        </Card>

        <Card className="p-5 md:p-6">
          <div className="text-sm font-semibold text-text">{t("admin.profile.roles")}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {roles.length ? (
              roles.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-[color:var(--card-border)] bg-bg px-3 py-1 text-[12px] font-semibold text-text"
                >
                  {r}
                </span>
              ))
            ) : (
              <span className="text-body text-muted">—</span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

