import { useTranslation } from "react-i18next";
import avatar from "../../../assets/images/user_avatar.png";
import { Card } from "../../../components/ui/Card";
import { Icon } from "../../../components/ui/Icon";
import { BuildingOfficeIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../hooks/useAuth";

export function AdminTopbar({ title }: { title: string }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Card className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-5 md:py-4">
      <div className="text-base font-bold text-[color:var(--primary)] md:text-lg">
        {title}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-2xl  bg-[color:var(--card)] px-3 py-2 text-sm text-muted md:flex">
          <Icon icon={BuildingOfficeIcon} />
          <span>{t("admin.topbar.organization")}</span>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-[color:var(--card)] px-3 py-2">
          <img src={avatar} alt="" className="h-8 w-8 rounded-full" />
          <div className="hidden text-left md:block">
            <div className="text-sm font-semibold text-text">{user?.fullName ?? "—"}</div>
            <div className="text-xs text-muted">{t("admin.topbar.role")}</div>
          </div>
          <Icon icon={ChevronDownIcon} className="border border-[color:var(--card-border)] rounded-2xl bg-[color:var(--card)] h-4 w-4 text-muted" />
        </div>
      </div>
    </Card>
  );
}
