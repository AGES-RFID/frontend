import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonStyles = cva(
  [
    "rounded-md font-medium cursor-pointer",
    "transition-all duration-150 ease-out",
    "hover:-translate-y-0.5 hover:shadow-sm",
    "active:translate-y-0.5 active:scale-95 active:shadow-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue/30 focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-dark-blue text-white hover:bg-dark-blue-75 active:bg-dark-blue-50 disabled:bg-light-gray disabled:text-white disabled:shadow-none disabled:translate-y-0 disabled:hover:bg-dark-blue",
        secondary:
          "border border-dark-blue bg-white text-dark-blue hover:bg-blue/15 active:bg-blue/30 disabled:border-gray disabled:text-gray disabled:hover:bg-transparent disabled:shadow-none disabled:translate-y-0",
        destructive:
          "bg-red text-white hover:bg-red-75 active:bg-red-50 disabled:bg-light-gray disabled:text-white disabled:shadow-none disabled:translate-y-0",
        borderless:
          "bg-transparent border-none text-dark-blue hover:bg-dark-blue/15 active:bg-dark-blue/30 disabled:bg-transparent disabled:text-light-gray disabled:shadow-none disabled:translate-y-0",
      },

      size: {
        sm: "text-sm px-2 py-1",
        md: "text-base px-4 py-2",
        lg: "text-lg px-6 py-3",
      },

      icon: {
        true: undefined,
        left: undefined,
        right: undefined,
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
    compoundVariants: [
      { size: "sm", icon: true, className: "p-1" },
      { size: "sm", icon: "left", className: "pl-1" },
      { size: "sm", icon: "right", className: "pr-1" },
      { size: "md", icon: true, className: "p-2" },
      { size: "md", icon: "left", className: "pl-2" },
      { size: "md", icon: "right", className: "pr-2" },
      { size: "lg", icon: true, className: "p-3" },
      { size: "lg", icon: "left", className: "pl-3" },
      { size: "lg", icon: "right", className: "pr-3" },
    ],
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

export function Button({
  variant,
  size,
  icon,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonStyles({ variant, size, icon }), className)}
      disabled={props.disabled}
      {...props}
    >
      {props.children}
    </button>
  );
}
