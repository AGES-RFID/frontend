import { useState } from "react";
import {
  LayoutDashboard,
  Car,
  Users,
  Radio,
  CreditCard,
  Settings,
} from "lucide-react";

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

type ButtonSidebarProps = {
  items: MenuItem[];
};

const menuItens: MenuItem[] = [
  { id: "dashboard", label: "DASHBOARD", icon: <LayoutDashboard /> },
  { id: "veiculos", label: "VEÍCULOS", icon: <Car /> },
  { id: "usuarios", label: "USUÁRIOS", icon: <Users /> },
  { id: "tags", label: "TAGS", icon: <Radio /> },
  { id: "cobranca", label: "COBRANÇA", icon: <CreditCard /> },
  { id: "sistema", label: "SISTEMA", icon: <Settings /> },
];

export const buttonSidebar: React.FC = () => {
  const [active, setActive] = useState("dashboard");
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex w-64 flex-col gap-2 bg-[#234A6B] p-4">
      {menuItens.map((item) => {
        const isActive = active === item.id;
        const isHovered = hovered === item.id;

        return (
          <button
            type="button"
            key={item.id}
            onClick={() => setActive(item.id)}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 font-medium text-sm transition-all duration-200 ${
              isActive
                ? "bg-[#5A7696] text-white"
                : isHovered
                  ? "bg-[#2A4D6E] text-white"
                  : "text-gray-200"
            }
                        `}
          >
            {/* Ícone */}
            <span
              className={`flex w-6 items-center justify-center text-xl transition-all duration-200 ${
                isHovered || isActive ? "scale-110" : ""
              }
              `}
            >
              {item.icon}
            </span>

            {/* Texto */}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
