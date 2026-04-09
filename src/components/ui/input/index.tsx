import type React from "react";
import { useId } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

// Border: 2px (dobro do padrão 1px), radius 6px, cor #999 (light-gray)
const inputContainerStyles = cva(
  // w-full garante que default/disabled preencham o wrapper
  // flex-1 sobrescreve w-full na variante with-button (dentro do flex row)
  [
    "flex items-center rounded-[6px] border-2 border-light-gray overflow-hidden w-full",
  ],
  {
    variants: {
      variant: {
        default: "bg-white focus-within:border-blue",
        disabled: "bg-gray-100 opacity-60 cursor-not-allowed",
        // with-button: flex-1 para dividir espaço com o botão
        "with-button": "bg-white focus-within:border-blue flex-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Caption - 12/16: font-size 12px, line-height 16px
// Placeholder #94A3B8 (lighter-blue), texto digitado #333 (dark-gray)
const inputFieldStyles = cva(
  [
    "w-full outline-none bg-transparent px-4 py-2 h-10",
    "text-[12px] leading-[16px] text-dark-gray",
    "placeholder:text-lighter-blue",
  ],
  {
    variants: {
      variant: {
        default: "cursor-text",
        disabled: "cursor-not-allowed",
        "with-button": "cursor-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type InputVariant = "default" | "disabled" | "with-button";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "disabled"> {
  /** Variant controls the appearance and behavior of the input */
  variant?: InputVariant;
  /** Label displayed above the input — Input 14/20: font-size 14px, line-height 20px, color #333 */
  label?: string;
  /** Placeholder text inside the input */
  placeholder?: string;
  /** Width of the input wrapper (CSS value, e.g. "100%", "320px") */
  width?: string;
  /** Callback for the "+" button click (only used when variant is "with-button") */
  onButtonClick?: () => void;
}

export function Input({
  variant = "default",
  label,
  placeholder,
  width = "320px",
  className,
  onButtonClick,
  ...props
}: InputProps) {
  const isDisabled = variant === "disabled";
  const hasButton = variant === "with-button";
  const inputId = useId();

  return (
    <div className={cn("flex flex-col gap-1", className)} style={{ width }}>
      {label && (
        // Input - 14/20: font-size 14px, line-height 20px, cor #333 (dark-gray)
        <label
          htmlFor={inputId}
          className="font-medium text-[14px] text-dark-gray leading-[20px]"
        >
          {label}
        </label>
      )}

      {/* Linha que contém o campo e, se necessário, o botão separado */}
      {/* w-full garante que a linha ocupa toda a largura do wrapper */}
      <div className={cn("flex w-full items-center", hasButton && "gap-2")}>
        <div className={inputContainerStyles({ variant })}>
          <input
            id={inputId}
            className={inputFieldStyles({ variant })}
            placeholder={placeholder}
            disabled={isDisabled}
            {...props}
          />
        </div>

        {/* Botão separado do campo, mesma borda (#999 / light-gray), "+" em #333 */}
        {hasButton && (
          <button
            type="button"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center",
              "rounded-[6px] border-2 border-light-gray bg-white",
              "font-bold text-dark-gray text-lg leading-none",
              "cursor-pointer select-none transition-colors hover:bg-gray-50",
            )}
            onClick={onButtonClick}
            aria-label="Adicionar"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
