import type { ComponentPropsWithoutRef, ElementType } from "react";
import clsx from "clsx";

export type IconComponent = ElementType<ComponentPropsWithoutRef<"svg">>;

export function Icon({
  icon: IconSvg,
  className,
  ...props
}: { icon: IconComponent } & ComponentPropsWithoutRef<"svg">) {
  return (
    <IconSvg
      aria-hidden="true"
      {...props}
      className={clsx("h-5 w-5 shrink-0", className)}
    />
  );
}
