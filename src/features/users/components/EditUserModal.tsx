import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { User } from "@/features/users/model/user";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: User | null;
}

export function EditUserModal({ isOpen, onClose, selectedUser }: EditUserModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Usuário"
    >
      <div className="space-y-4">
        <p>Editando usuário: {selectedUser?.name}</p>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={onClose}>
            Salvar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
