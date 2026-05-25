import { MinusIcon, PlusIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleAddInput = () => {
    setTags((prev) => [...prev, newEntry()]);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.pointerEvents = "none";
    }
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
        scrollContainerRef.current.style.pointerEvents = "";
      }
    }, 0);
  };

  const handleRemoveInput = (id: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  const handleCancel = () => {
    setTags([newEntry()]);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const filled = tags.map((t) => t.value.trim()).filter(Boolean);

    if (filled.length === 0) {
      toast.error("Preencha pelo menos um ID de etiqueta.");
      return;
    }

    try {
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
        <div
          ref={scrollContainerRef}
          className="flex max-h-[50dvh] flex-col gap-4 overflow-y-auto"
        >
          <div className="mx-auto flex w-full max-w-xs flex-col gap-4">
            {tags.map((tag, index) => {
              const isLast = index === tags.length - 1;
              return (
                <div key={tag.id} className="flex items-end gap-2">
                  <Input
                    label="ID"
                    placeholder="123456789"
                    value={tag.value}
                    width="100%"
                    onChange={(e) => handleChange(tag.id, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    icon
                    className="flex h-10 w-10 items-center justify-center"
                    onClick={
                      isLast ? handleAddInput : () => handleRemoveInput(tag.id)
                    }
                    aria-label={isLast ? "Adicionar campo" : "Remover campo"}
                  >
                    {isLast ? <PlusIcon size={16} /> : <MinusIcon size={16} />}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
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
