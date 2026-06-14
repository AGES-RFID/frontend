import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import { useCreateTag } from "../hooks";

interface TagAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TagAddModal({ isOpen, onClose }: TagAddModalProps) {
  const [tid, setTid] = useState("");
  const [epc, setEpc] = useState("");

  const createTagMutation = useCreateTag();
  const isSubmitting = createTagMutation.isPending;

  const handleCancel = () => {
    setTid("");
    setEpc("");
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanTid = tid.trim();
    const cleanEpc = epc.trim();

    if (!cleanTid || !cleanEpc) {
      toast.error("Preencha o TID e o EPC da etiqueta.");
      return;
    }

    try {
      await createTagMutation.mutateAsync({ tid: cleanTid, epc: cleanEpc });
      toast.success("Etiqueta adicionada com sucesso.");
      setTid("");
      setEpc("");
      onClose();
    } catch {
      toast.error(
        "Erro ao adicionar etiqueta. Verifique os campos e tente novamente.",
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Adicionar etiqueta RFID"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="mx-auto flex w-full max-w-xs flex-col gap-4">
          <Input
            label="TID"
            placeholder="Ex: E200341201300000..."
            value={tid}
            width="100%"
            onChange={(e) => setTid(e.target.value)}
          />
          <Input
            label="EPC"
            placeholder="Ex: 300833B2DDD90140..."
            value={epc}
            width="100%"
            onChange={(e) => setEpc(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="borderless" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Confirmando..." : "Confirmar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
