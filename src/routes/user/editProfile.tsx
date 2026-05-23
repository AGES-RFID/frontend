import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useMe } from "@/features/auth/hooks/useMe";
import { useEditUser } from "@/features/users/hooks/useEditUser";

export function EditProfile() {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useMe();
  const editUserMutation = useEditUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cellphone: "",
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user && !initialized) {
      setFormData({
        name: user.name,
        email: user.email,
        cellphone: user.cellphone || "(99) 99999-9999",
      });
      setInitialized(true);
    }
  }, [user, initialized]);

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-96px)] items-center justify-center">
        <div className="animate-pulse font-semibold text-dark-blue text-xl">
          Carregando perfil...
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex min-h-[calc(100vh-96px)] items-center justify-center p-6">
        <div className="text-center">
          <p className="mb-4 font-semibold text-lg text-red">
            Não foi possível carregar as informações do perfil.
          </p>
          <Button onClick={() => navigate("/")}>Voltar para Home</Button>
        </div>
      </main>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValidEmail = (email: string) => {
    const trimmed = email.trim();
    const atIndex = trimmed.indexOf("@");
    if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf("@")) {
      return false;
    }
    const dotIndex = trimmed.lastIndexOf(".");
    return (
      dotIndex > atIndex + 1 &&
      dotIndex < trimmed.length - 1 &&
      !trimmed.includes(" ")
    );
  };

  const isValidPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length === 10 || digits.length === 11;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("O nome não pode estar vazio.");
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }

    if (!isValidPhone(formData.cellphone)) {
      toast.error("Por favor, insira um telefone válido.");
      return;
    }

    const payload: { name?: string; email?: string; cellphone?: string } = {};
    let hasBackendChanges = false;

    if (formData.name.trim() !== user.name) {
      payload.name = formData.name.trim();
      hasBackendChanges = true;
    }

    if (formData.email.trim() !== user.email) {
      payload.email = formData.email.trim();
      hasBackendChanges = true;
    }

    if (formData.cellphone !== (user.cellphone || "")) {
      payload.cellphone = formData.cellphone;
      hasBackendChanges = true;
    }

    if (!hasBackendChanges) {
      toast.warning("Nenhuma alteração foi realizada.");
      return;
    }

    editUserMutation.mutate(
      {
        userId: user.userId,
        updateUserDto: payload,
      },
      {
        onSuccess: () => {
          toast.success("Informações salvas com sucesso!");
          navigate("/profile");
        },
        onError: (err) => {
          console.error("Erro ao salvar:", err);
          toast.error("Ocorreu um erro ao atualizar suas informações.");
        },
      },
    );
  };

  const handlePasswordResetClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info(
      "A funcionalidade de redefinição de senha estará disponível em breve.",
    );
  };

  return (
    <main className="flex min-h-[calc(100vh-96px)] flex-col items-center justify-center px-4 py-12">
      {/* Header Container with Centered Title and Left Back Button */}
      <div className="relative mb-8 flex w-full max-w-[420px] items-center justify-center">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="absolute left-0 flex cursor-pointer items-center gap-1 font-semibold text-[15px] text-gray transition-colors hover:text-dark-blue"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
          Voltar
        </button>
        <h1 className="text-center font-bold text-4xl text-dark-blue">
          Meu Perfil
        </h1>
      </div>

      {/* Premium White Card Layout */}
      <div className="w-full max-w-[420px] rounded-2xl border border-[#eef3f8] bg-white p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6"
        >
          {/* Nome Completo */}
          <Input
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            width="100%"
          />

          {/* E-mail */}
          <Input
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
            width="100%"
          />

          {/* CPF - DISABLED IN ALL SITUATIONS (View-only) */}
          <Input
            label="CPF"
            variant="disabled"
            placeholder="000.000.000-00"
            value={user.cpf || "999.999.999-99"}
            readOnly
            tabIndex={-1}
            width="100%"
          />

          {/* Telefone */}
          <Input
            label="Telefone"
            placeholder="(99) 99999-9999"
            value={formData.cellphone}
            onChange={(e) => handleInputChange("cellphone", e.target.value)}
            required
            mask="phone"
            width="100%"
          />

          {/* Save Button */}
          <Button
            type="submit"
            disabled={editUserMutation.isPending}
            size="lg"
            className="mt-4 flex w-full cursor-pointer items-center justify-center bg-dark-blue py-6 font-semibold text-lg hover:bg-dark-blue/90"
          >
            {editUserMutation.isPending ? "Salvando..." : "Salvar informações"}
          </Button>

          {/* Reset Password Stub */}
          <button
            type="button"
            onClick={handlePasswordResetClick}
            className="mt-2 block w-full cursor-pointer text-center font-semibold text-dark-teal text-sm transition-colors hover:text-teal hover:underline"
          >
            Redefinir senha
          </button>
        </form>
      </div>
    </main>
  );
}
