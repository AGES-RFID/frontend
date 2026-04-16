import { useState } from "react";
import type { VehicleWithOwnerDto } from "../dtos";

type ModalType = "details" | "create" | "edit" | "delete" | null;

export function useVehiclesModalState() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleWithOwnerDto | null>(null);

  const open = (type: ModalType, vehicle?: VehicleWithOwnerDto) => {
    setActiveModal(type);
    if (vehicle && type !== "create") {
      setSelectedVehicle(vehicle);
    }
  };

  const close = () => {
    setActiveModal(null);
    setSelectedVehicle(null);
  };

  // Helper functions for convenience
  const openDetails = (vehicle: VehicleWithOwnerDto) => open("details", vehicle);
  const openCreate = () => open("create");
  const openEdit = (vehicle: VehicleWithOwnerDto) => open("edit", vehicle);
  const openDelete = (vehicle: VehicleWithOwnerDto) => open("delete", vehicle);

  return {
    activeModal,
    selectedVehicle,
    open,
    close,
    openDetails,
    openCreate,
    openEdit,
    openDelete,
  };
}
