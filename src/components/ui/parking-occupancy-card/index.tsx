import { cn } from "@/utils/cn";

type ParkingOccupancyCardProps = {
  title?: string;
  vehiclesCount: number;
  totalSpots: number;
  className?: string;
};

function getProgressBarColor(rawPercentage: number) {
  if (rawPercentage > 90) {
    return "#ef4444";
  }

  if (rawPercentage > 75) {
    return "#facc15";
  }

  return "#0C7C86";
}

export function ParkingOccupancyCard({
  title = "Lotação do estacionamento",
  vehiclesCount,
  totalSpots,
  className,
}: Readonly<ParkingOccupancyCardProps>) {
  const safeTotalSpots = Math.max(totalSpots, 0);

  const rawPercentage =
    safeTotalSpots === 0 ? 0 : (vehiclesCount / safeTotalSpots) * 100;

  const cappedPercentage = Math.min(Math.max(rawPercentage, 0), 100);

  const progressBarColor = getProgressBarColor(rawPercentage);

  return (
    <section
      data-testid="parking-occupancy-card"
      className={cn(
        "w-full rounded-[28px] bg-white px-10 py-8 shadow-sm",
        className,
      )}
    >
      <h2
        data-testid="parking-occupancy-title"
        className="font-bold text-[32px] text-black"
      >
        {title}
      </h2>

      <div className="mt-8 flex items-center gap-8">
        <div
          data-testid="parking-occupancy-progress-track"
          className="h-12 flex-1 overflow-hidden rounded-full bg-[#C7D2E2]"
        >
          <div
            data-testid="parking-occupancy-progress-bar"
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${cappedPercentage}%`,
              backgroundColor: progressBarColor,
            }}
          />
        </div>

        <span
          data-testid="parking-occupancy-label"
          className="min-w-fit font-bold text-[56px] text-black leading-none"
        >
          {vehiclesCount}/{totalSpots}
        </span>
      </div>
    </section>
  );
}
