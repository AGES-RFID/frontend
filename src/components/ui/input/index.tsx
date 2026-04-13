import type React from "react";
import { useId, useState } from "react";
import { Plus, Eye, EyeOff } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

// Border: 2px (dobro do padrão 1px), radius 6px, cor #999 (light-gray)
const inputContainerStyles = cva(
  // w-full garante que default/disabled preencham o wrapper
  // flex-1 sobrescreve w-full na variante with-button (dentro do flex row)
  [
    "flex items-center rounded-md border border-light-gray overflow-hidden w-full relative",
  ],
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
    "w-full outline-none bg-transparent px-4 py-2 h-10",
    "text-[12px] leading-4 text-dark-gray",
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
type InputMask = "cpf" | "phone";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }

  const areaCode = digits.slice(0, 2);
  const remainingDigits = digits.slice(2);

  if (digits.length <= 6) {
    return `(${areaCode}) ${remainingDigits}`;
  }

  if (digits.length <= 10) {
    return `(${areaCode}) ${remainingDigits.slice(0, 4)}-${remainingDigits.slice(4)}`;
  }

  return `(${areaCode}) ${remainingDigits.slice(0, 5)}-${remainingDigits.slice(5)}`;
}

function isValidCpf(value: string) {
  const digits = onlyDigits(value);

  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const calculateCheckDigit = (slice: string, factor: number) => {
    let total = 0;
    for (let index = 0; index < slice.length; index++) {
      total += Number(slice[index]) * (factor - index);
    }

    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstCheckDigit = calculateCheckDigit(digits.slice(0, 9), 10);
  const secondCheckDigit = calculateCheckDigit(digits.slice(0, 10), 11);

  return (
    Number(digits[9]) === firstCheckDigit &&
    Number(digits[10]) === secondCheckDigit
  );
}

function isValidPhone(value: string) {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPassword(value: string) {
  return value.trim().length >= 8;
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "disabled"> {
  /** Variant controls appearance and behavior of input */
  variant?: InputVariant;
  /** Label displayed above input — Input 14/20: font-size 14px, line-height 20px, color #333 */
  label?: string;
  /** Placeholder text inside input */
  placeholder?: string;
  /** Width of the input wrapper (CSS value, e.g. "100%", "320px") */
  width?: string;
  /** Make the input required */
  required?: boolean;
  /** Callback for "+" button click (only used when variant is "with-button") */
  onButtonClick?: () => void;
  /** Enable password visibility toggle (for password inputs) */
  showPasswordToggle?: boolean;
  /** Enable built-in mask/validation for supported values */
  mask?: InputMask;
}

export function Input({
  variant = "default",
  label,
  placeholder,
  width = "320px",
  className,
  onButtonClick,
  required = false,
  showPasswordToggle = false,
  mask,
  ...props
}: InputProps) {
  const isDisabled = variant === "disabled";
  const hasButton = variant === "with-button";
  const isPasswordField = showPasswordToggle && props.type === "password";
  const isEmailField = props.type === "email";
  const isPasswordInput = props.type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputId = useId();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (mask === "cpf" || mask === "phone") {
      const maskedValue =
        mask === "cpf"
          ? formatCpf(event.target.value)
          : formatPhone(event.target.value);
      props.onChange?.({
        ...event,
        target: {
          ...event.target,
          value: maskedValue,
        },
      } as React.ChangeEvent<HTMLInputElement>);
      return;
    }

    props.onChange?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    props.onBlur?.(event);

    if (mask === undefined && !isEmailField) {
      if (!isPasswordInput) {
        return;
      }
    }

    const currentValue = String(props.value ?? event.target.value);
    if (!currentValue) {
      setValidationError(null);
      return;
    }

    if (mask === "cpf") {
      setValidationError(isValidCpf(currentValue) ? null : "CPF inválido.");
      return;
    }

    if (mask === "phone") {
      setValidationError(
        isValidPhone(currentValue) ? null : "Telefone inválido.",
      );
      return;
    }

    if (isEmailField) {
      setValidationError(isValidEmail(currentValue) ? null : "Email inválido.");
      return;
    }

    if (isPasswordInput) {
      setValidationError(
        isValidPassword(currentValue)
          ? null
          : "A senha deve ter no mínimo 8 caracteres.",
      );
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    props.onFocus?.(event);
    if (validationError) {
      setValidationError(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1", className)} style={{ width }}>
      {label && (
        // Input - 14/20: font-size 14px, line-height 20px, cor #333 (dark-gray)
        <label
          htmlFor={inputId}
          className="font-medium text-[14px] text-dark-gray leading-5"
        >
          {label}
          {required && <span className="ml-1 text-red">*</span>}
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
            required={required}
            type={isPasswordField && showPassword ? "text" : props.type}
            value={isPasswordField ? props.value : undefined}
            {...(isPasswordField
              ? { ...props, type: showPassword ? "text" : "password" }
              : props)}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

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

      {validationError ? (
        <span className="text-red text-sm">{validationError}</span>
      ) : null}
    </div>
  );
}
