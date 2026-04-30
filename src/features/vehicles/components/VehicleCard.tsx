import { Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { CarIcon } from "../assets/carIcon";

type VehicleCardProps = {
  size?: "lg" | "sm";
  hasDelete?: boolean;
  licensePlate: string;
  onClick?: () => void;
  onDelete?: () => void;
};

export function VehicleCard({
  size = "lg",
  hasDelete = false,
  licensePlate,
  onClick,
  onDelete,
}: VehicleCardProps) {
  const isLarge = size === "lg";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center border-2 border-dark-blue font-bold",
        isLarge ? "size-36 rounded-4xl" : "size-18.5 rounded-2xl",
      )}
    >
      {/*ícone carro*/}
      <CarIcon size={isLarge ? 64 : 28} className="text-dark-blue" />

      {/*placa*/}
      <span
        className={cn(
          "text-black",
          isLarge ? "mt-2 text-[28px]" : "mt-1 text-sm",
        )}
      >
        {licensePlate}
      </span>

      {/*delete*/}
      {hasDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className={cn(
            "absolute cursor-pointer text-black transition-colors hover:text-red",
            isLarge ? "top-2 right-2" : "top-1 right-1",
          )}
        >
          <Trash2 size={isLarge ? 18 : 14} />
        </button>
      )}
    </button>
  );
}
