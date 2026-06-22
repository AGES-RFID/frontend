import {
  CheckCircle2Icon,
  CloudIcon,
  InfoIcon,
  ShieldIcon,
  TriangleAlertIcon,
  XCircleIcon,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/utils/cn";

type HealthStatus = "healthy" | "warning" | "error";

type SystemHealthItem = {
  id: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconBg: string;
  iconColor: string;
  status: HealthStatus;
};

type SystemHealthCardProps = {
  items?: SystemHealthItem[];
  title?: string;
  className?: string;
};

const statusIcon: Record<
  HealthStatus,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  healthy: CheckCircle2Icon,
  warning: TriangleAlertIcon,
  error: XCircleIcon,
};

const statusColor: Record<HealthStatus, string> = {
  healthy: "text-green",
  warning: "text-dark-orange",
  error: "text-red",
};

const defaultItems: SystemHealthItem[] = [
  {
    id: "rfid-cloud",
    label: "RFID Cloud Connection",
    icon: CloudIcon,
    iconBg: "bg-light-green",
    iconColor: "text-green",
    status: "healthy",
  },
  {
    id: "gate-controllers",
    label: "Gate Controllers",
    icon: TriangleAlertIcon,
    iconBg: "bg-yellow",
    iconColor: "text-dark-orange",
    status: "healthy",
  },
  {
    id: "gate-management",
    label: "Gate Management",
    icon: ShieldIcon,
    iconBg: "bg-yellow",
    iconColor: "text-dark-orange",
    status: "healthy",
  },
  {
    id: "system-status",
    label: "System Status",
    icon: InfoIcon,
    iconBg: "bg-light-red",
    iconColor: "text-red",
    status: "healthy",
  },
];

export function SystemHealthCard({
  items = defaultItems,
  title = "Saúde do sistema",
  className,
}: Readonly<SystemHealthCardProps>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-md bg-white p-6 drop-shadow-lg",
        className,
      )}
    >
      <span className="font-medium text-gray">{title}</span>

      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
        {items.map((item) => {
          const StatusIcon = statusIcon[item.status];
          const Icon = item.icon;

          return (
            <div key={item.id} className="col-span-full grid grid-cols-subgrid">
              <div
                className={cn(
                  "rounded-full p-0.5",
                  item.iconBg,
                  item.iconColor,
                )}
              >
                <Icon className="size-5" />
              </div>
              <strong>{item.label}</strong>
              <div className={statusColor[item.status]}>
                <StatusIcon strokeWidth={2.5} className="size-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
