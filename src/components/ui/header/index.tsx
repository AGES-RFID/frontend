import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import { LayoutDashboard, LogOut, House, Wallet, User } from "lucide-react";
import { HeaderButton } from "@/components/ui/header-button";
import { cn } from "@/utils/cn";
import impinjLogo from "../../../../public/impinj-logo.png";

// ─── Types ────────────────────────────────────────────────────────────────────

type HeaderType = "default" | "logo";

type HeaderProps = {
  type?: HeaderType;
  isLogged?: boolean;
  onAuthAction?: () => void;
  className?: string;
};

type HeaderNavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

// ─── Auth Button ──────────────────────────────────────────────────────────────

function AuthButton({
  isLogged,
  onAuthAction,
}: {
  isLogged: boolean;
  onAuthAction?: () => void;
}) {
  const label = isLogged ? "Sair" : "Entrar/Cadastrar";

  return (
    <button
      type="button"
      onClick={onAuthAction}
      aria-label={label}
      data-testid="header-auth-button"
      className={cn(
        "inline-flex items-center gap-3.5 whitespace-nowrap px-6 py-3",
        "font-['Roboto'] font-semibold text-[18px] text-white leading-none",
        "rounded-[100px]",
        "transition-all duration-200 ease-in-out",
        "hover:bg-white/15 active:scale-95 active:bg-white/25",
        "cursor-pointer",
      )}
    >
      {!isLogged && <LogOut className="h-6 w-6 shrink-0" />}
      <span>{label}</span>
      {isLogged && <LogOut className="h-6 w-6 shrink-0" />}
    </button>
  );
}

function AdminButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Admin"
      data-testid="header-admin-button"
      className={cn(
        "inline-flex items-center gap-3.5 whitespace-nowrap px-6 py-3",
        "font-['Roboto'] font-semibold text-[18px] text-white leading-none",
        "rounded-[100px] border-2 border-white",
        "transition-all duration-200 ease-in-out",
        "hover:bg-white/15 active:scale-95 active:bg-white/25",
        "cursor-pointer",
      )}
    >
      <LayoutDashboard className="h-6 w-6 shrink-0" />
      <span>Admin</span>
    </button>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header({
  type = "default",
  isLogged = false,
  onAuthAction,
  className,
}: Readonly<HeaderProps>) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = useMemo<HeaderNavItem[]>(
    () => [
      {
        path: "/",
        label: "Home",
        icon: <House className="h-6 w-6 shrink-0" />,
      },
      {
        path: "/payments",
        label: "Pagamentos",
        icon: <Wallet className="h-6 w-6 shrink-0" />,
      },
      {
        path: "/profile",
        label: "Perfil",
        icon: <User className="h-6 w-6 shrink-0" />,
      },
    ],
    [],
  );

  const isActive = (path: string) => location.pathname === path;
  // ── Logo Only ──────────────────────────────────────────────────────────────
  if (type === "logo") {
    return (
      <header
        data-testid="header"
        data-variant="logo"
        className={cn(
          "flex h-24 w-full items-center justify-center px-6",
          "bg-[#173F67]",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Ir para Home"
          className="cursor-pointer rounded-md transition-all duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:scale-95 active:opacity-60"
        >
          <img src={impinjLogo} alt="Impinj" className="h-16 w-auto" />
        </button>
      </header>
    );
  }

  // ── Default ────────────────────────────────────────────────────────────────
  return (
    <header
      data-testid="header"
      data-variant="default"
      className={cn(
        "flex h-24 w-full items-center px-6",
        "bg-[#173F67]",
        className,
      )}
    >
      {/* Logo — left slot */}
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Ir para Home"
        className="mr-12 shrink-0 cursor-pointer rounded-md transition-all duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:scale-95 active:opacity-60"
      >
        <img src={impinjLogo} alt="Impinj" className="h-16 w-auto" />
      </button>

      {/* Nav buttons — center (grows to fill remaining space) */}
      <nav
        aria-label="Navegação principal"
        className="flex flex-1 items-center justify-center gap-6"
      >
        {navItems.map((item) => (
          <HeaderButton
            key={item.path}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.path)}
            action={() => navigate(item.path)}
            className="relative"
          />
        ))}
      </nav>

      <div className="flex shrink-0 justify-end pr-4">
        <AdminButton onClick={() => navigate("/admin/dashboard")} />
      </div>

      {/*
        Auth button — right slot with fixed minimum width so the nav buttons
        never shift when the label changes between "Entrar/Cadastrar" and "Sair".
      */}
      <div className="flex shrink-0 justify-end" style={{ minWidth: "300px" }}>
        <AuthButton isLogged={isLogged} onAuthAction={onAuthAction} />
      </div>
    </header>
  );
}
