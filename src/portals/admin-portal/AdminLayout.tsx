import { Outlet, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminTopbar } from "./components/AdminTopbar";
import { PATHS } from "../../router/paths";

function useAdminTitle(): string {
  const { pathname } = useLocation();
  const { t } = useTranslation("translation");

  return useMemo(() => {
    if (pathname === PATHS.admin.root || pathname === `${PATHS.admin.root}/`) return t("admin.titles.home");
    if (pathname.startsWith(PATHS.admin.profile)) return t("admin.titles.profile");
    if (pathname.startsWith(PATHS.admin.settings)) return t("admin.titles.settings");
    if (pathname.startsWith(PATHS.admin.dashboard)) return t("admin.titles.dashboard");
    if (pathname.startsWith(PATHS.admin.services)) return t("admin.titles.services");
    if (pathname.startsWith(PATHS.admin.subscriptions)) return t("admin.titles.subscriptions");
    if (pathname.startsWith(PATHS.admin.organization)) return t("admin.titles.organization");
    if (pathname.startsWith(PATHS.admin.proofs)) return t("admin.titles.proofs");
    if (pathname.startsWith(PATHS.admin.affiliation)) return t("admin.titles.affiliation");
    return t("admin.titles.home");
  }, [pathname, t]);
}

export function AdminLayout() {
  const title = useAdminTitle();

  return (
    <div className="min-h-[100svh] bg-bg">
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          <div className="hidden md:block">
            <AdminSidebar />
          </div>

          <main className="min-w-0 flex-1">
            <AdminTopbar title={title} />
            <div className="mt-5">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
