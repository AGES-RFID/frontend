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
        <MetricCard
          topLabel="Horário com mais entradas"
          bottomLabel={metrics?.peakEntryTime ?? "--:--"}
          size="lg"
        />
      </div>
    </div>
  );
}
