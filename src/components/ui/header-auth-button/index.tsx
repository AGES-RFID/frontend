import { Button } from "@/components/ui/button";
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
    <Button
      type={type}
      onClick={action}
      disabled={disabled}
      size="md"
      icon={isLogged ? "right" : "left"}
      aria-label={label}
      data-testid="header-auth-button"
      className={cn(
        "inline-flex items-center gap-2",
        "rounded-none",
        "bg-dark-blue text-white",
        "font-['Roboto'] font-bold",
        "hover:opacity-90",
        "active:opacity-80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        className,
      )}
    >
      {!isLogged && <LogOutIcon className="h-4 w-4 shrink-0" />}
      <span>{label}</span>
      {isLogged && <LogOutIcon className="h-4 w-4 shrink-0" />}
    </Button>
  );
}
