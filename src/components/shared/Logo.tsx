import type { ImgHTMLAttributes } from "react";
import clsx from "clsx";
import boazLogo from "../../assets/images/boaz_logo.png";
import boazLogo2 from "../../assets/images/boaz_logo_2.png";

export type LogoVariant = "boaz-study" | "boaz-study-blue";

export interface LogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  variant?: LogoVariant;
  heightPx?: number;
  alt?: string;
  src?: string;
}

export function Logo({
  variant = "boaz-study",
  heightPx = 40,
  className,
  style,
  src,
  alt,
  ...props
}: LogoProps) {
  const resolvedSrc = src ?? (variant === "boaz-study" ? boazLogo : boazLogo2);
  const resolvedAlt = alt ?? "BOAZ-STUDY";

  return (
    <img
      {...props}
      src={resolvedSrc}
      alt={resolvedAlt}
      loading="eager"
      className={clsx("w-auto", className)}
      style={{ height: heightPx, ...style }}
    />
  );
}

