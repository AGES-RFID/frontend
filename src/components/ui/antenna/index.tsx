import { Pencil, SatelliteDish } from "lucide-react";
import type * as React from "react";
import { cn } from "@/utils/cn";
import { Button } from "../button";

interface BaseAntennaCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onEdit"> {
  name: string;
  status: "On" | "Off";
  sensitivity: number | string;
  power: number | string;
  labels?: {
    status?: string;
    sensitivity?: string;
    power?: string;
  };
}

export type AntennaCardProps =
  | (BaseAntennaCardProps & {
      editable: true;
      onEdit: () => void;
    })
  | (BaseAntennaCardProps & {
      editable?: false;
      onEdit?: never;
    });

const formatSensitivity = (value: number | string): string => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "string" && value.includes("dBm")) {
    return value;
  }
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(num)) return `${value} dBm`;
  return `${num} dBm`;
};

const formatPower = (value: number | string): string => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "string" && value.includes("dBm")) {
    return value;
  }
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(num)) return `${value} dBm`;
  return `${num.toFixed(1)} dBm`;
};

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
  const formattedSensitivity = formatSensitivity(sensitivity);
  const formattedPower = formatPower(power);

  return (
    <div
      className={cn(
        "relative flex w-full max-w-sm items-start gap-4",
        className,
      )}
      {...props}
    >
      {/* Left Column: Antenna Icon and Glowing Status Indicator */}
      <div className="relative flex shrink-0 items-center justify-center self-center">
        <SatelliteDish className="h-16 w-16 text-dark-gray" strokeWidth={1.5} />

        {/* Glowing Indicator Circle with Micro-Animation */}
        <span
          className="absolute -top-1.5 -right-0.5 flex h-4 w-4"
          aria-hidden="true"
          data-testid="status-indicator"
          data-status={status}
        >
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              isOn ? "bg-green" : "bg-red",
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-4 w-4 rounded-full transition-all duration-300",
              isOn ? "bg-green shadow-glow-green" : "bg-red shadow-glow-red",
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
            {formattedSensitivity}
          </span>

          <span className="text-gray">{mergedLabels.power}</span>
          <span className="whitespace-nowrap font-semibold text-dark-gray">
            {formattedPower}
          </span>
        </div>
      </div>

      {/* Optional Edit Icon at Top-Right */}
      {editable && (
        <Button
          type="button"
          onClick={onEdit}
          icon
          size="sm"
          variant="borderless"
          aria-label={`Editar ${name}`}
        >
          <Pencil className="size-4" strokeWidth={1.5} />
        </Button>
      )}
    </div>
  );
}
