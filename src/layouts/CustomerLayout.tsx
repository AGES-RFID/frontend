import { Outlet, useNavigate } from "react-router";
import { Header } from "@/components/ui/header";

export function CustomerLayout() {
  const navigate = useNavigate();

  const handleAuthAction = () => {
    navigate("/user/new");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f7fb_0%,#eef3f8_100%)]">
      <Header onAuthAction={handleAuthAction} />
      <Outlet />
    </div>
  );
}
