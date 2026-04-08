import { Button } from "@/components/ui/button";

type HeaderAuthButtonProps = {
  isLogged?: boolean;
  action?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
};

type ExitArrowIconProps = {
  className?: string;
};

function ExitArrowIcon({ className = "" }: ExitArrowIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      <path
        d="M18 8H9a3 3 0 0 0-3 3v42a3 3 0 0 0 3 3h9"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 32h29"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 16l16 16-16 16"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeaderAuthButton({
  isLogged = false,
  action,
  disabled = false,
  className = "",
  type = "button",
}: HeaderAuthButtonProps) {
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
      className={[
        "inline-flex items-center gap-2",
        "rounded-none",
        "font-['Roboto'] font-bold",
        "hover:opacity-90",
        "active:opacity-80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        className,
      ].join(" ")}
    >
      {!isLogged && <ExitArrowIcon className="h-4 w-4 shrink-0" />}
      <span>{label}</span>
      {isLogged && <ExitArrowIcon className="h-4 w-4 shrink-0" />}
    </Button>
  );
}
