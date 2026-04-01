import { cva, type VariantProps } from "class-variance-authority";

const inputStyles = cva(["rounded border"], {
  variants: {
    variant: {
      primary: "bg-white text-black border-blue",
    },

    size: {
      md: "px-4 py-2 h-10",
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputStyles>;

export function Input({ variant, className, ...props }: InputProps) {
  return <input className={inputStyles({ variant, className })} {...props} />;
}
