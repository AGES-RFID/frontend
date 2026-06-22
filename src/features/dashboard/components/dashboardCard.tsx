import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const metricCard = cva(
  "bg-white rounded-md drop-shadow-lg p-6 flex flex-col justify-between gap-2",
  {
    variants: {
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
interface MetricCardProps extends VariantProps<typeof metricCard> {
  topLabel: string;
  bottomLabel: string;
  className?: string;
}

export function MetricCard({
  topLabel,
  bottomLabel,
  size,
  className,
}: MetricCardProps) {
  return (
    <div className={metricCard({ size, className })}>
      <span className="font-medium text-gray">{topLabel}</span>
      <span className="font-bold text-4xl text-dark-gray">{bottomLabel} </span>
    </div>
  );
}
