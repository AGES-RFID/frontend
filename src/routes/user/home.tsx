import { useNavigate } from "react-router";
import { Header } from "@/components/ui/header";

export function Home() {
  const navigate = useNavigate();

  const handleAuthAction = () => {
    navigate("/user/new");
  };

  return (
    <>
      <Header onAuthAction={handleAuthAction} />
      <main className="p-4"></main>
    </>
  );
}
