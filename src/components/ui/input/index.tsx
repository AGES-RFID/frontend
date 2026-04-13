import { cva } from "class-variance-authority";
import { Eye, EyeOff, Plus } from "lucide-react";
import type React from "react";
import { useId, useState } from "react";
import { cn } from "@/utils/cn";

// Border: 2px (dobro do padrão 1px), radius 6px, cor #999 (light-gray)
const inputContainerStyles = cva(
  // w-full garante que default/disabled preencham o wrapper
  // flex-1 sobrescreve w-full na variante with-button (dentro do flex row)
  "flex items-center cursor-text rounded-md border h-10 border-light-gray px-4 py-2 gap-3 overflow-hidden w-full relative",
  {
    variants: {
      variant: {
        default:
          "bg-white focus-within:border-[1.5px] focus-within:border-dark-gray",
        disabled: "bg-very-light-gray/30 opacity-80 cursor-not-allowed",
        // with-button: flex-1 para dividir espaço com o botão
        "with-button":
          "bg-white focus-within:border-[1.5px] focus-within:border-dark-gray flex-1",
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
    "w-full outline-none bg-transparent",
    "text-sm leading-4 text-dark-gray",
    "placeholder:text-lighter-blue",
  ],
  {
    variants: {
      variant: {
        default: "cursor-text",
        disabled: "cursor-not-allowed ",
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
  /** Variant controls appearance and behavior of input */
  variant?: InputVariant;
  /** Label displayed above input — Input 14/20: font-size 14px, line-height 20px, color #333 */
  label?: string;
  /** Placeholder text inside input */
  placeholder?: string;
  /** Used to display a decoration before the input */
  leftDecoration?: React.ReactNode;
  /** Make the input required */
  required?: boolean;
  /** Callback for "+" button click (only used when variant is "with-button") */
  onButtonClick?: () => void;
  /** Enable password visibility toggle (for password inputs) */
  showPasswordToggle?: boolean;
}

export function Input({
  variant = "default",
  label,
  placeholder,
  className,
  onButtonClick,
  leftDecoration,
  required = false,
  showPasswordToggle = false,
  ...props
}: InputProps) {
  const isDisabled = variant === "disabled";
  const hasButton = variant === "with-button";
  const isPasswordField = showPasswordToggle && props.type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputId = useId();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      {label && (
        // Input - 14/20: font-size 14px, line-height 20px, cor #333 (dark-gray)
        <label
          htmlFor={inputId}
          className="font-medium text-dark-gray text-sm leading-5"
        >
          {label}
          {required && <span className="ml-1 text-red">*</span>}
        </label>
      )}

      {/* Linha que contém o campo e, se necessário, o botão separado */}
      {/* w-full garante que a linha ocupa toda a largura do wrapper */}
      <div className={cn("flex w-full items-center", hasButton && "gap-2")}>
        <label className={inputContainerStyles({ variant })}>
          {leftDecoration}

          <input
            id={inputId}
            className={inputFieldStyles({ variant })}
            placeholder={placeholder}
            disabled={isDisabled}
            required={required}
            type={isPasswordField && showPassword ? "text" : props.type}
            value={isPasswordField ? props.value : undefined}
            {...props}
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray hover:text-dark-gray focus:outline-none"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </label>

        {/* Botão separado do campo, mesma borda (#999 / light-gray), "+" em #333 */}
        {hasButton && (
          <button
            type="button"
            className={cn(
              "group flex h-10 w-10 shrink-0 items-center justify-center",
              "rounded-md border border-baby-blue bg-white",
              "font-bold text-dark-gray text-lg leading-none",
              "cursor-pointer select-none transition-all duration-150 ease-out",
              "hover:-translate-y-0.5 hover:border-dark-gray hover:bg-gray-50 hover:shadow-sm",
              "active:translate-y-0.5 active:scale-90 active:shadow-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-gray/30 focus-visible:ring-offset-2",
            )}
            onClick={onButtonClick}
            aria-label="Adicionar"
          >
            <Plus
              size={16}
              strokeWidth={2.5}
              className="transition-transform duration-150 ease-out group-hover:scale-110 group-active:scale-95"
            />
          </button>
        )}
      </div>
    </div>
  );
}
