import { HTTPError } from "ky";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { loginSchema } from "@/features/auth/dtos";
import { useLogin } from "@/features/auth/hooks";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const loginMutation = useLogin();
  const isLoading = loginMutation.isPending;

  const validateEmail = (value: string) => {
    const result = loginSchema.shape.email.safeParse(value);
    setEmailError(
      result.success || value === ""
        ? ""
        : (result.error.issues[0]?.message ?? "Email inválido"),
    );
    return result.success;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("token", data.token);
          navigate("/");
        },
        onError: (error) => {
          if (error instanceof HTTPError && error.response.status === 401) {
            toast.error("Email ou senha incorretos.");
          } else {
            toast.error("Erro ao fazer login. Tente novamente.");
          }
        },
      },
    );
  };

  const handleRegister = () => {
    navigate("/user/new");
  };

  const handleForgotPassword = () => {
    navigate("/user/new");
  };

  return (
    <>
      <Header type="logo" />

      <div className="flex min-h-[calc(100vh-108px)] items-center justify-center bg-gray-100 px-6 py-10 text-gray-900">
        <main className="w-full max-w-140 rounded-2xl bg-white p-8">
          <section className="space-y-8">
            <div className="border-gray border-b pb-4">
              <h1 className="font-bold text-3xl text-dark-blue">Login</h1>
              <p className="mt-2 text-gray text-sm">
                Acesse sua conta para continuar.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (emailError) validateEmail(event.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  required
                  width="100%"
                />
                {emailError && <p className="text-red text-xs">{emailError}</p>}
              </div>

              <Input
                id="password"
                type="password"
                name="password"
                label="Senha"
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                showPasswordToggle
                width="100%"
              />

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-gray text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-dark-gray text-dark-blue focus:ring-dark-blue"
                  />
                  Lembrar de mim
                </label>

                <Button
                  type="button"
                  variant="borderless"
                  size="sm"
                  onClick={handleForgotPassword}
                >
                  Esqueci a senha
                </Button>
              </div>

              <Button
                type="submit"
                size="md"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-light-gray" />
                <span className="text-gray text-sm">OU</span>
                <div className="h-px flex-1 bg-light-gray" />
              </div>

              <Button
                type="button"
                variant="secondary"
                size="md"
                className="w-full"
                onClick={handleRegister}
              >
                Criar nova conta
              </Button>
            </form>

            <div className="text-center">
              <p className="text-gray text-xs">
                Ao fazer login, você concorda com nossos termos de serviço e
                política de privacidade.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
