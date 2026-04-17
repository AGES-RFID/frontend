import { useEffect, useMemo, useState } from "react";
import { VehicleAddModal } from "@/features/vehicles/components/VehicleAddModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  type TableAction,
  type TableColumn,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";

const vehicleSchema = z.object({
  userId: z.uuid(),
  vehicleId: z.uuid(),
  plate: z.string(),
  brand: z.string(),
  model: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const vehicleListSchema = z.array(vehicleSchema);

const vehicleOwnerSchema = z.object({
  userId: z.uuid(),
  name: z.string(),
  email: z.email(),
});

const vehicleOwnerListSchema = z.array(vehicleOwnerSchema);

type VehicleDto = z.infer<typeof vehicleSchema>;

type Vehicle = VehicleDto & {
  ownerName: string;
  ownerEmail: string;
};

type VehicleFormValues = {
  userId: string;
  plate: string;
  brand: string;
  model: string;
};

const emptyForm: VehicleFormValues = {
  userId: "",
  plate: "",
  brand: "",
  model: "",
};

const datetimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatDateTime(value: string) {
  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime())
    ? value
    : datetimeFormatter.format(parsedDate);
}

function normalizePlate(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);
}

function buildVehiclePayload(formData: VehicleFormValues) {
  return {
    userId: formData.userId,
    plate: normalizePlate(formData.plate),
    brand: formData.brand.trim(),
    model: formData.model.trim(),
  };
}

