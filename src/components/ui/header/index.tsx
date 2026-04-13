import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router";
import { LogOut, House, Wallet, User } from "lucide-react";
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

type IndicatorStyle = {
  left: number;
  width: number;
};

const lastIndicatorStyle: IndicatorStyle = {
  left: 0,
  width: 0,
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

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header({
  type = "default",
  isLogged = false,
  onAuthAction,
  className,
}: Readonly<HeaderProps>) {
  const navigate = useNavigate();
  const location = useLocation();
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const navButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>(() => ({
    ...lastIndicatorStyle,
  }));
  const [hasMeasuredIndicator, setHasMeasuredIndicator] = useState(
    lastIndicatorStyle.width > 0,
  );

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
  const activeNavIndex = Math.max(
    navItems.findIndex((item) => isActive(item.path)),
    0,
  );

  const updateIndicator = useCallback(() => {
    const navContainer = navContainerRef.current;
    const activeButton = navButtonRefs.current[activeNavIndex];

    if (!navContainer || !activeButton) {
      return;
    }

    const containerRect = navContainer.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    const nextIndicatorStyle = {
      left: buttonRect.left - containerRect.left,
      width: buttonRect.width,
    };

    lastIndicatorStyle.left = nextIndicatorStyle.left;
    lastIndicatorStyle.width = nextIndicatorStyle.width;

    setIndicatorStyle(nextIndicatorStyle);

    if (!hasMeasuredIndicator) {
      setHasMeasuredIndicator(true);
    }
  }, [activeNavIndex, hasMeasuredIndicator]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    const handleResize = () => updateIndicator();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateIndicator]);

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
        ref={navContainerRef}
        aria-label="Navegação principal"
        className="relative flex flex-1 items-center justify-center gap-6"
      >
        <div
          aria-hidden="true"
          className={cn(
            "absolute top-1 bottom-1 rounded-full border-2 border-white bg-transparent",
            hasMeasuredIndicator
              ? "transition-all duration-300 ease-out"
              : "transition-none",
          )}
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            opacity: indicatorStyle.width > 0 ? 1 : 0,
          }}
        />
        {navItems.map((item, index) => (
          <HeaderButton
            key={item.path}
            ref={(element) => {
              navButtonRefs.current[index] = element;
            }}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.path)}
            action={() => navigate(item.path)}
          />
        ))}
      </nav>

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
