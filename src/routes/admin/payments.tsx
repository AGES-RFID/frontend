import { useEffect, useMemo, useState } from "react";
import { HTTPError } from "ky";
import { toast } from "@/components/ui/toast";
import { PricingTable } from "@/features/users/components/PricingTable";
import { EditValues } from "@/features/parkingPrices/components/editValues";
import { useParkingPrices } from "@/features/parkingPrices/hooks";
import { formatCurrency } from "@/utils/formatting";

export function Payments() {
  const [isEditValuesModalOpen, setIsEditValuesModalOpen] = useState(false);
  const parkingPricesQuery = useParkingPrices();

  const activeParkingPrice = useMemo(() => {
    return parkingPricesQuery.data?.[0] ?? null;
  }, [parkingPricesQuery.data]);

  useEffect(() => {
    if (!parkingPricesQuery.isError) return;

    const error = parkingPricesQuery.error;
    if (error instanceof HTTPError) {
      toast.error(
        `Nao foi possivel carregar os valores. (status ${error.response.status})`,
      );
      return;
    }

    toast.error("Nao foi possivel carregar os valores.");
  }, [parkingPricesQuery.error, parkingPricesQuery.isError]);

  const pricingTableData = useMemo(() => {
    if (!activeParkingPrice) return undefined;

    return {
      ate3Horas: formatCurrency(activeParkingPrice.basePrice),
      horaAdicional: formatCurrency(activeParkingPrice.hourlyRate),
    };
  }, [activeParkingPrice]);

  return (
    <div className="flex min-h-screen justify-center p-16">
      <main className="w-full max-w-760px">
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

            <PricingTable data={pricingTableData} />
          </div>
        </section>
      </main>

      <EditValues
        isOpen={isEditValuesModalOpen}
        onClose={() => setIsEditValuesModalOpen(false)}
        parkingPriceId={activeParkingPrice?.parkingPriceId}
      />
    </div>
  );
}
