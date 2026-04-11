import { type ReactNode } from "react";
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
      <div 
        className="absolute inset-0 bg-bg-overlay"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-dark-gray">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray hover:text-dark-gray transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="text-gray">
          {children}
        </div>
      </div>
    </div>
  );
}
