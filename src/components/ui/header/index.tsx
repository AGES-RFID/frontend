import { useNavigate, useLocation } from "react-router";
import { LogOut, House, Wallet, User } from "lucide-react";
import { HeaderButton } from "@/components/ui/header-button";
import { ImpinjLogo } from "../../icons/ImpinjLogo";
import { cn } from "@/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

type HeaderType = "default" | "logo";

type HeaderProps = {
  type?: HeaderType;
  isLogged?: boolean;
  onAuthAction?: () => void;
  className?: string;
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
        "inline-flex items-center gap-[15px] px-4 py-2",
        "font-['Roboto'] font-bold text-[23px] text-white leading-[23px]",
        "rounded-[100px]",
        "transition-all duration-200 ease-in-out",
        "hover:bg-white/15 active:scale-95 active:bg-white/25",
        "cursor-pointer",
      )}
    >
      {!isLogged && <LogOut className="h-[31px] w-[31px] shrink-0" />}
      <span>{label}</span>
      {isLogged && <LogOut className="h-[31px] w-[31px] shrink-0" />}
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

  const isActive = (path: string) => location.pathname === path;

  // ── Logo Only ──────────────────────────────────────────────────────────────
  if (type === "logo") {
    return (
      <header
        data-testid="header"
        data-variant="logo"
        className={cn(
          "flex h-[108px] w-full items-center justify-center px-8",
          "bg-[#173F67]",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Ir para Home"
          className="cursor-pointer rounded-md transition-all duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 active:scale-95 active:opacity-60"
        >
          <ImpinjLogo className="h-[60px] w-auto" />
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
        "flex h-[108px] w-full items-center px-12",
        "bg-[#173F67]",
        className,
      )}
    >
      {/* Logo — left slot */}
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Ir para Home"
        className="mr-[150px] shrink-0 cursor-pointer rounded-md transition-all duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 active:scale-95 active:opacity-60"
      >
        <ImpinjLogo className="h-[60px] w-auto" />
      </button>

      {/* Nav buttons — center (grows to fill remaining space) */}
      <nav
        aria-label="Navegação principal"
        className="flex flex-1 items-center gap-[150px]"
      >
        <HeaderButton
          icon={<House className="h-[31px] w-[31px] shrink-0" />}
          label="Home"
          isActive={isActive("/")}
          action={() => navigate("/")}
        />
        <HeaderButton
          icon={<Wallet className="h-[23px] w-[23px] shrink-0" />}
          label="Pagamentos"
          isActive={isActive("/payments")}
          action={() => navigate("/payments")}
        />
        <HeaderButton
          icon={<User className="h-[31px] w-[31px] shrink-0" />}
          label="Perfil"
          isActive={isActive("/users")}
          action={() => navigate("/users")}
        />
      </nav>

      {/*
        Auth button — right slot with fixed minimum width so the nav buttons
        never shift when the label changes between "Entrar/Cadastrar" and "Sair".
      */}
      <div className="flex shrink-0 justify-end" style={{ minWidth: "280px" }}>
        <AuthButton isLogged={isLogged} onAuthAction={onAuthAction} />
      </div>
    </header>
  );
}
