import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonStyles = cva(["bg-yellow-700 rounded font-semibold"], {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

export function Button({ size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonStyles({ size }), props.className)} {...props}>
      {props.children}
    </button>
  );
}
