import { type ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { HTTPError } from "ky";
import { toast } from "@/components/ui/toast";
import {
  useParkingPrice,
  useUpdateParkingPrice,
} from "@/features/parkingPrices/hooks";
import { formatCurrency } from "@/utils/formatting";

type EditValuesProps = {
  onClose: () => void;
  isOpen: boolean;
  parkingPriceId?: string;
  onSave?: () => void;
};

export function EditValues(props: EditValuesProps) {
  const [exemptionMinutes, setExemptionMinutes] = useState("");
  const [priceUpTo3HoursInCents, setPriceUpTo3HoursInCents] = useState<
    number | null
  >(null);
  const [additionalHourlyRateInCents, setAdditionalHourlyRateInCents] =
    useState<number | null>(null);
  const updateParkingPriceMutation = useUpdateParkingPrice();
  const parkingPriceQuery = useParkingPrice(props.parkingPriceId ?? "", {
    enabled: props.isOpen && !!props.parkingPriceId,
  });
  const isSubmitting = updateParkingPriceMutation.isPending;

  useEffect(() => {
    if (!props.isOpen || !parkingPriceQuery.data) return;

    setExemptionMinutes(String(parkingPriceQuery.data.toleranceMinutes));
    setPriceUpTo3HoursInCents(
      Math.round(parkingPriceQuery.data.basePrice * 100),
    );
    setAdditionalHourlyRateInCents(
      Math.round(parkingPriceQuery.data.hourlyRate * 100),
    );
  }, [props.isOpen, parkingPriceQuery.data]);

  useEffect(() => {
    if (parkingPriceQuery.isError) {
      toast.error("Nao foi possivel carregar os valores.");
    }
  }, [parkingPriceQuery.isError]);

  const handleExemptionMinutesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const onlyDigits = event.target.value.replace(/\D/g, "");
    setExemptionMinutes(onlyDigits);
  };

  const parseCurrencyInputToCents = (value: string) => {
    const onlyDigits = value.replace(/\D/g, "");
    if (!onlyDigits) return null;
    return Number(onlyDigits);
  };

  const handlePriceUpTo3HoursChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setPriceUpTo3HoursInCents(parseCurrencyInputToCents(event.target.value));
  };

  const handleAdditionalHourlyRateChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setAdditionalHourlyRateInCents(
      parseCurrencyInputToCents(event.target.value),
    );
  };

  const handleClose = () => {
    setExemptionMinutes("");
    setPriceUpTo3HoursInCents(null);
    setAdditionalHourlyRateInCents(null);
    props.onClose();
  };

  const handleConfirm = () => {
    if (!props.parkingPriceId) {
      toast.error("Parking price id is missing.");
      return;
    }

    if (!parkingPriceQuery.data) {
      toast.error("Parking values are not loaded yet.");
      return;
    }

    updateParkingPriceMutation.mutate(
      {
        parkingPriceId: props.parkingPriceId,
        updateParkingPriceDto: {
          toleranceMinutes: Number(exemptionMinutes),
          basePrice: (priceUpTo3HoursInCents ?? 0) / 100,
          hourlyRate: (additionalHourlyRateInCents ?? 0) / 100,
          thresholdMinutes: parkingPriceQuery.data.thresholdMinutes ?? 180,
        },
      },
      {
        onSuccess: () => {
          toast.success("Valores atualizados com sucesso.");
          props.onSave?.();
          handleClose();
        },
        onError: (error) => {
          if (error instanceof HTTPError) {
            toast.error(
              `Erro ao atualizar os valores. (status ${error.response.status})`,
            );
            return;
          }
          toast.error("Erro ao atualizar os valores.");
        },
      },
    );
  };

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose} title="Editar valores">
      <div className="mx-auto w-fit space-y-4">
        <Input
          label="Tempo de Isenção (em minutos)"
          placeholder="Ex: 20"
          value={exemptionMinutes}
          onChange={handleExemptionMinutesChange}
        />
        <Input
          label="Valor até 3 horas"
          placeholder="R$ 20,00"
          value={
            priceUpTo3HoursInCents === null
              ? ""
              : formatCurrency(priceUpTo3HoursInCents / 100)
          }
          onChange={handlePriceUpTo3HoursChange}
        />
        <Input
          label="Valor da hora adicional"
          placeholder="R$ 3,00"
          value={
            additionalHourlyRateInCents === null
              ? ""
              : formatCurrency(additionalHourlyRateInCents / 100)
          }
          onChange={handleAdditionalHourlyRateChange}
        />
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button
          variant="borderless"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isSubmitting || !props.parkingPriceId}
        >
          {isSubmitting ? "Salvando..." : "Confirmar"}
        </Button>
      </div>
    </Modal>
  );
}
