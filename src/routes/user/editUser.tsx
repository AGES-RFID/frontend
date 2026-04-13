import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import {
  UserForm,
  type UserFormValues,
} from "@/features/users/components/UserForm";
import { useEditUser, useGetUser } from "@/features/users/hooks";
import { Header } from "@/components/ui/header";
import { toast } from "@/components/ui/toast";

export function EditUser() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isLoading, error } = useGetUser(userId || "");
  const editUserMutation = useEditUser();

  useEffect(() => {
    if (error) {
      toast.error("Algo deu errado ao buscar o usuário.");
    }
  }, [error]);

  useEffect(() => {
    if (!isLoading && !error && !user) {
      toast.warning("Usuário não encontrado.");
    }
  }, [error, isLoading, user]);

  const handleAuthAction = () => {
    navigate("/user/new");
  };

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
        <div className="text-gray">Não foi possível carregar o usuário.</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-4">
        <div className="text-gray">Usuário não encontrado.</div>
      </main>
    );
  }

  const handleEditUser = (userDto: UserFormValues) => {
    editUserMutation.mutate(
      {
        userId: user.userId,
        updateUserDto: {
          name: userDto.fullName,
          email: userDto.email,
        },
      },
      {
        onSuccess: () => {
          toast.success("Usuário atualizado com sucesso.");
          navigate("/users");
        },

        onError: (error) => {
          console.error("Erro ao atualizar usuário:", error);
          toast.error(
            "Ocorreu um erro ao atualizar o usuário. Por favor, tente novamente.",
          );
        },
      },
    );
  };

  return (
    <>
      <Header onAuthAction={handleAuthAction} />
      <main className="p-4">
        <header>
          <h1 className="mb-4 font-bold text-2xl">Editar usuário</h1>
        </header>

        <UserForm
          buttonText="Atualizar usuário"
          onSubmit={handleEditUser}
          initialValues={{
            fullName: user.name,
            email: user.email || "",
          }}
        />
      </main>
    </>
  );
}
