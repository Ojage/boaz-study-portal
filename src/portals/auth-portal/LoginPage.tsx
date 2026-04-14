import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { PasswordField } from "../../components/ui/PasswordField";
import { Logo } from "../../components/shared/Logo";
import { useAuth } from "../../hooks/useAuth";
import { MOCK_PROFILES } from "../../services/mock/auth.mock";
import { useTranslation } from "react-i18next";
import { parseJwtPayload } from "../../utils/jwt";
import { PATHS } from "../../router/paths";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, token, user, error, loginWithCredentials } = useAuth();
  const { t } = useTranslation("translation");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const profiles = useMemo(() => MOCK_PROFILES, []);

  useEffect(() => {
    if (!token) return;
    const from = (location.state as { from?: string } | null)?.from;
    const tokenAuthorities = (() => {
      const payload = parseJwtPayload(token);
      const value = payload?.authorities;
      if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
        return value as string[];
      }
      return null;
    })();
    const authorities = tokenAuthorities ?? user?.authorities ?? [];
    const isAdmin = authorities.includes("ticket:delete");
    const defaultPath = isAdmin ? PATHS.admin.root : PATHS.app.root;
    const shouldOverrideFromToAdmin =
      isAdmin && (!from || from === PATHS.app.root || from.startsWith(`${PATHS.app.root}/`));
    navigate(shouldOverrideFromToAdmin ? PATHS.admin.root : (from ?? defaultPath), {
      replace: true,
    });
  }, [location.state, navigate, token, user?.authorities]);

  const disabled = status === "authenticating";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(null);
    if (!login.trim() || !password) {
      setLocalError(t("auth.errors.missingFields"));
      return;
    }
    await loginWithCredentials(login, password);
  }

  return (
    <main className="min-h-[100svh] bg-bg">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <section className="text-left">
            <Logo heightPx={120} />
            <h1 className="mt-6">{t("auth.title")}</h1>
            <p className="mt-4 text-body text-muted">{t("auth.subtitle")}</p>

            <div className="mt-6">
              <p className="text-label font-normal text-muted">
                {t("auth.demoProfiles")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {profiles.map((p) => (
                  <Button
                    key={p.code}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => {
                      setLogin(p.username);
                      setPassword(p.password);
                    }}
                  >
                    {p.code}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          <Card className="w-full p-6 md:p-8">
            <form className="grid gap-4" onSubmit={(e) => void onSubmit(e)}>
              <div>
                <h2 className="text-header font-heading font-bold text-text">
                  {t("auth.form.title")}
                </h2>
                <p className="mt-2 text-body text-muted">
                  {t("auth.form.subtitle")}
                </p>
              </div>

              {localError || error ? (
                <div className="rounded-xl border border-[color:var(--card-border)] bg-tertiary/10 p-3 text-body text-red-700">
                  {localError ??
                    (error === "Invalid credentials"
                      ? t("auth.errors.invalidCredentials")
                      : error)}
                </div>
              ) : null}

              <TextField
                label={t("auth.form.loginLabel")}
                name="login"
                autoComplete="username"
                placeholder={t("auth.form.loginPlaceholder")}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />

              <PasswordField
                label={t("auth.form.passwordLabel")}
                name="password"
                placeholder={t("auth.form.passwordPlaceholder")}
                value={password}
                onChange={setPassword}
                disabled={disabled}
              />

              <Button disabled={disabled} type="submit" className="mt-1 w-full">
                {disabled ? t("common.signingIn") : t("common.signIn")}
              </Button>
              <p className="text-label font-normal text-muted">{t("auth.note")}</p>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
