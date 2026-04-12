import { LogOutIcon } from "lucide-react";
import { HeaderButton } from "../header-button";

type HeaderAuthButtonProps = {
  isLogged?: boolean;
  action?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export function HeaderAuthButton({
  isLogged = false,
  action,
  className,
}: Readonly<HeaderAuthButtonProps>) {
  const label = isLogged ? "Sair" : "Entrar/Cadastrar";

  return (
    <HeaderButton
      icon={<LogOutIcon size={28} />}
      iconPosition={isLogged ? "right" : "left"}
      label={label}
      action={action}
      className={className}
    />
  );
}
