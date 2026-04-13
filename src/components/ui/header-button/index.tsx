import { forwardRef } from "react";
import { cn } from "@/utils/cn";

type HeaderButtonProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  action?: () => void;
  className?: string;
};

export const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(
  function HeaderButton(
    { icon, label, isActive = false, action, className },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        onClick={action}
        data-testid="header-button"
        aria-label={label}
        aria-pressed={isActive}
        className={cn(
          "inline-flex items-center gap-2.5 px-4.5 py-2.5",
          "font-['Roboto'] font-bold text-[18px] leading-none",
          "border-2 border-transparent bg-transparent text-white",
          "transition-all duration-300 ease-out",
          "rounded-[100px]",
          "hover:bg-white/15",
          "active:scale-95 active:bg-white/25",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
          "group",
          "cursor-pointer",
          className,
        )}
      >
        <span
          className={cn(
            "flex shrink-0 items-center justify-center",
            "transition-transform duration-200 ease-out",
            "group-hover:scale-110",
          )}
          aria-hidden="true"
        >
          {icon}
        </span>

        <span>{label}</span>
      </button>
    );
  },
);
