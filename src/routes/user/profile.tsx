import { Header } from "@/components/ui/header";
import { useNavigate } from "react-router";

export function Profile() {
  const navigate = useNavigate();

  const handleAuthAction = () => {
    navigate("/user/new");
  };
  return (
    <Header onAuthAction={handleAuthAction} />
  );
}
