export function Dashboard() {
  return (
    <main>
        <div className="p-8">
          <h1 className="mb-4 font-bold text-3xl text-dark-gray">Dashboard</h1>
          <p className="mb-6 text-gray">
            Bem-vindo ao painel principal do sistema IMPINJ
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
        </div>
    </main>
  );
}
