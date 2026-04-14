import { useTranslation } from "react-i18next";
import avatar from "../../../assets/images/user_avatar.png";
import { Card } from "../../../components/ui/Card";
import { Icon } from "../../../components/ui/Icon";
import { BuildingOfficeIcon, ChevronDownIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../hooks/useAuth";
import { useState, useRef, useEffect } from "react";

export function AdminTopbar({ title }: { title: string }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        <div className="relative" ref={dropdownRef}>
          <button 
            className={`flex items-center gap-3 rounded-2xl bg-[color:var(--card)] px-3 py-2 cursor-pointer transition-colors hover:bg-[color:var(--hover)] ${dropdownOpen ? 'ring-2 ring-[color:var(--primary)]' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img src={avatar} alt="" className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="hidden text-left md:block">
              <div className="text-sm font-semibold text-text">{user?.fullName ?? "—"}</div>
              <div className="text-xs text-muted">{t("admin.topbar.role")}</div>
            </div>
            <Icon icon={ChevronDownIcon} className={`border border-[color:var(--card-border)] rounded-2xl bg-[color:var(--card)] h-4 w-4 text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[color:var(--card-border)] bg-[color:var(--card)] py-1 shadow-card z-50">
              <button 
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text hover:bg-[color:var(--hover)] hover:text-red-500 transition-colors cursor-pointer"
              >
                <Icon icon={ArrowRightOnRectangleIcon} />
                <span>{t("common.logout")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
