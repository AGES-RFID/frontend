import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface TagAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TagAddModal({ isOpen, onClose }: TagAddModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar etiquetas RFID">
      <div className="flex flex-col items-center gap-6 py-4">
        <p className="text-muted-foreground text-sm">
          Aproxime as etiquetas do leitor
        </p>
        <ContactlessIcon className="w-40 text-foreground" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="borderless" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="button" onClick={onClose}>
          Confirmar
        </Button>
      </div>
    </Modal>
  );
}

function ContactlessIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Oval outline */}
      <ellipse cx="95" cy="75" rx="80" ry="57" />

      {/* Signal waves — three concentric arcs fanning right from left-center */}
      <path d="M 72 66 A 11 11 0 0 1 72 84" />
      <path d="M 65 57 A 21 21 0 0 1 65 93" />
      <path d="M 58 47 A 31 31 0 0 1 58 103" />

      {/* Card */}
      <rect x="112" y="46" width="52" height="36" rx="4" />

      {/* Thumb (left side of card) */}
      <path d="M 108 70 C 101 65 100 77 106 84 C 109 88 115 87 116 84" />

      {/* Fingers (below card, curling inward) */}
      <path d="M 116 84 C 120 93 134 97 149 90 C 157 85 158 77 154 72" />
    </svg>
  );
}
