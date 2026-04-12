import { cn } from "@/utils/cn";

type HeaderButtonProps = {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
  label: string;
  isActive?: boolean;
  action?: () => void;
  className?: string;
};

export function HeaderButton({
  icon,
  label,
  isActive = false,
  iconPosition = "left",
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
        "inline-flex items-center gap-3 px-4 py-2",
        "font-bold text-white text-xl",
        "cursor-pointer rounded-full outline-2 hover:bg-white/15 active:scale-95 active:bg-white/25",
        "transition-all duration-200 ease-in-out",
        "focus-visible:outline-white/60",
        isActive ? "outline-white" : "outline-transparent",
        iconPosition === "right" ? "flex-row-reverse" : "flex-row",
        className,
      )}
    >
      <span
        className="flex shrink-0 items-center justify-center"
        aria-hidden="true"
      >
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}
