import { useNavigate, useParams } from "react-router";
import { UserForm } from "@/features/users/components/UserForm";
import type { CreateUserDto } from "@/features/users/dtos";
import { useEditUser, useGetUser } from "@/features/users/hooks";

export function EditUser() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isLoading, error } = useGetUser(userId || "");
  const editUserMutation = useEditUser();

  if (isLoading) {
    return (
      <main className="p-4">
        <div>Carregando...</div>
      </main>
    );
  }

  if (error) {
    console.log(error);
    return (
      <main className="p-4">
        <div className="text-red">Algo deu errado ao buscar o usuário</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-4">
        <div className="text-red">Usuário não encontrado</div>
      </main>
    );
  }

  const handleEditUser = (userDto: CreateUserDto) => {
    editUserMutation.mutate(
      { userId: user.userId, updateUserDto: userDto },
      {
        onSuccess: () => {
          alert("Usuário atualizado com sucesso");
          navigate("/users");
        },

        onError: (error) => {
          console.error("Erro ao atualizar usuário:", error);
          alert(
            "Ocorreu um erro ao atualizar o usuário. Por favor, tente novamente.",
          );
        },
      },
    );
  };

  return (
    <main className="p-4">
      <header>
        <h1 className="mb-4 font-bold text-2xl">Editar usuário</h1>
      </header>

      <UserForm
        buttonText="Atualizar usuário"
        onSubmit={handleEditUser}
        initialValues={{
          name: user.name,
          email: user.email || "",
        }}
      />
    </main>
  );
}
