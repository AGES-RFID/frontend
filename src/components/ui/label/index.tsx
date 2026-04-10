import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const labelContainerStyles = cva(
  [
    "inline-flex flex-col gap-1",
    "select-none cursor-pointer",
    "rounded",
    "transition-colors duration-150",
  ],
  {
    variants: {},
    defaultVariants: {},
  },
);

const labelTextStyles = cva(
  ["text-[14px] leading-[20px]", "font-bold", "text-[#000000]"],
  {
    variants: {},
    defaultVariants: {},
  },
);

const valueTextStyles = cva(
  [
    "text-[14px] leading-[20px]",
    "font-normal",
    "text-[#020617]",
    "flex items-center gap-2",
    "before:content-['•'] before:text-[#020617] before:text-[16px] before:leading-[20px]",
  ],
  {
    variants: {},
    defaultVariants: {},
  },
);

type LabelProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof labelContainerStyles> & {
    label: string;
    value: string;
  };

export function Label({ label, value, className, ...props }: LabelProps) {
  return (
    <div className={cn(labelContainerStyles(), "group", className)} {...props}>
      <span
        className={cn(
          labelTextStyles(),
          "transition-opacity duration-150 group-active:opacity-60",
        )}
      >
        {label}
      </span>

      <span
        className={cn(
          valueTextStyles(),
          "transition-opacity duration-150 group-hover:opacity-80 group-active:opacity-60",
        )}
      >
        {value}
      </span>
    </div>
  );
}
