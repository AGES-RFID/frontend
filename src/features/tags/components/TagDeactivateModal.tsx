import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import type { TagListItemDto } from "../dtos";
import { useDeactivateTag } from "../hooks";

interface TagDeactivateModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly tag: TagListItemDto | null;
}

export function TagDeactivateModal({
  isOpen,
  onClose,
  tag,
}: TagDeactivateModalProps) {
  const deactivateMutation = useDeactivateTag();
  const isDeactivating = deactivateMutation.isPending;

  const handleConfirm = () => {
    if (!tag) return;

    deactivateMutation.mutate(tag.id, {
      onSuccess: () => {
        toast.success("Etiqueta desativada com sucesso.");
        onClose();
      },
      onError: () => {
        toast.error("Erro ao desativar etiqueta. Tente novamente.");
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tem certeza que deseja desativar essa etiqueta?"
    >
      <div className="-mt-5 space-y-1">
        <p className="text-center text-gray text-sm">
          Essa ação não pode ser desfeita.
        </p>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onClose} variant="secondary" type="button">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="destructive"
            type="button"
            disabled={isDeactivating}
          >
            {isDeactivating ? "Desativando..." : "Desativar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
