import { Home, CreditCard, User, LogIn } from "lucide-react";
import { useNavigate } from "react-router";

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
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center">

      <main className="mx-auto flex max-w-screen-2xl px-6">
        <section className="w-full max-w-md">
          <div className="mb-12 border-b border-gray pb-4">
            <h1 className="text-2xl font-semibold  text-dark-blue">Login</h1>
          </div>

          <form className="mx-auto mt-8 flex max-w-xs flex-col" onSubmit={handleSubmit}>
            <label htmlFor="email" className="mb-3 text-sm font-semibold text-gray-600">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="Digite seu Email"
              className="mb-6 h-10 rounded border border-dark-gray bg-white px-4 text-sm text-dark-gray outline-none placeholder:text-lighter-blue focus:border-dark-blue"
            />

            <label htmlFor="password" className="mb-3 text-sm font-semibold text-gray-600">
              Senha <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
                placeholder="Digite sua senha"
              className="mb-4 h-10 rounded border border-dark-gray bg-white px-4 text-sm text-dark-gray outline-none placeholder:text-lighter-blue focus:border-dark-blue"
            />

            <div className="mb-8 flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 rounded border-dark-gray text-dark-blue focus:ring-dark-blue"
                />
                <span className="text-sm text-gray-600">Lembrar de mim</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-dark-blue transition hover:text-blue-700"
              >
                Esqueci a senha
              </button>
            </div>

            <button
              type="submit"
              className="mx-auto mb-6 h-10 w-full rounded bg-dark-blue text-sm font-semibold text-white transition hover:opacity-95"
            >
              Entrar
            </button>

            <div className="mb-6 text-center">
              <span className="text-sm text-gray-500">OU</span>
            </div>

            <button
              type="button"
              onClick={handleRegister}
              className="mx-auto h-10 w-full rounded border border-cyan-600 bg-transparent text-sm font-medium text-cyan-600 transition hover:bg-cyan-600 hover:text-white"
            >
              Criar nova conta
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs text-gray-500">
              Ao fazer login, você concorda com nossos{" "}
              <a href="#" className="text-dark-blue hover:text-blue-700">Termos de Serviço</a>
              {" "}e{" "}
              <a href="#" className="text-dark-blue hover:text-blue-700">Política de Privacidade</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
};

function NavItem({ icon, label }: NavItemProps) {
  return (
    <button type="button" className="flex items-center gap-2 text-sm font-medium text-white/95 transition hover:text-white">
      {icon}
      <span>{label}</span>
    </button>
  );
}
