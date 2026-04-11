import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserFormProps {
  onSubmit: (data: any) => void;
  buttonText: string;
  initialValues?: any;
}

export function UserForm({
  onSubmit,
  buttonText,
  initialValues,
}: UserFormProps) {
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
    ...initialValues,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-6xl flex-col gap-6"
    >
      <div className="grid grid-cols-2 gap-25 max-w-6xl mx-auto">
            {/* Left Column */}
            <div className="space-y-6">
              <Input
                label="Email"
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />

              <Input
                label="CPF"
                placeholder="Digite seu CPF"
                value={formData.cpf}
                onChange={(e) => handleInputChange("cpf", e.target.value)}
                required
              />

              <Input
                label="CEP"
                placeholder="Digite seu CEP"
                value={formData.cep}
                onChange={(e) => handleInputChange("cep", e.target.value)}
                required
              />

              <Input
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                showPasswordToggle
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Input
                label="Nome completo"
                placeholder="Digite seu nome completo"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
              />

              <Input
                label="Telefone"
                type="tel"
                placeholder="Digite seu telefone"
                value={formData.cellphone}
                onChange={(e) => handleInputChange("cellphone", e.target.value)}
                required
              />

              <Input
                label="Endereço"
                placeholder="Digite seu endereço"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
              />

              <Input
                label="Confirmar Senha"
                type="password"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                required
                showPasswordToggle
              />
            </div>
          </div>
    </form>
  );
}