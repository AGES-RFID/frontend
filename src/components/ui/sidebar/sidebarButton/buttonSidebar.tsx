import { useState } from "react";

export type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

type ButtonSidebarProps = {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  color?: string;
};

export function ButtonSidebar({
  label,
  icon,
  isActive,
  onClick,
  color = "#FFFFFF",
}: ButtonSidebarProps) {
  const [hovered, setHovered] = useState(false);
  const isInteractive = label !== "SAIR";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex h-14 w-full cursor-pointer items-center gap-4 rounded-xl px-4 font-medium text-sm transition-all duration-300 ease-out ${
        isInteractive ? "relative z-10" : ""
      } ${
        isActive ? "text-white" : hovered ? "text-white" : "text-white/80"
      } ${hovered ? "-translate-y-0.5 bg-white/10" : "bg-transparent"}`}
    >
      <span
        className={`flex w-6 items-center justify-center text-xl transition-transform duration-200 ${
          hovered || isActive ? "scale-110" : ""
        }`}
        style={{ color }}
      >
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}
