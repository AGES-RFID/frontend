import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks/useMe";

export function Profile() {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useMe();

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-96px)] items-center justify-center">
        <div className="animate-pulse font-semibold text-dark-blue text-xl">
          Carregando perfil...
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex min-h-[calc(100vh-96px)] items-center justify-center p-6">
        <div className="text-center">
          <p className="mb-4 font-semibold text-lg text-red">
            Não foi possível carregar as informações do perfil.
          </p>
          <Button onClick={() => navigate("/")}>Voltar para Home</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-96px)] flex-col items-center justify-center px-4 py-12">
      <h1 className="mb-8 text-center font-bold text-4xl text-dark-blue">
        Meu Perfil
      </h1>

      <div className="w-full max-w-md rounded-2xl border border-baby-blue bg-white p-10 shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-bold text-dark-gray text-lg">Nome</h2>
            <ul className="mt-1 list-disc pl-5 text-gray">
              <li className="font-medium text-[16px] leading-relaxed">
                {user.name}
              </li>
            </ul>
          </div>

          <div className="h-px w-full bg-baby-blue/40" />

          <div>
            <h2 className="font-bold text-dark-gray text-lg">E-mail</h2>
            <ul className="mt-1 list-disc pl-5 text-gray">
              <li className="font-medium text-[16px] leading-relaxed">
                {user.email}
              </li>
            </ul>
          </div>

          <div className="h-px w-full bg-baby-blue/40" />

          <div>
            <h2 className="font-bold text-dark-gray text-lg">CPF</h2>
            <ul className="mt-1 list-disc pl-5 text-gray">
              <li className="font-medium text-[16px] leading-relaxed">
                {user.cpf || "999.999.999-99"}
              </li>
            </ul>
          </div>

          <div className="h-px w-full bg-baby-blue/40" />

          <div>
            <h2 className="font-bold text-dark-gray text-lg">Telefone</h2>
            <ul className="mt-1 list-disc pl-5 text-gray">
              <li className="font-medium text-[16px] leading-relaxed">
                {user.cellphone || "(99) 99999-9999"}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={() => navigate("/profile/edit")}
        size="lg"
        className="mt-8 cursor-pointer bg-dark-blue px-10 py-6 font-semibold text-lg hover:bg-dark-blue/90"
      >
        Editar informações
      </Button>
    </main>
  );
}
