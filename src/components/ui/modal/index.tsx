import type { ReactNode } from "react";

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
      <button
        type="button"
        className="absolute inset-0 bg-bg-overlay"
        onClick={onClose}
        aria-label="Fechar modal"
      />

      {/* Modal Content */}
      <div className="relative mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        {/* Modal Header */}
        <div className="mb-6 flex items-center justify-center">
          <h2 className="font-semibold text-dark-blue text-xl">{title}</h2>
        </div>

        {/* Modal Body */}
        <div className="text-gray">{children}</div>
      </div>
    </div>
  );
}
