import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api";
import {
  UserForm,
  type UserFormValues,
} from "@/features/users/components/UserForm";

type AdminCreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: "customer";
  cpf?: string;
  cellphone?: string;
};

export function AdminNewUser() {
  const navigate = useNavigate();

  const createUserMutation = useMutation({
    mutationFn: async (payload: AdminCreateUserPayload) =>
      api.post("users", { json: payload }).json(),
    onSuccess: () => {
      toast.success("Usuário criado com sucesso.");
      navigate("/admin/users");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar usuário.",
      );
    },
  });

  const handleSubmit = (formData: UserFormValues) => {
    createUserMutation.mutate({
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: "customer",
      cpf: formData.cpf.trim(),
      cellphone: formData.cellphone.trim(),
    });
  };

  return (
    <main className="flex-1 px-8 py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-4 font-bold text-3xl text-dark-gray">
            Cadastrar usuário
          </h1>
          <p className="text-gray">Preencha os dados para criar uma conta.</p>
        </div>

        <Button
          onClick={() => navigate("/admin/users")}
          variant="secondary"
          type="button"
        >
          Voltar
        </Button>
      </div>

      <UserForm
        buttonText={createUserMutation.isPending ? "Criando..." : "Criar"}
        onSubmit={handleSubmit}
      />
    </main>
  );
}