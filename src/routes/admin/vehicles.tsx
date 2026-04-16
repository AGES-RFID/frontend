import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  type TableAction,
  type TableColumn,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import {
  useVehicles,
  useCreateVehicle,
  useEditVehicle,
  useDeleteVehicle,
  useVehiclesModalState,
} from "@/features/vehicles/hooks";
import { useUsers } from "@/features/users/hooks";
import { VehicleAddModal } from "@/features/vehicles/components/VehicleAddModal";
import { VehicleDetailsModal } from "@/features/vehicles/components/VehicleDetailsModal";
import { VehicleEditModal } from "@/features/vehicles/components/VehicleEditModal";
import { VehicleDeleteModal } from "@/features/vehicles/components/VehicleDeleteModal";
import type { CreateVehicleDto } from "@/features/vehicles/dtos";
import type { VehicleWithOwnerDto } from "@/features/vehicles/dtos";
import { formatDateTime } from "@/utils/formatting";

export function Vehicles() {
  const vehiclesQuery = useVehicles();
  const usersQuery = useUsers();
  const createVehicleMutation = useCreateVehicle();
  const editVehicleMutation = useEditVehicle();
  const deleteVehicleMutation = useDeleteVehicle();

  const { activeModal, selectedVehicle, openDetails, openCreate, openEdit, openDelete, close } =
    useVehiclesModalState();

  const vehicles = vehiclesQuery.data ?? [];
  const owners = usersQuery.data ?? [];

  const isLoading =
    vehiclesQuery.isLoading ||
    vehiclesQuery.isFetching ||
    usersQuery.isLoading ||
    usersQuery.isFetching;

  // Error handling
  if (vehiclesQuery.error) {
    toast.error(
      vehiclesQuery.error instanceof Error
        ? vehiclesQuery.error.message
        : "Não foi possível carregar os veículos.",
    );
  }

  if (usersQuery.error) {
    toast.error(
      usersQuery.error instanceof Error
        ? usersQuery.error.message
        : "Não foi possível carregar os usuários.",
    );
  }

  const handleCreateVehicle = (formData: CreateVehicleDto) => {
    createVehicleMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Veículo criado com sucesso.");
        close();
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Erro ao criar veículo.",
        );
      },
    });
  };

  const handleEditVehicle = (formData: Partial<CreateVehicleDto>) => {
    if (!selectedVehicle) return;

    editVehicleMutation.mutate(
      { vehicleId: selectedVehicle.vehicleId, updateVehicleDto: formData },
      {
        onSuccess: () => {
          toast.success("Veículo atualizado com sucesso.");
          close();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Erro ao atualizar veículo.",
          );
        },
      },
    );
  };

  const handleDeleteVehicle = () => {
    if (!selectedVehicle) return;

    deleteVehicleMutation.mutate(
      { vehicleId: selectedVehicle.vehicleId },
      {
        onSuccess: () => {
          toast.success("Veículo excluído com sucesso.");
          close();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Erro ao excluir veículo.",
          );
        },
      },
    );
  };

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
        render: (value: any) => value?.name ?? "Usuário não encontrado",
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
      onClick: openEdit,
      className:
        "text-blue hover:text-light-blue cursor-pointer transition-colors",
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <Trash2 size={18} />,
      onClick: openDelete,
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

      {vehiclesQuery.error || usersQuery.error ? (
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
        onRowClick={openDetails}
        searchBarComponent={
          <Button onClick={openCreate} variant="primary" size="md">
            Criar novo veículo
          </Button>
        }
      />

      {activeModal === "details" && (
        <VehicleDetailsModal
          isOpen={true}
          onClose={close}
          vehicle={selectedVehicle}
        />
      )}

      {activeModal === "create" && (
        <VehicleAddModal
          isOpen={true}
          onClose={close}
          isSubmitting={createVehicleMutation.isPending}
          onSubmit={handleCreateVehicle}
          isAdmin={true}
          owners={owners}
        />
      )}

      {activeModal === "edit" && (
        <VehicleEditModal
          isOpen={true}
          onClose={close}
          vehicle={selectedVehicle}
          owners={owners}
          isSubmitting={editVehicleMutation.isPending}
          onSubmit={handleEditVehicle}
        />
      )}

      {activeModal === "delete" && (
        <VehicleDeleteModal
          isOpen={true}
          onClose={close}
          vehicle={selectedVehicle}
          isDeleting={deleteVehicleMutation.isPending}
          onConfirm={handleDeleteVehicle}
        />
      )}
    </div>
  );
}
