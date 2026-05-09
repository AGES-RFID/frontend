import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useMe } from "@/features/auth/hooks/useMe";
import { AddCreditModal } from "@/features/transactions/components/add-credit-modal";
import { useCreateTransaction } from "@/features/transactions/hooks/useCreateTransaction";
import { PricingTable } from "@/features/users/components/PricingTable";
import { AddVehicleCard } from "@/features/vehicles/components/AddVehicleButton";
import { VehicleAddModal } from "@/features/vehicles/components/VehicleAddModal";
import { VehicleCard } from "@/features/vehicles/components/VehicleCard";
import { VehicleDeleteModal } from "@/features/vehicles/components/VehicleDeleteModal";
import { formatCurrency } from "@/utils/formatting";

export function Home() {
  const meQuery = useMe();

  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<{
    vehicleId: string;
    plate: string;
  } | null>(null);

  const createTransactionMutation = useCreateTransaction();

  function openDeleteVehicleModal(vehicleId: string, plate: string) {
    setVehicleToDelete({ vehicleId, plate });
  }

  function closeDeleteVehicleModal() {
    setVehicleToDelete(null);
  }

  async function handleAddCredit(value: number) {
    createTransactionMutation.mutate(
      {
        amount: value,
        description: "Crédito adicionado pelo usuário",
      },
      {
        onSuccess: () => {
          toast.success(
            `Crédito adicionado! R$ ${formatCurrency(value)} foram adicionados ao seu saldo.`,
          );
          setIsCreditModalOpen(false);
          meQuery.refetch();
        },
        onError: () => {
          toast.error("Ocorreu um erro ao adicionar crédito. Tente novamente.");
        },
      },
    );
  }

  if (meQuery.isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-xl space-y-6 py-10">
        <h1 className="mb-12 animate-pulse text-center font-bold text-4xl text-dark-blue">
          Carregando...
        </h1>
      </div>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return (
      <div className="mx-auto min-h-screen max-w-xl space-y-6 py-10">
        <h1 className="mb-12 text-center font-bold text-4xl text-dark-blue">
          Ocorreu um erro ao carregar seus dados.
        </h1>
      </div>
    );
  }

  return (
    <>
      <main className="mx-auto min-h-screen max-w-xl space-y-6 py-10">
        <h1 className="mb-12 text-center font-bold text-4xl text-dark-blue">
          Olá, {meQuery.data?.name}!
        </h1>

        <section className="flex w-full flex-col items-center rounded-xl bg-baby-blue px-14 py-8">
          <p className="font-bold text-base text-dark-blue">Seu saldo:</p>

          <strong className="mt-2 font-bold text-5xl text-light-teal">
            {formatCurrency(meQuery.data?.balance || 0)}
          </strong>

          <Button
            type="button"
            onClick={() => setIsCreditModalOpen(true)}
            size="lg"
            className="mt-5"
          >
            Adicionar saldo
          </Button>
        </section>

        <section className="w-full">
          <h2 className="mb-4 font-bold text-base text-dark-blue">
            Seus veículos
          </h2>

          <div className="flex flex-wrap items-center gap-4">
            {meQuery.data?.vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.vehicleId}
                size="lg"
                licensePlate={vehicle.plate}
                hasDelete
                onClick={() =>
                  openDeleteVehicleModal(vehicle.vehicleId, vehicle.plate)
                }
                onDelete={() =>
                  openDeleteVehicleModal(vehicle.vehicleId, vehicle.plate)
                }
              />
            ))}

            <AddVehicleCard onClick={() => setIsVehicleModalOpen(true)} />
          </div>
        </section>

        <PricingTable className="w-full" />
      </main>

      <AddCreditModal
        isOpen={isCreditModalOpen}
        clientBalance={meQuery.data?.balance || 0}
        onClose={() => setIsCreditModalOpen(false)}
        onConfirm={handleAddCredit}
      />

      <VehicleAddModal
        isAdmin={false}
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        userId={meQuery.data?.userId}
      />

      <VehicleDeleteModal
        isOpen={vehicleToDelete !== null}
        onClose={closeDeleteVehicleModal}
        vehicle={vehicleToDelete}
      />
    </>
  );
}
