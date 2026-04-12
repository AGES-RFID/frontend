import { ButtonSidebar, type MenuItem } from "./sidebarButton/buttonSidebar";
import impinjLogo from "../../../../public/impinj-logo.png";
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
    if (path === "/admin/dashboard" || path === "/") return "dashboard";
    if (path.startsWith("/admin/vehicules")) return "veiculos";
    if (path.startsWith("/admin/users")) return "usuarios";
    if (path.startsWith("/admin/labels")) return "etiquetas";
    if (path.startsWith("/admin/payments")) return "cobranca";
    if (path.startsWith("/admin/system")) return "sistema";
    return "dashboard";
  };

  const activeItem = getActiveItem();

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        navigate("/admin/dashboard");
        break;
      case "veiculos":
        navigate("/admin/vehicules");
        break;
      case "usuarios":
        navigate("/admin/users");
        break;
      case "etiquetas":
        navigate("/admin/labels");
        break;
      case "cobranca":
        navigate("/admin/payments");
        break;
      case "sistema":
        navigate("/admin/system");
        break;
      default:
        navigate("/admin/dashboard");
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
