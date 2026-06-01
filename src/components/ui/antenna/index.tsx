import type * as React from "react";
import { SatelliteDish, SquarePen } from "lucide-react";
import { cn } from "@/utils/cn";

export interface AntennaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  status: "On" | "Off";
  sensitivity: string;
  power: string;
  editable?: boolean;
  onEdit?: () => void;
  labels?: {
    status?: string;
    sensitivity?: string;
    power?: string;
  };
}

export function AntennaCard({
  name,
  status,
  sensitivity,
  power,
  editable = false,
  onEdit,
  labels,
  className,
  ...props
}: Readonly<AntennaCardProps>) {
  const mergedLabels = {
    status: labels?.status ?? "Status:",
    sensitivity: labels?.sensitivity ?? "Sensitivity:",
    power: labels?.power ?? "Power:",
  };

  const isOn = status === "On";

  return (
    <div
      className={cn(
        "relative flex w-full max-w-sm items-start gap-4 rounded-xl border border-very-light-gray/40 bg-white p-4 shadow-xs transition-shadow duration-200 hover:shadow-sm",
        className,
      )}
      {...props}
    >
      {/* Left Column: Antenna Icon and Glowing Status Indicator */}
      <div className="relative mt-[34px] flex shrink-0 items-center justify-center">
        <SatelliteDish className="h-16 w-16 text-dark-gray" strokeWidth={1.5} />

        {/* Glowing Indicator Circle with Micro-Animation */}
        <span className="absolute -top-1.5 -right-0.5 flex h-4 w-4">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              isOn ? "bg-green" : "bg-red",
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-4 w-4 rounded-full transition-all duration-300",
              isOn
                ? "bg-green shadow-[0_0_12px_#20952c]"
                : "bg-red shadow-[0_0_12px_#f7323f]",
            )}
          />
        </span>
      </div>

      {/* Right Column: Title and Details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="mb-2 truncate font-bold text-dark-gray text-lg leading-tight">
          {name}
        </h3>

        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <span className="text-gray">{mergedLabels.status}</span>
          <span className="whitespace-nowrap font-semibold text-dark-gray">
            {status}
          </span>

          <span className="text-gray">{mergedLabels.sensitivity}</span>
          <span className="whitespace-nowrap font-semibold text-dark-gray">
            {sensitivity}
          </span>

          <span className="text-gray">{mergedLabels.power}</span>
          <span className="whitespace-nowrap font-semibold text-dark-gray">
            {power}
          </span>
        </div>
      </div>

      {/* Optional Edit Icon at Top-Right */}
      {editable && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-dark-gray transition-all duration-150 hover:bg-dark-blue/5 hover:text-dark-blue active:scale-95"
          aria-label={`Editar ${name}`}
        >
          <SquarePen className="h-5 w-5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
