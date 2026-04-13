import { cn } from "@/utils/cn";
import { LogOutIcon } from "lucide-react";

type HeaderAuthButtonProps = {
  isLogged?: boolean;
  action?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export function HeaderAuthButton({
  isLogged = false,
  action,
  disabled = false,
  className = "",
  type = "button",
}: Readonly<HeaderAuthButtonProps>) {
  const label = isLogged ? "Sair" : "Entrar/Cadastrar";

  return (
    <button
      type={type}
      onClick={action}
      disabled={disabled}
      aria-label={label}
      data-testid="header-auth-button"
      className={cn(
        "inline-flex items-center gap-3.5 whitespace-nowrap px-7 py-3.5",
        "rounded-full bg-dark-blue text-white",
        "font-['Roboto'] font-semibold text-[19px] leading-none",
        "hover:opacity-90",
        "active:opacity-80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        className,
      )}
    >
      {!isLogged && <LogOutIcon className="h-6 w-6 shrink-0" />}
      <span>{label}</span>
      {isLogged && <LogOutIcon className="h-6 w-6 shrink-0" />}
    </button>
  );
}
