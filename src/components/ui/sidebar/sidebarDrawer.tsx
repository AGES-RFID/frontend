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

export function SidebarDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/") return "dashboard";
    if (path.startsWith("/veiculos")) return "veiculos";
    if (path.startsWith("/usuarios")) return "usuarios";
    if (path.startsWith("/etiquetas")) return "etiquetas";
    if (path.startsWith("/cobranca")) return "cobranca";
    if (path.startsWith("/sistema")) return "sistema";
    return "dashboard";
  };
  
  const activeItem = getActiveItem();
  
  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "veiculos":
        navigate("/veiculos");
        break;
      case "usuarios":
        navigate("/usuarios");
        break;
      case "etiquetas":
        navigate("/etiquetas");
        break;
      case "cobranca":
        navigate("/cobranca");
        break;
      case "sistema":
        navigate("/sistema");
        break;
      default:
        navigate("/dashboard");
    }
  };
  return (
    <aside className="flex min-h-screen w-[300px] flex-col bg-dark-blue px-4 py-6">
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
              onClick={() => handleNavigation(item.id)}
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