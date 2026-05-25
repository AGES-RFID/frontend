import { Outlet, useNavigate } from "react-router";
import { Header } from "@/components/ui/header";

export function CustomerLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("rfid-auth-token");
  const isLogged = !!token;

  const handleAuthAction = () => {
    if (isLogged) {
      localStorage.removeItem("rfid-auth-token");
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f7fb_0%,#eef3f8_100%)]">
      <Header isLogged={isLogged} onAuthAction={handleAuthAction} />
      <Outlet />
    </div>
  );
}
