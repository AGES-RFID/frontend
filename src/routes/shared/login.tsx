import { useNavigate } from "react-router";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";

export function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleForgotPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <Header></Header>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900">
        <main className="mx-auto flex max-w-screen-2xl px-6">
          <section className="w-full max-w-md">
            <div className="mb-12 border-gray border-b pb-4">
              <h1 className="font-semibold text-2xl text-dark-blue">Login</h1>
            </div>

            <form
              className="mx-auto mt-8 flex max-w-xs flex-col gap-6"
              onSubmit={handleSubmit}
            >
              <Input
                id="email"
                type="email"
                name="email"
                label="Email"
                placeholder="Digite seu Email"
                required
              />

              <Input
                id="password"
                type="password"
                name="password"
                label="Senha"
                placeholder="Digite sua senha"
                required
                showPasswordToggle
              />

              <div className="mb-8 flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 rounded border-dark-gray text-dark-blue focus:ring-dark-blue"
                  />
                  <span className="text-gray-600 text-sm">Lembrar de mim</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-dark-blue text-sm transition hover:text-blue-700"
                >
                  Esqueci a senha
                </button>
              </div>

              <button
                type="submit"
                className="mx-auto mb-6 h-10 w-full rounded bg-dark-blue font-semibold text-sm text-white transition hover:opacity-95"
              >
                Entrar
              </button>

              <div className="mb-6 text-center">
                <span className="text-gray-500 text-sm">OU</span>
              </div>

              <button
                type="button"
                onClick={handleRegister}
                className="mx-auto h-10 w-full rounded border border-cyan-600 bg-transparent font-medium text-cyan-600 text-sm transition hover:bg-cyan-600 hover:text-white"
              >
                Criar nova conta
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-gray-500 text-xs">
                Ao fazer login, você concorda com nossos{" "}
                <a href="#" className="text-dark-blue hover:text-blue-700">
                  Termos de Serviço
                </a>{" "}
                e{" "}
                <a href="#" className="text-dark-blue hover:text-blue-700">
                  Política de Privacidade
                </a>
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
};

function _NavItem({ icon, label }: NavItemProps) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 font-medium text-sm text-white/95 transition hover:text-white"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
