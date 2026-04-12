import { useState } from "react";
import { useNavigate } from "react-router";
import { SidebarDrawer } from "../../components/ui/sidebar/sidebarDrawer";
import { Button } from "../../components/ui/button";
import { UserForm } from "@/features/users/components/UserForm";

export function AdminNewUser() {
  const navigate = useNavigate();

  // Form state
  const [formData, _setFormData] = useState({
    email: "",
    fullName: "",
    cpf: "",
    cellphone: "",
    cep: "",
    address: "",
    complement: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  // Handle form submission
  const handleSubmit = () => {
    console.log("Form data:", formData);
    // TODO: Implement user creation logic
    alert("Usuário cadastrado com sucesso!");
    navigate("/admin/users");
  };

  // Handle navigation back
  const handleGoBack = () => {
    navigate("/admin/users");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />

      {/* Main Content */}
      <main className="flex-1 px-8">
        <div className="py-8">
          <h1 className="mb-8 font-bold text-3xl text-dark-gray">
            Cadastrar usuario
          </h1>

          {/* Form Grid - 4x2 layout */}
          <div className="flex flex-col items-center justify-center">
            <UserForm onSubmit={handleSubmit} buttonText="Criar conta" />

            {/* Buttons */}
            <div className="mt-8 flex gap-4">
              <Button onClick={handleGoBack} variant="borderless" size="md">
                Voltar
              </Button>

              <Button onClick={handleSubmit} variant="primary" size="md">
                Criar conta
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
