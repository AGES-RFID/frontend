import { CheckCircle2, CircleAlert, CircleX, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { create } from "zustand";

export type ToastVariant = "success" | "info" | "warning" | "error";

export type ToastInput = {
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastItem = Required<Omit<ToastInput, "title">> & {
  id: string;
  title: string | null;
};

type ToastStore = {
  toasts: ToastItem[];
  push: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
};

const defaultDuration = 4200;

const variantConfig: Record<
  ToastVariant,
  {
    containerClassName: string;
    iconClassName: string;
    icon: typeof CheckCircle2;
    closeClassName: string;
    titleClassName: string;
    messageClassName: string;
  }
> = {
  success: {
    containerClassName: "border-[#1f8e2d] bg-[#2da53d] text-white",
    iconClassName: "text-white",
    icon: CheckCircle2,
    closeClassName: "text-white/90 hover:text-white",
    titleClassName: "text-white",
    messageClassName: "text-white",
  },
  info: {
    containerClassName: "border-[#1a3f63] bg-[#1f4a7a] text-white",
    iconClassName: "border-white text-white",
    icon: Info,
    closeClassName: "text-white/90 hover:text-white",
    titleClassName: "text-white",
    messageClassName: "text-white",
  },
  warning: {
    containerClassName: "border-[#e0b400] bg-[#ffd43b] text-[#2f343f]",
    iconClassName: "border-[#2f343f] text-[#2f343f]",
    icon: CircleAlert,
    closeClassName: "text-[#2f343f]/80 hover:text-[#2f343f]",
    titleClassName: "text-[#2f343f]",
    messageClassName: "text-[#2f343f]",
  },
  error: {
    containerClassName: "border-[#d6323c] bg-[#f83c47] text-white",
    iconClassName: "border-white text-white",
    icon: CircleX,
    closeClassName: "text-white/90 hover:text-white",
    titleClassName: "text-white",
    messageClassName: "text-white",
  },
};

const createToastId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = createToastId();
    const nextToast: ToastItem = {
      id,
      title: toast.title ?? null,
      message: toast.message,
      variant: toast.variant ?? "info",
      duration: toast.duration ?? defaultDuration,
    };

    set((state) => ({
      toasts: [...state.toasts, nextToast],
    }));

    return id;
  },
  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

function ToastCard({ toastItem }: { toastItem: ToastItem }) {
  const dismiss = useToastStore((state) => state.dismiss);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() =>
      setIsVisible(true),
    );
    const timeoutId = window.setTimeout(
      () => dismiss(toastItem.id),
      toastItem.duration,
    );

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeoutId);
    };
  }, [dismiss, toastItem.duration, toastItem.id]);

  const config = variantConfig[toastItem.variant];
  const Icon = config.icon;

  return (
    <output
      className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_12px_24px_rgba(15,23,42,0.14)] transition-all duration-300 ${config.containerClassName} ${isVisible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`}
      aria-live={toastItem.variant === "error" ? "assertive" : "polite"}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.iconClassName}`}
      >
        <Icon size={20} strokeWidth={2.5} />
      </div>

      <div className="min-w-0 flex-1">
        {toastItem.title ? (
          <p
            className={`font-semibold text-sm leading-4 ${config.titleClassName}`}
          >
            {toastItem.title}
          </p>
        ) : null}
        <p
          className={`text-sm leading-5 ${toastItem.title ? "mt-0.5" : ""} ${config.messageClassName}`}
        >
          {toastItem.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => dismiss(toastItem.id)}
        className={`cursor-pointer transition-colors ${config.closeClassName}`}
        aria-label="Fechar notificação"
      >
        <X size={24} strokeWidth={2.2} />
      </button>
    </output>
  );
}

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed top-4 right-4 z-100 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toastItem) => (
        <ToastCard key={toastItem.id} toastItem={toastItem} />
      ))}
    </div>,
    document.body,
  );
}

export const toast = {
  show: (input: ToastInput) => useToastStore.getState().push(input),
  success: (message: string, title?: string) =>
    useToastStore.getState().push({ message, title, variant: "success" }),
  info: (message: string, title?: string) =>
    useToastStore.getState().push({ message, title, variant: "info" }),
  warning: (message: string, title?: string) =>
    useToastStore.getState().push({ message, title, variant: "warning" }),
  error: (message: string, title?: string) =>
    useToastStore.getState().push({ message, title, variant: "error" }),
};
