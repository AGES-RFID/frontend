import { useState } from "react";
import { PricingTable } from "@/features/users/components/PricingTable";
import { EditValuesModal } from "@/features/parking-prices/components/EditValuesModal";
import { RecentExitsTable } from "@/features/accesses/components/recent-exits-table";
import { useRecentExits } from "@/features/accesses/hooks/useRecentExits";

export function Payments() {
  const [isEditValuesModalOpen, setIsEditValuesModalOpen] = useState(false);
  const { data: recentExits = [], isLoading } = useRecentExits();

  return (
    <div className="flex min-h-screen justify-center p-16">
      <main className="w-full max-w-[760px]">
        <h1 className="mb-16 text-center font-bold text-3xl text-dark-blue">
          Cobrança
        </h1>

        <section className="space-y-10">
          <div className="mt-30">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-semibold text-2xl text-dark-blue">
                Valores do estacionamento
              </h2>

              <button
                type="button"
                onClick={() => setIsEditValuesModalOpen(true)}
                className="rounded-md bg-dark-blue px-6 py-2 font-medium text-white"
              >
                Editar Valores
              </button>
            </div>

            <PricingTable />
          </div>

          <div>
            <h2 className="mb-1 font-semibold text-2xl text-dark-blue">
              Saídas recentes
            </h2>

            <RecentExitsTable accesses={recentExits} isLoading={isLoading} />
          </div>
        </section>
      </main>

      <EditValuesModal
        isOpen={isEditValuesModalOpen}
        onClose={() => setIsEditValuesModalOpen(false)}
      />
    </div>
  );
}
