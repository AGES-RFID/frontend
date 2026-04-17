import { useState } from "react";
import type { VehicleWithOwnerDto } from "../dtos";

type ModalType = "details" | "create" | "edit" | "delete" | null;

export function useVehiclesModalState() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleWithOwnerDto | null>(null);

  const open = (
    type: Exclude<ModalType, null>,
    vehicle?: VehicleWithOwnerDto,
  ) => {
    setActiveModal(type);
    setSelectedVehicle(type === "create" ? null : (vehicle ?? null));
  };

  const close = () => {
    setActiveModal(null);
    setSelectedVehicle(null);
  };

  return {
    activeModal,
    selectedVehicle,
    open,
    close,
  };
}
