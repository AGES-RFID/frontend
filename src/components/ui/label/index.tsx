import { cn } from "@/utils/cn";

type LabelProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: string;
};

export function Label({ label, value, className, ...props }: LabelProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-col gap-1",
        "cursor-pointer select-none",
        "rounded",
        "transition-colors duration-150",
        "group",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "text-sm",
          "font-bold",
          "text-black",
          "transition-opacity duration-150 group-active:opacity-60",
        )}
      >
        {label}
      </span>

      <span
        className={cn(
          "font-normal text-sm",
          "text-dark-gray",
          "flex items-center gap-2",
          "before:text-base/tight before:text-dark-gray before:content-['•']",
          "transition-opacity duration-150 group-hover:opacity-80 group-active:opacity-60",
        )}
      >
        {value}
      </span>
    </div>
  );
}
