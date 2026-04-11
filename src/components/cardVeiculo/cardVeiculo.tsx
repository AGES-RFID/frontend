import { Trash2 } from "lucide-react";
import { CarIcon } from "./carIcon";

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
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-blue-900 font-bold ${isLarge ? "h-[149px] w-[149px]" : "h-[74px] w-[74px]"}
      `}
    >
      {/*ícone carro*/}
      <CarIcon size={isLarge ? 64 : 28} className="text-blue-900" />

      {/*placa*/}
      <span
        className={`text-black ${isLarge ? "mt-2 text-[28px]" : "mt-1 text-[14px]"}
        `}
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
          className="absolute top-1 right-1 text-black hover:text-red-600"
        >
          <Trash2 size={isLarge ? 18 : 14} />
        </button>
      )}
    </button>
  );
}
