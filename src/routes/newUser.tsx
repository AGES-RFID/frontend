import { useNavigate } from "react-router";
import { UserForm } from "@/features/users/components/UserForm";
import type { CreateUserDto } from "@/features/users/dtos";
import { useCreateUser } from "@/features/users/hooks";

export function NewUser() {
  const navigate = useNavigate();

  const createUserMutation = useCreateUser();

  const handleCreateUser = (userDto: CreateUserDto) => {
    createUserMutation.mutate(userDto, {
      onSuccess: (data) => {
        alert(
          `Usuário criado com sucesso! Dados retornados: ${JSON.stringify(data)}`,
        );
        navigate("/users");
      },

      onError: (error) => {
        console.error("Erro ao criar usuário:", error);
        alert(
          "Ocorreu um erro ao criar o usuário. Por favor, tente novamente.",
        );
      },
    });
  };

  return (
    <main className="p-4">
      <header>
        <h1 className="mb-4 font-bold text-2xl">Novo usuário</h1>
      </header>

      <UserForm buttonText="Criar usuário" onSubmit={handleCreateUser} />
    </main>
  );
}
