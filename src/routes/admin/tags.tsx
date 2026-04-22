import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TagAddModal } from "@/features/tags/components/TagAddModal";

export function Tags() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-bold text-3xl text-dark-gray">Etiquetas</h1>
          <p className="text-gray">Gerenciamento de etiquetas RFID</p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)}>
          Adicionar etiqueta
        </Button>
      </div>

      <TagAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
