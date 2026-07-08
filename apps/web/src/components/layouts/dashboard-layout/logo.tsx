import Image from "next/image";

interface LogoProps {
  theme?: "light" | "dark";
  className?: string;
}

/**
 * WareFlow wordmark.
 * theme="light" → logo for light backgrounds (dark-coloured text)
 * theme="dark"  → logo for dark backgrounds (white-coloured text)
 */
export function Logo({ theme = "light", className }: LogoProps) {
  const src = theme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <div className={className}>
      <Image src={src} alt="WareFlow" width={200} height={35} priority />
    </div>
  );
}
