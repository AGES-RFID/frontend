import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonStyles = cva(["rounded font-medium cursor-pointer"], {
  variants: {
    variant: {
      primary: "bg-dark-blue text-white",
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
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

export function Button({ size, icon, className, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonStyles({ size, icon }), className)} {...props}>
      {props.children}
    </button>
  );
}
