import { useNavigate, useLocation } from "react-router";
import { LogOutIcon } from "lucide-react";
import { HeaderButton } from "@/components/ui/header-button";
import { ImpinjLogo } from "../../icons/ImpinjLogo";
import { cn } from "@/utils/cn";

// ─── Inline SVG Icons (64×64) ─────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg
      width="31"
      height="31"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 12L16 2.66669L28 12V26.6667C28 27.3739 27.719 28.0522 27.219 28.5523C26.7189 29.0524 26.0406 29.3334 25.3333 29.3334H6.66667C5.95942 29.3334 5.28115 29.0524 4.78105 28.5523C4.28095 28.0522 4 27.3739 4 26.6667V12Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 29.3333V16H20V29.3333"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 12V8H6C5.46957 8 4.96086 7.78929 4.58579 7.41421C4.21071 7.03914 4 6.53043 4 6C4 4.9 4.9 4 6 4H18V8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 6V18C4 19.1 4.9 20 6 20H20V16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 12C17.4696 12 16.9609 12.2107 16.5858 12.5858C16.2107 12.9609 16 13.4696 16 14C16 15.1 16.9 16 18 16H22V12H18Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="31"
      height="31"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.3333 28V25.3333C25.3333 23.9188 24.7714 22.5623 23.7712 21.5621C22.771 20.5619 21.4145 20 20 20H12C10.5855 20 9.22895 20.5619 8.22875 21.5621C7.22856 22.5623 6.66666 23.9188 6.66666 25.3333V28"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 14.6667C18.9455 14.6667 21.3333 12.2789 21.3333 9.33333C21.3333 6.38781 18.9455 4 16 4C13.0545 4 10.6667 6.38781 10.6667 9.33333C10.6667 12.2789 13.0545 14.6667 16 14.6667Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      {!isLogged && <LogOutIcon className="h-[31px] w-[31px] shrink-0" />}
      <span>{label}</span>
      {isLogged && <LogOutIcon className="h-[31px] w-[31px] shrink-0" />}
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
          icon={<HomeIcon />}
          label="Home"
          isActive={isActive("/")}
          action={() => navigate("/")}
        />
        <HeaderButton
          icon={<WalletIcon />}
          label="Pagamentos"
          isActive={isActive("/payments")}
          action={() => navigate("/payments")}
        />
        <HeaderButton
          icon={<UserIcon />}
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
