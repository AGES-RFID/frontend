import { House, User, Wallet } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { HeaderButton } from "@/components/ui/header-button";
import { cn } from "@/utils/cn";
import impinjLogo from "/public/impinj-logo.png";
import { HeaderAuthButton } from "../header-auth-button";

type HeaderType = "default" | "logo";

type HeaderProps = {
  type?: HeaderType;
  isLogged?: boolean;
  onAuthAction?: () => void;
  className?: string;
};

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

  return (
    <header
      data-testid="header"
      data-variant="default"
      className={cn(
        "flex w-full items-center justify-center gap-36 px-8 py-4",
        "bg-dark-blue",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Ir para Home"
        className="cursor-pointer transition-all duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-white/60 active:scale-95 active:opacity-60"
      >
        <img src={impinjLogo} alt="Impinj" className="h-24 w-auto" />
      </button>

      {type === "default" && (
        <>
          <nav
            aria-label="Navegação principal"
            className="flex flex-1 items-center gap-36"
          >
            <HeaderButton
              icon={<House size={28} />}
              label="Home"
              isActive={isActive("/")}
              action={() => navigate("/")}
            />
            <HeaderButton
              icon={<Wallet size={28} />}
              label="Pagamentos"
              isActive={isActive("/payments")}
              action={() => navigate("/payments")}
            />
            <HeaderButton
              icon={<User size={28} />}
              label="Perfil"
              isActive={isActive("/profile")}
              action={() => navigate("/profile")}
            />
          </nav>

          <div className="flex shrink-0 justify-end">
            <HeaderAuthButton isLogged={isLogged} action={onAuthAction} />
          </div>
        </>
      )}
    </header>
  );
}
