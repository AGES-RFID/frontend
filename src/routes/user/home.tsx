import { Header } from "@/components/ui/header";
import { UserForm } from "@/features/users/components/UserForm";
import { useNavigate } from "react-router";

export function Home() {
  const navigate = useNavigate();

  const handleAuthAction = () => {
    navigate("/user/new");
  };

  return (
    <>
      <Header onAuthAction={handleAuthAction} />
      <main className="p-4">
      </main>
    </>
  );
}
