import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { useAuth } from "../../hooks/useAuth";
import { PATHS } from "../../router/paths";
import {
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { StudentSidebar } from "./components/StudentSidebar";
import { SettingsMenu } from "../../components/shared/SettingsMenu";

function useStudentTitle(): string {
  const { pathname } = useLocation();
  const { t } = useTranslation("translation");
  return useMemo(() => {
    if (pathname === PATHS.app.root || pathname === `${PATHS.app.root}/`) return t("student.titles.home");
    if (pathname.startsWith(PATHS.app.subscriptions.root)) return t("student.titles.subscriptions");
    if (pathname.startsWith(PATHS.app.proofs)) return t("student.titles.proofs");
    if (pathname.startsWith(PATHS.app.wallet)) return t("student.titles.wallet");
    if (pathname.startsWith(PATHS.app.affiliation)) return t("student.titles.affiliation");
    if (pathname.startsWith(PATHS.app.invoices)) return t("student.titles.invoices");
    if (pathname.startsWith(PATHS.app.settings)) return t("student.titles.settings");
    if (pathname.startsWith(PATHS.app.subscribe.root)) return t("student.titles.subscribe");
    if (pathname.startsWith(PATHS.app.financingNew)) return t("student.titles.financingNew");
    return t("student.titles.home");
  }, [pathname, t]);
}

export function MainLayout() {
  const { user, logout } = useAuth();
  const { t } = useTranslation("translation");
  const title = useStudentTitle();
  const navigate = useNavigate();

  return (
    <div className="min-h-[100svh] bg-bg">
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          <div className="hidden md:block">
            <StudentSidebar />
          </div>

          <main className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3 rounded-3xl border border-[color:var(--card-border)] bg-[color:var(--card)] p-4 shadow-card">
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {t("student.topbar.portal")}
                </div>
                <div className="truncate text-xl font-bold text-text">{title}</div>
                <div className="truncate text-xs text-muted">
                  {user ? t("portals.header.subtitle", { name: user.fullName, spaceId: user.activeSpaceId }) : ""}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => navigate(PATHS.admin.root)}>
                  <Icon icon={ShieldCheckIcon} />
                  {t("common.admin")}
                </Button>
                <Button variant="secondary" onClick={logout}>
                  <Icon icon={ArrowRightOnRectangleIcon} />
                  {t("common.logout")}
                </Button>
              </div>
            </div>

            <div className="mt-5 text-left">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <SettingsMenu />
    </div>
  );
}
