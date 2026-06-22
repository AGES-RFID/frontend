import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { toast } from "@/components/ui/toast";
import {
  UserForm,
  type UserFormValues,
} from "@/features/users/components/UserForm";
import { api } from "@/lib/api";

type PublicCreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: "customer";
  cpf?: string;
  cellphone?: string;
};

export function NewUser() {
  const navigate = useNavigate();
  const createUserMutation = useMutation({
    mutationFn: async (payload: PublicCreateUserPayload) =>
      api.post("users", { json: payload }).json(),
  });

  const handleCreateUser = (formData: UserFormValues) => {
    const payload: PublicCreateUserPayload = {
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: "customer",
      cpf: formData.cpf?.trim(),
      cellphone: formData.cellphone?.trim(),
    };

    createUserMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Usuário criado com sucesso.");
        navigate("/");
      },
      onError: (error) => {
        console.error("Erro ao criar usuário:", error);
        toast.error(
          "Ocorreu um erro ao criar o usuário. Por favor, tente novamente.",
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-10 text-center">
          <h1 className="font-bold text-4xl text-dark-blue">Cadastro</h1>
          <p className="mt-2 text-gray text-sm">
            Preencha os dados abaixo para criar sua conta
          </p>
        </header>

        <UserForm buttonText="Criar Conta" onSubmit={handleCreateUser} />

        <div className="mt-6 text-center text-gray text-sm">
          <span>Já possui uma conta? </span>
          <Link to="/login" className="font-medium text-cyan hover:underline">
            Fazer login
          </Link>
        </div>
      </main>
    </div>
  );
}
