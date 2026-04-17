import { Edit, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  type TableAction,
  type TableColumn,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { VehicleAddModal } from "@/features/vehicles/components/VehicleAddModal";
import { VehicleDeleteModal } from "@/features/vehicles/components/VehicleDeleteModal";
import { VehicleDetailsModal } from "@/features/vehicles/components/VehicleDetailsModal";
import { VehicleEditModal } from "@/features/vehicles/components/VehicleEditModal";
import type { VehicleWithOwnerDto } from "@/features/vehicles/dtos";
import { useVehicles, useVehiclesModalState } from "@/features/vehicles/hooks";
import { formatDateTime } from "@/utils/formatting";

export function Vehicles() {
  const vehiclesQuery = useVehicles();

  const { activeModal, selectedVehicle, open, close } = useVehiclesModalState();

  const vehicles = vehiclesQuery.data ?? [];
  const isLoading = vehiclesQuery.isLoading || vehiclesQuery.isFetching;

  useEffect(() => {
    if (vehiclesQuery.error) {
      toast.error("Não foi possível carregar os veículos.");
    }
  }, [vehiclesQuery.error]);

  const columns = useMemo<TableColumn<VehicleWithOwnerDto>[]>(
    () => [
      {
        key: "plate",
        title: "Placa",
        className: "w-32 whitespace-nowrap",
        sortable: true,
      },
      {
        key: "brand",
        title: "Marca",
        className: "w-40 whitespace-nowrap",
        sortable: true,
      },
      { key: "model", title: "Modelo", className: "w-56", sortable: true },
      {
        key: "owner",
        title: "Proprietário",
        className: "w-72",
        sortable: false,
        render: (value) =>
          typeof value === "string"
            ? value
            : (value.name ?? "Usuário não encontrado"),
      },
      {
        key: "createdAt",
        title: "Criado em",
        className: "w-48 whitespace-nowrap",
        sortable: true,
        render: (value) => formatDateTime(String(value)),
      },
    ],
    [],
  );

  const actions: TableAction<VehicleWithOwnerDto>[] = [
    {
      key: "edit",
      label: "Editar",
      icon: <Edit size={18} />,
      onClick: (vehicle) => open("edit", vehicle),
      className:
        "text-blue hover:text-light-blue cursor-pointer transition-colors",
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <Trash2 size={18} />,
      onClick: (vehicle) => open("delete", vehicle),
      className:
        "text-red hover:text-light-red cursor-pointer transition-colors",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-4 font-bold text-3xl text-dark-gray">Veículos</h1>
          <p className="mb-6 text-gray">Gerenciamento de veículos do sistema</p>
        </div>
      </div>

      {vehiclesQuery.error ? (
        <div className="mb-6 rounded-md border border-light-gray bg-white px-4 py-3 text-gray">
          Não foi possível carregar os dados de veículos.
        </div>
      ) : null}

      <Table
        data={vehicles}
        columns={columns}
        actions={actions}
        loading={isLoading}
        paginationPageSize={10}
        searchPlaceholder="Pesquisar por placa, marca, modelo ou proprietário"
        emptyMessage="Nenhum veículo cadastrado ainda."
        searchNotFoundMessage="Nenhum veículo encontrado para esta busca."
        onRowClick={(vehicle) => open("details", vehicle)}
        searchBarComponent={
          <Button onClick={() => open("create")} variant="primary" size="md">
            Criar novo veículo
          </Button>
        }
      />

      <VehicleDetailsModal
        isOpen={activeModal === "details"}
        onClose={close}
        vehicle={selectedVehicle}
      />

      <VehicleAddModal
        isOpen={activeModal === "create"}
        onClose={close}
        isAdmin={true}
      />

      <VehicleEditModal
        isOpen={activeModal === "edit"}
        onClose={close}
        vehicle={selectedVehicle}
      />

      <VehicleDeleteModal
        isOpen={activeModal === "delete"}
        onClose={close}
        vehicle={selectedVehicle}
      />
    </div>
  );
}
