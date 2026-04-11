import { cn } from "@/utils/cn";

type HeaderButtonProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  action?: () => void;
  className?: string;
};

export function HeaderButton({
  icon,
  label,
  isActive = false,
  action,
  className,
}: Readonly<HeaderButtonProps>) {
  return (
    <button
      type="button"
      onClick={action}
      data-testid="header-button"
      aria-label={label}
      aria-pressed={isActive}
      className={cn(
        "inline-flex items-center gap-[10px] px-4 py-2",
        "font-['Roboto'] font-bold text-[23px] leading-[23px]",
        "text-white",
        "transition-all duration-200 ease-in-out",
        "rounded-[100px]",
        isActive ? "outline outline-2 outline-white" : "outline-none",
        "hover:bg-white/15",
        "active:scale-95 active:bg-white/25",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60",
        "cursor-pointer",
        className,
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center",
          "transition-transform duration-200",
          "group-hover:scale-110",
        )}
        aria-hidden="true"
      >
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}
