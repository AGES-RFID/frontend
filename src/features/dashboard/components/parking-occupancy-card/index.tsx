import { Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { EditOccupancyLimitModal } from "../EditOccupancyLimitModal";

type ParkingOccupancyCardProps = {
  title?: string;
  vehiclesCount: number;
  totalSpots: number;
  isEditable?: boolean;
  className?: string;
};

export function ParkingOccupancyCard({
  title = "Lotação do estacionamento",
  vehiclesCount,
  totalSpots,
  isEditable = false,
  className,
}: Readonly<ParkingOccupancyCardProps>) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const safeTotalSpots = Math.max(totalSpots, 0);

  const rawPercentage =
    safeTotalSpots === 0 ? 0 : (vehiclesCount / safeTotalSpots) * 100;

  const cappedPercentage = Math.min(Math.max(rawPercentage, 0), 100);

  return (
    <>
      <section
        data-testid="parking-occupancy-card"
        className={cn(
          "flex w-full flex-col justify-between gap-2 rounded-md bg-white p-8 drop-shadow-lg",
          className,
        )}
      >
        <header className="flex items-start justify-between">
          <h2
            data-testid="parking-occupancy-title"
            className="font-medium text-gray"
          >
            {title}
          </h2>

          {isEditable && (
            <button
              type="button"
              data-testid="parking-occupancy-edit-button"
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-md p-1 text-gray transition-colors hover:bg-very-light-gray hover:text-dark-gray"
              aria-label="Editar lotação máxima"
            >
              <Pencil className="size-4" />
            </button>
          )}
        </header>

        <div className="flex items-center gap-8">
          <div
            data-testid="parking-occupancy-progress-track"
            className="h-6 flex-1 overflow-hidden rounded-full bg-baby-blue"
          >
            <div
              data-testid="parking-occupancy-progress-bar"
              className={cn("h-full rounded-full transition-all duration-300", {
                "bg-red": rawPercentage > 90,
                "bg-yellow": rawPercentage > 75 && rawPercentage <= 90,
                "bg-teal": rawPercentage <= 75,
              })}
              style={{ width: `${cappedPercentage}%` }}
            />
          </div>

          <span
            data-testid="parking-occupancy-label"
            className="font-bold text-4xl text-dark-gray"
          >
            {vehiclesCount}/{totalSpots}
          </span>
        </div>
      </section>

      {isEditable && (
        <EditOccupancyLimitModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentMaxOccupancy={totalSpots}
        />
      )}
    </>
  );
}
