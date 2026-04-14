import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  CreditCardIcon,
  DocumentCheckIcon,
  HomeIcon,
  ReceiptPercentIcon,
  UserGroupIcon,
  WalletIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Icon } from "../../../components/ui/Icon";
import { Logo } from "../../../components/shared/Logo";
import { PATHS } from "../../../router/paths";
import { StudentNavItem } from "./StudentNavItem";

export function StudentSidebar() {
  const { t } = useTranslation("translation");

  const items = useMemo(
    () => [
      { to: PATHS.app.root, icon: <Icon icon={HomeIcon} />, label: t("student.nav.home"), end: true },
      { to: PATHS.app.subscriptions.services, icon: <Icon icon={CreditCardIcon} />, label: t("student.nav.subscriptions.services") },
      { to: PATHS.app.subscriptions.financing, icon: <Icon icon={CreditCardIcon} />, label: t("student.nav.subscriptions.financing") },
      { to: PATHS.app.subscriptions.repayments, icon: <Icon icon={CreditCardIcon} />, label: t("student.nav.subscriptions.repayments") },
      { to: PATHS.app.proofs, icon: <Icon icon={DocumentCheckIcon} />, label: t("student.nav.proofs") },
      { to: PATHS.app.wallet, icon: <Icon icon={WalletIcon} />, label: t("student.nav.wallet") },
      { to: PATHS.app.affiliation, icon: <Icon icon={UserGroupIcon} />, label: t("student.nav.affiliation") },
      { to: PATHS.app.invoices, icon: <Icon icon={ReceiptPercentIcon} />, label: t("student.nav.invoices") },
      { to: PATHS.app.settings, icon: <Icon icon={Cog6ToothIcon} />, label: t("student.nav.settings") },
    ],
    [t],
  );

  return (
    <aside className="w-[260px] shrink-0">
      <div className="rounded-3xl border border-[color:var(--card-border)] bg-[color:var(--card)] p-4 shadow-card">
        <div className="flex items-center ml-13 gap-3 px-2 py-2">
          <Logo variant="boaz-study-blue" heightPx={44} />
        </div>

        <nav className="mt-4 grid gap-1">
          {items.map((it) => (
            <StudentNavItem key={it.to} to={it.to} icon={it.icon} label={it.label} end={it.end} />
          ))}
        </nav>
      </div>
    </aside>
  );
}

