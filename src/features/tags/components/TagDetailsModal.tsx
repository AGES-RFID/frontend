import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/features/dashboard/components/Status";
import type { TagListItemDto } from "../dtos";

interface TagDetailsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly tag: TagListItemDto | null;
}

export function TagDetailsModal({
  isOpen,
  onClose,
  tag,
}: TagDetailsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes da etiqueta">
      {tag ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-gray text-xs uppercase tracking-wide">TID</p>
              <p className="break-all font-medium text-dark-gray">{tag.tid}</p>
            </div>
            <div>
              <p className="text-gray text-xs uppercase tracking-wide">
                Status
              </p>
              <div className="mt-1">
                <StatusBadge status={tag.status} />
              </div>
            </div>
            <div>
              <p className="text-gray text-xs uppercase tracking-wide">
                Proprietário
              </p>
              <p className="text-dark-gray">{tag.userName ?? "—"}</p>
            </div>
            <div>
              <p className="text-gray text-xs uppercase tracking-wide">Placa</p>
              <p className="text-dark-gray">{tag.plate ?? "—"}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose} variant="secondary" type="button">
              Fechar
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
