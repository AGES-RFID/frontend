import type { GraphData } from "@/components/ui/graph";
import { Graph } from "@/components/ui/graph";

const mockVehicleFlowSeries: GraphData = [
  {
    name: "Entradas",
    color: "var(--color-blue)",
    points: [
      { timestamp: "2026-06-06T10:00:00", value: 20 },
      { timestamp: "2026-06-06T11:00:00", value: 35 },
      { timestamp: "2026-06-06T12:00:00", value: 10 },
      { timestamp: "2026-06-06T13:00:00", value: 28 },
      { timestamp: "2026-06-06T14:00:00", value: 42 },
      { timestamp: "2026-06-06T15:00:00", value: 30 },
    ],
  },
  {
    name: "Saídas",
    color: "var(--color-dark-orange)",
    points: [
      { timestamp: "2026-06-06T10:00:00", value: 15 },
      { timestamp: "2026-06-06T11:00:00", value: 28 },
      { timestamp: "2026-06-06T12:00:00", value: 40 },
      { timestamp: "2026-06-06T13:00:00", value: 22 },
      { timestamp: "2026-06-06T14:00:00", value: 34 },
      { timestamp: "2026-06-06T15:00:00", value: 27 },
    ],
  },
];

export function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="mb-4 font-bold text-3xl text-dark-gray">Dashboard</h1>
      <p className="mb-6 text-gray">
        Bem-vindo ao painel principal do sistema IMPINJ
      </p>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-semibold text-dark-gray text-lg">
            Veículos Ativos
          </h3>
          <p className="font-bold text-3xl text-blue">0</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-semibold text-dark-gray text-lg">
            Usuários Cadastrados
          </h3>
          <p className="font-bold text-3xl text-teal">0</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-semibold text-dark-gray text-lg">
            Etiquetas Emitidas
          </h3>
          <p className="font-bold text-3xl text-green">0</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-semibold text-dark-gray text-lg">
            Cobranças Pendentes
          </h3>
          <p className="font-bold text-3xl text-yellow">0</p>
        </div>
      </div>

      <Graph
        title="Fluxo de veículos por hora"
        series={mockVehicleFlowSeries}
        width={900}
        height={400}
      />
    </div>
  );
}
