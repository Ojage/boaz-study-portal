import { useMemo, useState } from "react";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export function SettingsMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  const panelId = useMemo(
    () => `settings-menu-${Math.random().toString(16).slice(2)}`,
    [],
  );

  return (
    <div
      className={clsx("fixed bottom-4 right-4 z-50", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="relative">
        <Button
          type="button"
          variant="ghost"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          className="min-w-0  rounded-full p-0 shadow-soft"
          title="Settings"
        >
          <Icon icon={Cog6ToothIcon} />
        </Button>

        <div
          id={panelId}
          role="menu"
          className={clsx(
            "absolute bottom-full right-0 mb-2 w-[240px] origin-bottom-right transition",
            open ? "pointer-events-auto opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95",
          )}
        >
          <Card className="p-3">
            <div className="grid gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

