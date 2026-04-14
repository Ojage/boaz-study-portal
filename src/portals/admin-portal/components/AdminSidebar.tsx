import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../../../components/ui/Icon";
import { Logo } from "../../../components/shared/Logo";
import {
  BuildingOffice2Icon,
  ChartBarSquareIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  HomeIcon,
  Squares2X2Icon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { AdminNavItem } from "./AdminNavItem";
import { PATHS } from "../../../router/paths";

export function AdminSidebar() {
  const { t } = useTranslation("translation");

  const items = useMemo(
    () => [
      { to: PATHS.admin.root, icon: <Icon icon={HomeIcon} />, label: t("admin.nav.home") },
      {
        to: PATHS.admin.organization,
        icon: <Icon icon={BuildingOffice2Icon} />,
        label: t("admin.nav.organization"),
      },
      { to: PATHS.admin.services, icon: <Icon icon={Squares2X2Icon} />, label: t("admin.nav.services") },
      { to: PATHS.admin.subscriptions, icon: <Icon icon={CreditCardIcon} />, label: t("admin.nav.subscriptions") },
      { to: PATHS.admin.proofs, icon: <Icon icon={DocumentCheckIcon} />, label: t("admin.nav.proofs") },
      { to: PATHS.admin.affiliation, icon: <Icon icon={UsersIcon} />, label: t("admin.nav.affiliation") },
    ],
    [t],
  );

  return (
    <aside className="w-[260px] shrink-0">
      <div className="rounded-3xl border border-[color:var(--card-border)] bg-[color:var(--card)] p-4 shadow-card">
        <div className="flex items-center ml-13 gap-3  px-2 py-2">
          <Logo variant="boaz-study-blue" heightPx={44} />
        </div>

        <nav className="mt-4 grid gap-1">
          {items.map((it) => (
            <AdminNavItem key={it.to} to={it.to} icon={it.icon} label={it.label} />
          ))}
        </nav>

        <div className="my-5 flex items-center gap-3 px-2">
          <div className="h-px flex-1 bg-[color:var(--card-border)]" />
          <span className="text-[10px] font-semibold tracking-widest text-muted">
            {t("admin.nav.general")}
          </span>
          <div className="h-px flex-1 bg-[color:var(--card-border)]" />
        </div>

        <nav className="grid gap-1">
          <AdminNavItem
            to={PATHS.admin.profile}
            icon={<Icon icon={UserCircleIcon} />}
            label={t("admin.nav.profile")}
          />
          <AdminNavItem
            to={PATHS.admin.dashboard}
            icon={<Icon icon={ChartBarSquareIcon} />}
            label={t("admin.nav.dashboard")}
          />
          <AdminNavItem
            to={PATHS.admin.settings}
            icon={<Icon icon={Cog6ToothIcon} />}
            label={t("admin.nav.settings")}
          />
        </nav>
      </div>
    </aside>
  );
}
