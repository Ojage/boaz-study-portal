import { NavLink, Outlet } from "react-router-dom";
import { ProtectedComponent } from "../../components/ProtectedComponent";
import { Logo } from "../../components/shared/Logo";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { useAuth } from "../../hooks/useAuth";
import { PATHS } from "../../router/paths";
import {
  BellIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "rounded-xl px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-[color:var(--nav-active-bg)] text-[color:var(--nav-active-fg)]"
      : "text-muted hover:bg-tertiary/20 hover:text-text",
  ].join(" ");
}

export function MainLayout() {
  const { user, logout } = useAuth();
  const { t } = useTranslation("translation");

  return (
    <div className="min-h-[100svh]">
      <header className="border-b border-border bg-card/70 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <Logo heightPx={28} />
                <div className="font-semibold text-text">StudyPortal</div>
              </div>
              <div className="truncate text-xs text-muted">
                {user ? t("portals.header.subtitle", { name: user.fullName, spaceId: user.activeSpaceId }) : ""}
              </div>
            </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={logout}>
              <Icon icon={ArrowRightOnRectangleIcon} />
              {t("common.logout")}
            </Button>
          </div>
        </div>

          <nav className="mt-3 flex flex-wrap gap-2">
            <NavLink to={PATHS.app.tickets} className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Icon icon={TicketIcon} />
                {t("common.tickets")}
              </span>
            </NavLink>
            <NavLink to={PATHS.app.documents} className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Icon icon={DocumentTextIcon} />
                {t("common.documents")}
              </span>
            </NavLink>
            <NavLink to={PATHS.app.notifications} className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Icon icon={BellIcon} />
                {t("common.notifications")}
              </span>
            </NavLink>
          <ProtectedComponent permissions="ticket:delete" fallback={null}>
              <NavLink to={PATHS.admin.root} className={navLinkClass}>
                <span className="flex items-center gap-2">
                  <Icon icon={ShieldCheckIcon} />
                  {t("common.admin")}
                </span>
              </NavLink>
          </ProtectedComponent>
        </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-5 text-left">
        <Outlet />
      </div>
    </div>
  );
}
