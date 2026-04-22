import { Plus } from "lucide-react";
import { cn } from "@/utils/cn";

type AddVehicleCardProps = {
  size?: "lg" | "sm";
  onClick?: () => void;
};

export function AddVehicleCard({ size = "lg", onClick }: AddVehicleCardProps) {
  const isLarge = size === "lg";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center border-2 border-light-gray font-bold",
        isLarge ? "size-36 rounded-4xl" : "size-18.5 rounded-2xl",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-dark-blue",
          isLarge ? "size-15" : "size-10",
        )}
      >
        <Plus size={isLarge ? 28 : 16} strokeWidth={3} className="text-white" />
      </div>

      <span
        className={cn(
          "text-center font-bold text-dark-blue",
          isLarge
            ? "mt-3 text-[16px] leading-tight"
            : "mt-2 text-sm leading-tight",
        )}
      >
        Adicionar veículo
      </span>
    </button>
  );
}
