import { Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  type TableAction,
  type TableColumn,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import {
  StatusBadge,
  type Status,
} from "@/features/dashboard/components/Status";
import { TagAddModal } from "@/features/tags/components/TagAddModal";
import { TagDeactivateModal } from "@/features/tags/components/TagDeactivateModal";
import { TagDetailsModal } from "@/features/tags/components/TagDetailsModal";
import type { TagListItemDto } from "@/features/tags/dtos";
import { useTags, useTagsModalState } from "@/features/tags/hooks";

export function Tags() {
  const tagsQuery = useTags();
  const { activeModal, selectedTag, open, close } = useTagsModalState();

  const tags = tagsQuery.data ?? [];
  const isLoading = tagsQuery.isLoading || tagsQuery.isFetching;

  useEffect(() => {
    if (tagsQuery.error) {
      toast.error("Não foi possível carregar as etiquetas.");
    }
  }, [tagsQuery.error]);

  const columns = useMemo<TableColumn<TagListItemDto>[]>(
    () => [
      {
        key: "id",
        title: "ID",
        className: "w-48 whitespace-nowrap",
        sortable: true,
      },
      {
        key: "userName",
        title: "Proprietário",
        className: "whitespace-nowrap",
        sortable: true,
        render: (value) => (value as string | null) ?? "—",
      },
      {
        key: "plate",
        title: "Placa",
        className: "w-36 whitespace-nowrap",
        sortable: true,
        render: (value) => (value as string | null) ?? "—",
      },
      {
        key: "status",
        title: "Status",
        className: "w-36 whitespace-nowrap",
        sortable: true,
        render: (value) => <StatusBadge status={String(value) as Status} />,
      },
    ],
    [],
  );

  const actions: TableAction<TagListItemDto>[] = [
    {
      key: "deactivate",
      label: "Desativar",
      icon: <Trash2 size={18} />,
      onClick: (tag) => open("deactivate", tag),
      className:
        "text-red hover:text-light-red cursor-pointer transition-colors",
      show: (tag) => tag.status !== "INACTIVE",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-4 font-bold text-3xl text-dark-gray">
            Etiquetas RFID
          </h1>
          <p className="mb-6 text-gray">
            Gerenciamento de etiquetas do sistema
          </p>
        </div>
      </div>

      {tagsQuery.error ? (
        <div className="mb-6 rounded-md border border-light-gray bg-white px-4 py-3 text-gray">
          Não foi possível carregar os dados de etiquetas.
        </div>
      ) : null}

      <Table
        data={tags}
        columns={columns}
        actions={actions}
        loading={isLoading}
        paginationPageSize={10}
        searchPlaceholder="Pesquisar por ID, proprietário ou placa"
        emptyMessage="Nenhuma etiqueta cadastrada ainda."
        searchNotFoundMessage="Nenhuma etiqueta encontrada para esta busca."
        onRowClick={(tag) => open("details", tag)}
        searchBarComponent={
          <Button onClick={() => open("create")} variant="primary" size="md">
            Adicionar etiquetas
          </Button>
        }
      />

      <TagDetailsModal
        isOpen={activeModal === "details"}
        onClose={close}
        tag={selectedTag}
      />

      <TagAddModal isOpen={activeModal === "create"} onClose={close} />

      <TagDeactivateModal
        isOpen={activeModal === "deactivate"}
        onClose={close}
        tag={selectedTag}
      />
    </div>
  );
}
