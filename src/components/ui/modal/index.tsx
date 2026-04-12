import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-bg-overlay" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Modal Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-dark-gray text-xl">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray transition-colors hover:text-dark-gray"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="text-gray">{children}</div>
      </div>
    </div>
  );
}
