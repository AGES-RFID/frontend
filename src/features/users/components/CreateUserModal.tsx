import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar Novo Usuário">
      <div className="space-y-4">
        <p>Formulário para criar um novo usuário será implementado aqui.</p>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={onClose}>Criar</Button>
        </div>
      </div>
    </Modal>
  );
}
