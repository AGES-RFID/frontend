import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
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
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="font-bold text-4xl text-[#123b6d]">Cadastro</h1>
        <p className="mt-2 text-gray text-sm">
          Preencha os dados abaixo para criar sua conta
        </p>
      </header>

      <UserForm buttonText="Criar Conta" onSubmit={handleCreateUser} />

      <div className="mt-6 flex justify-center">
        <Button onClick={() => console.log("Button clicked")}>
          Criar Conta
        </Button>
      </div>

      <div className="mt-6 text-center text-gray text-sm">
        <span>Já possui uma conta? </span>
        <Link to="/login" className="font-medium text-cyan hover:underline">
          Fazer login
        </Link>
      </div>
    </main>
  );
}
