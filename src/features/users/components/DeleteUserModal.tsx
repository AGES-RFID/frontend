import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { User } from "@/features/users/model/user";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: User | null;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  selectedUser,
}: DeleteUserModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Excluir Usuário">
      <div className="space-y-4">
        <p>Tem certeza que deseja excluir o usuário "{selectedUser?.name}"?</p>
        <p className="text-gray text-sm">Esta ação não pode ser desfeita.</p>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={onClose} variant="destructive">
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  );
}
