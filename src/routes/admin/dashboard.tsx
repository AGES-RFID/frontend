import { MetricCard } from "@/features/dashboard/components/dashboardCard";
import { useDashboardMetrics } from "@/features/dashboard/hooks/useDashboardMetrics";

export function Dashboard() {
  const { data: metrics } = useDashboardMetrics();

  return (
    <div className="p-8">
      <h1 className="mb-4 font-bold text-3xl text-dark-gray">Dashboard</h1>
      <p className="mb-6 text-gray">
        Bem-vindo ao painel principal do sistema IMPINJ
      </p>

      <div className="max-w-[704px]">
        <div className="flex max-w-[704px] flex-col gap-4">
          <MetricCard
            topLabel="Entradas (Última Hora)"
            bottomLabel={String(metrics?.entriesLastHour ?? 0)}
            size="lg"
          />

          <MetricCard
            topLabel="Saídas (Última Hora)"
            bottomLabel={String(metrics?.exitsLastHour ?? 0)}
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}
