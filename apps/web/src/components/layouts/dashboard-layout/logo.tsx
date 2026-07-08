import Image from "next/image";

interface LogoProps {
  variant?: "light" | "dark";
}

/** WareFlow wordmark with icon. Use `light` on dark backgrounds. */
export function Logo({ variant = "dark" }: LogoProps) {
  return (
    <div
      className={
        variant === "light"
          ? "inline-flex items-center rounded-xl bg-white px-4 py-2"
          : "flex items-center"
      }
    >
      <Image src="/wareflow-logo-full.png" alt="WareFlow" width={180} height={48} priority />
    </div>
  );
}
