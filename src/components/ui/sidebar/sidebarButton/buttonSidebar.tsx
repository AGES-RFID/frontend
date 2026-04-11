import { useState } from "react";
import {
  LayoutDashboard,
  Car,
  Users,
  Radio,
  CreditCard,
  Settings,
} from "lucide-react";

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

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 font-medium text-sm transition-all duration-200 ${
        isActive
          ? hovered
            ? "bg-light-blue text-white"
            : "bg-blue text-white"
          : hovered
            ? "bg-dark-blue-50 text-white"
            : "text-white"
      }
                        `}
    >
      {/* Ícone */}
      <span
        className={`flex w-6 items-center justify-center text-xl transition-all duration-200 ${
          hovered || isActive ? "scale-110" : ""
        }
              `}
        style={{ color }}
      >
        {icon}
      </span>

      {/* Texto */}
      <span>{label}</span>
    </button>
  );
}

