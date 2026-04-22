import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useCreateTag } from "../hooks";

interface TagAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TagEntry = { id: string; value: string };

const newEntry = (): TagEntry => ({ id: crypto.randomUUID(), value: "" });

export function TagAddModal({ isOpen, onClose }: TagAddModalProps) {
  const [tags, setTags] = useState<TagEntry[]>([newEntry()]);

  const createTagMutation = useCreateTag();
  const isSubmitting = createTagMutation.isPending;

  const handleChange = (id: string, value: string) => {
    setTags((prev) =>
      prev.map((tag) => (tag.id === id ? { ...tag, value } : tag)),
    );
  };

  /** Adds a new empty input row and turns the current last into a "default" input. */
  const handleAddInput = () => {
    setTags((prev) => [...prev, newEntry()]);
  };

  const handleCancel = () => {
    setTags([newEntry()]);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Filter out empty values — at least one must be filled
    const filled = tags.map((t) => t.value.trim()).filter(Boolean);

    if (filled.length === 0) {
      toast.error("Preencha pelo menos um ID de etiqueta.");
      return;
    }

    try {
      // Send one request per filled tag ID, sequentially
      for (const tagId of filled) {
        await createTagMutation.mutateAsync({ tagId });
      }

      const count = filled.length;
      toast.success(
        count === 1
          ? "Etiqueta adicionada com sucesso."
          : `${count} etiquetas adicionadas com sucesso.`,
      );

      setTags([newEntry()]);
      onClose();
    } catch {
      toast.error(
        "Erro ao adicionar etiqueta(s). Verifique os IDs e tente novamente.",
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Adicionar etiquetas RFID"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 px-[50px]">
          {tags.map((tag, index) => {
            const isLast = index === tags.length - 1;
            return (
              <Input
                key={tag.id}
                label="ID"
                placeholder="123456789"
                variant={isLast ? "with-button" : "default"}
                value={tag.value}
                onChange={(e) => handleChange(tag.id, e.target.value)}
                onButtonClick={isLast ? handleAddInput : undefined}
                width={isLast ? "100%" : "calc(100% - 3rem)"}
              />
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="borderless"
            className="text-dark-gray hover:bg-dark-gray/10 active:bg-dark-gray/20"
            onClick={handleCancel}
          >
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
