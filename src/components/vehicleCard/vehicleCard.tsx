import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { CarIcon } from "./carIcon";

type VehicleCardProps = {
  size?: "lg" | "sm";
  type?: "vehicle" | "add";
  hasDelete?: boolean;
  licensePlate?: string;
  text?: string;
  onClick?: () => void;
  onDelete?: () => void;
};

export function VehicleCard({
  size = "lg",
  type = "vehicle",
  hasDelete = false,
  licensePlate,
  text,
  onClick,
  onDelete,
}: VehicleCardProps) {
  const isLarge = size === "lg";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center border-2 font-bold",
        type === "add" ? "border-gray-300" : "border-dark-blue",
        isLarge ? "size-36 rounded-4xl" : "size-18.5 rounded-2xl",
      )}
    >
      {type === "vehicle" ? (
        <>
          <CarIcon size={isLarge ? 64 : 28} className="text-dark-blue" />

          <span
            className={cn(
              "text-black",
              isLarge ? "mt-2 text-[28px]" : "mt-1 text-sm",
            )}
          >
            {licensePlate || ""}
          </span>

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
        </>
      ) : (
        <>
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-dark-blue",
              isLarge ? "size-20" : "size-10",
            )}
          >
            <Plus size={isLarge ? 40 : 20} className="text-white" />
          </div>

          <span
            className={cn(
              "text-center text-dark-blue",
              isLarge ? "mt-4 text-[28px]" : "mt-2 text-sm",
            )}
          >
            {text || "Adicionar veículo"}
          </span>
        </>
      )}
    </button>
  );
}