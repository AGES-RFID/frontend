import { ButtonSidebar, type MenuItem } from "./sidebarButton/buttonSidebar";
import impinjLogo from "../../../../public/impinj-logo.png"
import {
  LayoutDashboard,
  Car,
  Users,
  Radio,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "DASHBOARD",
    icon: <LayoutDashboard size={28} />,
  },
  {
    id: "veiculos",
    label: "VEÍCULOS",
    icon: <Car size={28} />,
  },
  {
    id: "usuarios",
    label: "USUÁRIOS",
    icon: <Users size={28} />,
  },
  {
    id: "etiquetas",
    label: "ETIQUETAS",
    icon: <Radio size={28} />,
  },
  {
    id: "cobranca",
    label: "COBRANÇA",
    icon: <CreditCard size={28} />,
  },
  {
    id: "sistema",
    label: "SISTEMA",
    icon: <Settings size={28} />,
  },
];

export function SidebarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("dashboard");
  return (
    <aside className="flex h-screen w-[300px] flex-col bg-dark-blue px-4 py-6">
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="mb-8 flex justify-center hover:opacity-90"
      >
        <img
          src={impinjLogo}
          alt="Logo Impinj"
          className="w-[180px] object-contain"
        />
      </button>

      <div className="flex flex-1 flex-col justify-between">
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <ButtonSidebar
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activeItem === item.id}
              onClick={() => setActiveItem(item.id)}
            />
          ))}
        </nav>

        <div className="mt-8">
          <ButtonSidebar
            label="SAIR"
            icon={<LogOut size={28} />}
            isActive={false}
            onClick={() => navigate("/login")}
          />
        </div>
      </div>
    </aside>
  );
}