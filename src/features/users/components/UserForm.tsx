import { useState } from "react";
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
    <div className="px-6">
      <div className="mx-auto w-full max-w-[1060px]">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-8 flex items-center gap-4">
            <span className="shrink-0 font-semibold text-[#3d3d3d] text-[20px]">
              Informações pessoais
            </span>
            <div className="h-px flex-1 bg-[#bdbdbd]" />
          </div>

          <div className="grid grid-cols-2 gap-x-20 gap-y-6">
            <div className="flex flex-col gap-8">
              <Input
                label="Email *"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                width="100%"
              />

              <Input
                label="CPF *"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleInputChange("cpf", e.target.value)}
                required
                width="100%"
              />

              <Input
                label="Senha *"
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                showPasswordToggle
                width="100%"
              />
            </div>

            <div className="flex flex-col gap-8">
              <Input
                label="Nome Completo *"
                placeholder="Seu nome completo"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
                width="100%"
              />

              <Input
                label="Telefone *"
                type="tel"
                placeholder="(51) 99999-9999"
                value={formData.cellphone}
                onChange={(e) => handleInputChange("cellphone", e.target.value)}
                required
                width="100%"
              />

              <Input
                label="Confirmar senha *"
                type="password"
                placeholder="Confirmar senha"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                required
                showPasswordToggle
                width="100%"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
