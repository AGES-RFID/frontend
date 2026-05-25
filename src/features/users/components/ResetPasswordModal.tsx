import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ResetPasswordModalValue = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSubmit: (values: ResetPasswordModalValue) => void;
}

const defaultValues: ResetPasswordModalValue = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

export function ResetPasswordModal({
  isOpen,
  onClose,
  isSubmitting,
  onSubmit,
}: ResetPasswordModalProps) {
  const [formData, setFormData] =
    useState<ResetPasswordModalValue>(defaultValues);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultValues);
      setValidationError(null);
    }
  }, [isOpen]);

  const updateField = (field: keyof ResetPasswordModalValue, value: string) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Redefinir Senha">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Senha atual"
          type="password"
          placeholder="Senha atual"
          value={formData.currentPassword}
          onChange={(event) =>
            updateField("currentPassword", event.target.value)
          }
          required
          showPasswordToggle
          width="75%"
          className="mx-auto"
        />
        <Input
          label="Nova senha"
          type="password"
          placeholder="Nova senha"
          value={formData.password}
          onChange={(event) => updateField("password", event.target.value)}
          required
          showPasswordToggle
          width="75%"
          className="mx-auto"
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          placeholder="Confirmar nova senha"
          value={formData.confirmPassword}
          onChange={(event) =>
            updateField("confirmPassword", event.target.value)
          }
          required
          showPasswordToggle
          width="75%"
          className="mx-auto"
        />

        {validationError ? (
          <p className="text-red text-sm">{validationError}</p>
        ) : null}

        <div className="mt-10 flex justify-end gap-2">
          <Button onClick={onClose} variant="secondary" type="button">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Confirmando..." : "Confirmar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
