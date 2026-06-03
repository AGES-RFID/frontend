import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import { useUpdateAntenna } from "../hooks";
import type { AntennaDto } from "../dtos";

interface AdjustAntennaModalProps {
  isOpen: boolean;
  onClose: () => void;
  antenna: AntennaDto | null;
}

export function AdjustAntennaModal({
  isOpen,
  onClose,
  antenna,
}: AdjustAntennaModalProps) {
  const [status, setStatus] = useState<"On" | "Off">("Off");
  const [sensibility, setSensibility] = useState<string>("");
  const [power, setPower] = useState<string>("");

  const updateAntennaMutation = useUpdateAntenna();
  const isPending = updateAntennaMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      setStatus(antenna?.status ?? "Off");
      setSensibility(
        antenna?.sensibility !== undefined && antenna?.sensibility !== null
          ? String(antenna.sensibility)
          : "",
      );
      setPower(
        antenna?.power !== undefined && antenna?.power !== null
          ? String(antenna.power)
          : "",
      );
    }
  }, [isOpen, antenna]);

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!antenna?.id) return;

    const parsedSensibility =
      sensibility === "" || Number.isNaN(Number(sensibility))
        ? null
        : Number(sensibility);
    const parsedPower =
      power === "" || Number.isNaN(Number(power)) ? null : Number(power);

    if (
      parsedSensibility !== null &&
      (parsedSensibility < -93 || parsedSensibility > -30)
    ) {
      toast.error("A sensibilidade deve estar entre -93 dBm e -30 dBm.");
      return;
    }

    if (parsedPower !== null && (parsedPower < 10 || parsedPower > 33)) {
      toast.error("A potência deve estar entre 10 dBm e 33 dBm.");
      return;
    }

    try {
      await updateAntennaMutation.mutateAsync({
        antennaId: antenna.id,
        updateDto: {
          status,
          sensibility: parsedSensibility,
          power: parsedPower,
        },
      });
      toast.success("Antena ajustada com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar no servidor (simulação: fechando modal).");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Ajustar Antena">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Toggle Status */}
        <div className="flex flex-col gap-1.5">
          <span className="font-medium text-[14px] text-dark-gray leading-5">
            Status
          </span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              role="switch"
              aria-label="Status da antena"
              aria-checked={status === "On"}
              checked={status === "On"}
              onChange={(e) => setStatus(e.target.checked ? "On" : "Off")}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-light-gray/40 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green peer-checked:after:translate-x-full peer-focus:outline-none" />
            <span className="ml-2 font-medium text-dark-gray text-sm">
              {status === "On" ? "Ligado (On)" : "Desligado (Off)"}
            </span>
          </label>
        </div>

        {/* Sensibility Numeric Input */}
        <div className="flex flex-col gap-0.5">
          <Input
            label="Sensibilidade (dBm)"
            type="number"
            min={-93}
            max={-30}
            placeholder="Ex: -50"
            value={sensibility}
            onChange={(e) => {
              if (e.target.value.length <= 4) setSensibility(e.target.value);
            }}
            width="100%"
          />
          <span className="px-1 text-[11px] text-gray">
            Valores válidos: -93 a -30 dBm (máx. 4 caracteres)
          </span>
        </div>

        {/* Power Numeric Input */}
        <div className="flex flex-col gap-0.5">
          <Input
            label="Potência (dBm)"
            type="number"
            min={10}
            max={33}
            step="any"
            placeholder="Ex: 28.0"
            value={power}
            onChange={(e) => {
              if (e.target.value.length <= 4) setPower(e.target.value);
            }}
            width="100%"
          />
          <span className="px-1 text-[11px] text-gray">
            Valores válidos: 10.0 a 33.0 dBm (máx. 4 caracteres)
          </span>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="borderless" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Confirmando..." : "Confirmar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