export function Vehicles() {
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<VehicleFormValues>(emptyForm);

  const usersQuery = useQuery({
    queryKey: ["vehicle-owners"],
    queryFn: async () =>
      vehicleOwnerListSchema.parse(await api.get("users").json()),
  });

  const vehiclesQuery = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: async () =>
      vehicleListSchema.parse(await api.get("vehicles").json()),
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (formData: VehicleFormValues) =>
      vehicleSchema.parse(
        await api
          .post("vehicles", { json: buildVehiclePayload(formData) })
          .json(),
      ),
    onSuccess: async () => {
      toast.success("Veículo criado com sucesso.");
      await queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      closeCreateModal();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar veículo.",
      );
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: async ({
      vehicleId,
      formData,
    }: {
      vehicleId: string;
      formData: VehicleFormValues;
    }) =>
      vehicleSchema.parse(
        await api
          .put(`vehicles/${vehicleId}`, { json: buildVehiclePayload(formData) })
          .json(),
      ),
    onSuccess: async () => {
      toast.success("Veículo atualizado com sucesso.");
      await queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      closeEditModal();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar veículo.",
      );
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      await api.delete(`vehicles/${vehicleId}`);
    },
    onSuccess: async () => {
      toast.success("Veículo excluído com sucesso.");
      await queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      closeDeleteModal();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Erro ao excluir veículo.",
      );
    },
  });

  useEffect(() => {
    if (usersQuery.error) {
      toast.error(
        usersQuery.error instanceof Error
          ? usersQuery.error.message
          : "Não foi possível carregar os proprietários.",
      );
    }
  }, [usersQuery.error]);

  useEffect(() => {
    if (vehiclesQuery.error) {
      toast.error(
        vehiclesQuery.error instanceof Error
          ? vehiclesQuery.error.message
          : "Não foi possível carregar os veículos.",
      );
    }
  }, [vehiclesQuery.error]);

  const owners = usersQuery.data ?? [];

  const ownersById = useMemo(
    () => new Map(owners.map((owner) => [owner.userId, owner])),
    [owners],
  );

  const vehicles = useMemo<Vehicle[]>(
    () =>
      (vehiclesQuery.data ?? []).map((vehicle) => {
        const owner = ownersById.get(vehicle.userId);
        return {
          ...vehicle,
          ownerName: owner?.name ?? "Usuário não encontrado",
          ownerEmail: owner?.email ?? "-",
        };
      }),
    [vehiclesQuery.data, ownersById],
  );

  const isLoading =
    usersQuery.isLoading ||
    usersQuery.isFetching ||
    vehiclesQuery.isLoading ||
    vehiclesQuery.isFetching;

  const openCreateModal = () => {
    setSelectedVehicle(null);
    setForm(emptyForm);
    setIsCreateModalOpen(true);
  };

  const openDetailsModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setForm({
      userId: vehicle.userId,
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setForm(emptyForm);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedVehicle(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVehicle(null);
    setForm(emptyForm);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleFieldChange =
    (field: keyof VehicleFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue =
        field === "plate"
          ? normalizePlate(event.target.value)
          : event.target.value;

      setForm((currentForm) => ({
        ...currentForm,
        [field]: nextValue,
      }));
    };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedVehicle) {
      return;
    }

    updateVehicleMutation.mutate({
      vehicleId: selectedVehicle.vehicleId,
      formData: form,
    });
  };

  const handleDelete = () => {
    if (!selectedVehicle) {
      return;
    }

    deleteVehicleMutation.mutate(selectedVehicle.vehicleId);
  };

  const columns = useMemo<TableColumn<Vehicle>[]>(
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
        key: "ownerName",
        title: "Proprietário",
        className: "w-72",
        sortable: true,
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

  const actions: TableAction<Vehicle>[] = [
    {
      key: "edit",
      label: "Editar",
      icon: <Edit size={18} />,
      onClick: openEditModal,
      className:
        "text-blue hover:text-light-blue cursor-pointer transition-colors",
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <Trash2 size={18} />,
      onClick: openDeleteModal,
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

      {usersQuery.error || vehiclesQuery.error ? (
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
        onRowClick={openDetailsModal}
        searchBarComponent={
          <Button onClick={openCreateModal} variant="primary" size="md">
            Criar novo veículo
          </Button>
        }
      />

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        title="Detalhes do veículo"
      >
        {selectedVehicle ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">ID</p>
                <p className="break-all text-dark-gray">
                  {selectedVehicle.vehicleId}
                </p>
              </div>
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">
                  Placa
                </p>
                <p className="text-dark-gray">{selectedVehicle.plate}</p>
              </div>
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">
                  Marca
                </p>
                <p className="text-dark-gray">{selectedVehicle.brand}</p>
              </div>
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">
                  Modelo
                </p>
                <p className="text-dark-gray">{selectedVehicle.model}</p>
              </div>
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">
                  Proprietário
                </p>
                <p className="text-dark-gray">{selectedVehicle.ownerName}</p>
                <p className="text-gray text-sm">
                  {selectedVehicle.ownerEmail}
                </p>
              </div>
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">
                  ID do proprietário
                </p>
                <p className="break-all text-dark-gray">
                  {selectedVehicle.userId}
                </p>
              </div>
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">
                  Criado em
                </p>
                <p className="text-dark-gray">
                  {formatDateTime(selectedVehicle.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">
                  Atualizado em
                </p>
                <p className="text-dark-gray">
                  {formatDateTime(selectedVehicle.updatedAt)}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={closeDetailsModal}
                variant="secondary"
                type="button"
              >
                Fechar
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <VehicleAddModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        isSubmitting={createVehicleMutation.isPending}
        onSubmit={(data) => createVehicleMutation.mutate(data)}
        isAdmin={true}
        owners={owners}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Editar veículo"
      >
        <form className="space-y-4" onSubmit={handleEditSubmit}>
          <label className="flex flex-col gap-1 font-medium text-dark-gray text-sm">
            Proprietário
            <select
              className="h-10 rounded-md border border-light-gray bg-white px-4 text-dark-gray outline-none focus:border-dark-gray"
              value={form.userId}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  userId: event.target.value,
                }))
              }
              required
            >
              <option value="">Selecione um proprietário</option>
              {owners.map((owner) => (
                <option key={owner.userId} value={owner.userId}>
                  {owner.name} - {owner.email}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Placa"
            value={form.plate}
            onChange={handleFieldChange("plate")}
            required
            width="100%"
            maxLength={7}
            placeholder="Digite a placa"
          />
          <Input
            label="Marca"
            value={form.brand}
            onChange={handleFieldChange("brand")}
            required
            width="100%"
            placeholder="Digite a marca"
          />
          <Input
            label="Modelo"
            value={form.model}
            onChange={handleFieldChange("model")}
            required
            width="100%"
            placeholder="Digite o modelo"
          />

          <div className="flex justify-end gap-2">
            <Button onClick={closeEditModal} variant="secondary" type="button">
              Cancelar
            </Button>
            <Button type="submit" disabled={updateVehicleMutation.isPending}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Excluir veículo"
      >
        <div className="space-y-4">
          <p>
            Tem certeza que deseja excluir o veículo "{selectedVehicle?.plate}"?
          </p>
          <p className="text-gray text-sm">Esta ação não pode ser desfeita.</p>

          <div className="flex justify-end gap-2">
            <Button
              onClick={closeDeleteModal}
              variant="secondary"
              type="button"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              type="button"
              disabled={deleteVehicleMutation.isPending}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
