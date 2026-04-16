import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

const metricCard = cva(
    "bg-white rounded-md drop-shadow-lg p-6 flex flex-col gap-2",
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
}
)
interface MetricCardProps extends VariantProps<typeof metricCard> {
    topLabel: string;
    bottomLabel: string;
    className?: string;
    
}

export function MetricCard({ topLabel, bottomLabel, size, className}: MetricCardProps) {
    if (!topLabel || !bottomLabel){
        throw new Error("topLabel e bottomLabel são obrigatórios e não podem ser vazios ")
    }
    return (
        <div className={metricCard({size, className })}>
            <span className="text-sm text-gray-500 font-medium">{topLabel}</span>
            <span className="text-4xl font-bold text-gray-900">{bottomLabel} </span>
        </div>
    )
}