import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
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

type Vehicle = {
  id: string;
  plate: string;
  brand: string;
  model: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
};

type VehicleFormValues = {
  userId: string;
  plate: string;
  brand: string;
  model: string;
  owner: string;
};

type VehicleOwner = {
  userId: string;
  name: string;
  email: string;
};

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    plate: "ABC1D23",
    brand: "Volkswagen",
    model: "Polo",
    owner: "João Silva",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    plate: "XYZ9E87",
    brand: "Toyota",
    model: "Corolla",
    owner: "Maria Santos",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    plate: "DEF4G56",
    brand: "Chevrolet",
    model: "Onix",
    owner: "Pedro Oliveira",
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
  },
  {
    id: "4",
    plate: "GHI7J89",
    brand: "Fiat",
    model: "Argo",
    owner: "Ana Costa",
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "5",
    plate: "JKL5K01",
    brand: "Hyundai",
    model: "HB20",
    owner: "Carlos Ferreira",
    createdAt: "2024-01-19T11:30:00Z",
    updatedAt: "2024-01-19T11:30:00Z",
  },
  {
    id: "6",
    plate: "MNO2L34",
    brand: "Honda",
    model: "Civic",
    owner: "Lucia Pereira",
    createdAt: "2024-01-20T13:10:00Z",
    updatedAt: "2024-01-20T13:10:00Z",
  },
  {
    id: "7",
    plate: "PQR8M56",
    brand: "Renault",
    model: "Kwid",
    owner: "Roberto Alves",
    createdAt: "2024-01-21T08:25:00Z",
    updatedAt: "2024-01-21T08:25:00Z",
  },
  {
    id: "8",
    plate: "STU3N78",
    brand: "Nissan",
    model: "Versa",
    owner: "Fernanda Lima",
    createdAt: "2024-01-22T15:40:00Z",
    updatedAt: "2024-01-22T15:40:00Z",
  },
  {
    id: "9",
    plate: "VWX4O90",
    brand: "Jeep",
    model: "Renegade",
    owner: "Ricardo Mendes",
    createdAt: "2024-01-23T12:05:00Z",
    updatedAt: "2024-01-23T12:05:00Z",
  },
  {
    id: "10",
    plate: "YZA5P12",
    brand: "Ford",
    model: "Fiesta",
    owner: "Camila Rocha",
    createdAt: "2024-01-24T17:20:00Z",
    updatedAt: "2024-01-24T17:20:00Z",
  },
];

const emptyForm: VehicleFormValues = {
  userId: "",
  plate: "",
  brand: "",
  model: "",
  owner: "",
};

const mockOwners: VehicleOwner[] = [
  {
    userId: "11111111-1111-1111-1111-111111111111",
    name: "João Silva",
    email: "joao.silva@exemplo.com",
  },
  {
    userId: "22222222-2222-2222-2222-222222222222",
    name: "Maria Santos",
    email: "maria.santos@exemplo.com",
  },
  {
    userId: "33333333-3333-3333-3333-333333333333",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@exemplo.com",
  },
];

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
  return value.toUpperCase().slice(0, 7);
}

function buildCreatePayload(formData: VehicleFormValues) {
  return {
    userId: formData.userId,
    plate: normalizePlate(formData.plate),
    brand: formData.brand.trim(),
    model: formData.model.trim(),
  };
}

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<VehicleFormValues>(emptyForm);

  const createVehicleMutation = useMutation({
    mutationFn: async (formData: VehicleFormValues) =>
      api.post("vehicles", { json: buildCreatePayload(formData) }).json(),
    onSuccess: () => {
      toast.success("Veículo criado com sucesso.");
      closeCreateModal();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar veículo.",
      );
    },
  });

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
      userId: "",
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      owner: vehicle.owner,
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

  const handleCreateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createVehicleMutation.mutate(form, {
      onSuccess: () => {
        const ownerName =
          mockOwners.find((owner) => owner.userId === form.userId)?.name ??
          form.owner;
        const now = new Date().toISOString();

        setVehicles((currentVehicles) => [
          {
            id: crypto.randomUUID(),
            plate: normalizePlate(form.plate),
            brand: form.brand,
            model: form.model,
            owner: ownerName,
            createdAt: now,
            updatedAt: now,
          },
          ...currentVehicles,
        ]);
      },
    });
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedVehicle) {
      return;
    }

    setVehicles((currentVehicles) =>
      currentVehicles.map((vehicle) =>
        vehicle.id === selectedVehicle.id
          ? {
              ...vehicle,
              plate: form.plate,
              brand: form.brand,
              model: form.model,
              owner: form.owner,
              updatedAt: new Date().toISOString(),
            }
          : vehicle,
      ),
    );
    closeEditModal();
  };

  const handleDelete = () => {
    if (!selectedVehicle) {
      return;
    }

    setVehicles((currentVehicles) =>
      currentVehicles.filter((vehicle) => vehicle.id !== selectedVehicle.id),
    );
    closeDeleteModal();
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
        key: "owner",
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

      <Table
        data={vehicles}
        columns={columns}
        actions={actions}
        loading={false}
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
                <p className="break-all text-dark-gray">{selectedVehicle.id}</p>
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
                <p className="text-dark-gray">{selectedVehicle.owner}</p>
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

      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        title="Criar Veículo"
      >
        <form className="space-y-4" onSubmit={handleCreateSubmit}>
          <label className="flex flex-col gap-1 font-medium text-dark-gray text-sm">
            Proprietário
            <select
              className="h-10 rounded-md border border-light-gray bg-white px-4 text-dark-gray outline-none focus:border-dark-gray"
              value={form.userId}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  userId: event.target.value,
                  owner:
                    mockOwners.find(
                      (owner) => owner.userId === event.target.value,
                    )?.name ?? currentForm.owner,
                }))
              }
              required
            >
              <option value="">Selecione um proprietário</option>
              {mockOwners.map((owner) => (
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
          <Input
            label="Proprietário"
            value={form.owner}
            onChange={handleFieldChange("owner")}
            required
            width="100%"
            placeholder="Digite o proprietário"
          />

          <div className="flex justify-end gap-2">
            <Button
              onClick={closeCreateModal}
              variant="secondary"
              type="button"
            >
              Cancelar
            </Button>
            <Button type="submit">Criar</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Editar Veículo"
      >
        <form className="space-y-4" onSubmit={handleEditSubmit}>
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
          <Input
            label="Proprietário"
            value={form.owner}
            onChange={handleFieldChange("owner")}
            required
            width="100%"
            placeholder="Digite o proprietário"
          />

          <div className="flex justify-end gap-2">
            <Button onClick={closeEditModal} variant="secondary" type="button">
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Excluir Veículo"
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
            <Button onClick={handleDelete} variant="destructive" type="button">
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
