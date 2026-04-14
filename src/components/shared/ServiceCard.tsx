import type { ReactNode } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export interface ServiceCardProps {
  title: string;
  imageSrc: string;
  icon: ReactNode;
  onSubscribe?: () => void;
  className?: string;
  buttonLabelKey?: string;
}

export function ServiceCard({
  title,
  imageSrc,
  icon,
  onSubscribe,
  className,
  buttonLabelKey = "admin.services.subscribe",
}: ServiceCardProps) {
  const { t } = useTranslation("translation");
  return (
    <Card padded={false} className={clsx("overflow-hidden", className)}>
      <div className="relative">
        <div className="relative aspect-[4/3] w-full">
          <img src={imageSrc} alt="" className="h-full w-full object-cover" loading="lazy" />

          <div className="absolute inset-0 bg-[#0000008C]" />
          <div className="absolute inset-0" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <div className="mb-3 text-white/90">{icon}</div>
            <div className="w-[70%] text-base font-bold leading-tight text-white md:text-[24px]">
              {title}
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={onSubscribe}
          className="h-auto min-h-[70px] w-full min-w-0 rounded-none rounded-b-2xl border-0 px-4 py-3 text-base font-bold text-white shadow-none hover:translate-y-0 bg-[#F88206] hover:bg-[#ff9a00] active:translate-y-0 active:bg-[#f08f00] md:text-[24px]"
          style={{ backgroundColor: "#F88206" }}
        >
          {t(buttonLabelKey)}
        </Button>
      </div>
    </Card>
  );
}

