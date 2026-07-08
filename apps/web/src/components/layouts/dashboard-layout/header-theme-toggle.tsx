"use client";

import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/use-theme-store";
import { HeaderBtn } from "./header-btn";

export function HeaderThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <HeaderBtn
      tooltip={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <Moon className="h-[18px] w-[18px]" />
      ) : (
        <Sun className="h-[18px] w-[18px]" />
      )}
    </HeaderBtn>
  );
}
