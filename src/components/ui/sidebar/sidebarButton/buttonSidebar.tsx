import { useState } from "react";

//type MenuItem = {
//    id: string;
//    label: string;
//    icon: React.ReactNode;
//};
//type ButtonSidebarProps = {
//    items: MenuItem[];
//};

// const menuItens: MenuItem = [
//    { id: "dashboard", label: "DASHBOARD", icon: <LayoutDashboard /> },
//    { id: "veiculos", label: "VEÍCULOS", icon: <Car /> },
//    { id: "usuarios", label: "USUÁRIOS", icon: <Users /> },
//    { id: "tag", label: "TAG", icon: <Radio /> },
//   { id: "cobranca", label: "COBRANÇA", icon: <CreditCard /> },
//   { id: "sistema", label: "SISTEMA", icon: <Settings /> },
//];

type ButtonSidebarItemProps = {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
  color?: string;
};

export const ButtonSidebar: React.FC<ButtonSidebarItemProps> = ({
  label,
  icon,
  isActive,
  onClick,
  color = "dark-blue",
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 font-medium text-sm transition-all duration-200 ${
        isActive
          ? "bg-dark-blue text-white"
          : hovered
            ? "bg-blue text-white"
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
};
