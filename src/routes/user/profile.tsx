import { Header } from "@/components/ui/header";
import { useNavigate } from "react-router";

export function Profile() {
  const navigate = useNavigate();

  const handleAuthAction = () => {
    navigate("/user/new");
  };

  return (
    <>
      <Header onAuthAction={handleAuthAction} />
      <main className="p-6">
        <h1 className="mb-4 font-bold text-3xl text-dark-blue">Perfil</h1>
        <p className="text-gray text-sm">Seção em construção.</p>
      </main>
    </>
  );
}
