import { useState } from "react";
import { useNavigate } from "react-router";
import { SidebarDrawer } from "../components/ui/sidebar/sidebarDrawer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { UserForm } from "@/features/users/components/UserForm";

export function AdminRegister() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
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
    navigate("/usuarios");
  };

  // Handle navigation back
  const handleGoBack = () => {
    navigate("/usuarios");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />

      {/* Main Content */}
      <main className="flex-1 px-8">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-dark-gray mb-8">
            Cadastrar usuario
          </h1>

          {/* Form Grid - 4x2 layout */}
          <div className="flex justify-center items-center flex-col">
            <UserForm
              onSubmit={handleSubmit}
              buttonText="Criar conta"
            />

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
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
