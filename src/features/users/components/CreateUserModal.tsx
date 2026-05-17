import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export type CreateUserModalValue = {
  fullName: string;
  email: string;
  cpf: string;
  cellphone: string;
  password: string;
  confirmPassword: string;
  role: "admin" | "customer";
};

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSubmit: (values: CreateUserModalValue) => void;
}

const defaultValues: CreateUserModalValue = {
  fullName: "",
  email: "",
  cpf: "",
  cellphone: "",
  password: "",
  confirmPassword: "",
  role: "customer",
};

export function CreateUserModal({
  isOpen,
  onClose,
  isSubmitting,
  onSubmit,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateUserModalValue>(defaultValues);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultValues);
      setValidationError(null);
    }
  }, [isOpen]);

  const updateField = (field: keyof CreateUserModalValue, value: string) => {
    if (validationError) {
      setValidationError(null);
    }

    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setValidationError("As senhas não coincidem.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar Novo Usuário">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Nome completo"
            placeholder="Seu nome completo"
            value={formData.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            required
            width="100%"
          />
          <Input
            label="Email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
            width="100%"
          />
          <Input
            label="CPF"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={(event) => updateField("cpf", event.target.value)}
            required
            mask="cpf"
            width="100%"
          />
          <Input
            label="Telefone"
            type="tel"
            placeholder="(51) 99999-9999"
            value={formData.cellphone}
            onChange={(event) => updateField("cellphone", event.target.value)}
            required
            mask="phone"
            width="100%"
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Senha"
            value={formData.password}
            onChange={(event) => updateField("password", event.target.value)}
            required
            showPasswordToggle
            width="100%"
          />
          <Input
            label="Confirmar senha"
            type="password"
            placeholder="Confirmar senha"
            value={formData.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            required
            showPasswordToggle
            width="100%"
          />
        </div>

        <label className="flex flex-col gap-1 font-medium text-dark-gray text-sm">
          Perfil
          <select
            className="h-10 rounded-md border border-light-gray bg-white px-4 text-dark-gray outline-none focus:border-dark-gray"
            value={formData.role}
            onChange={(event) => updateField("role", event.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="customer">Cliente</option>
          </select>
        </label>

        {validationError ? (
          <p className="text-red text-sm">{validationError}</p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="secondary" type="button">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
