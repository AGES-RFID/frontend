import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Header } from "@/components/ui/header";
import { useAuthContext } from "@/features/auth/context/AuthContext";

export function CustomerLayout() {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/login");
    }
  }, [isLoading, currentUser, navigate]);

  const handleAuthAction = () => {
    navigate("/login");
  };

  if (isLoading) {
    return <div></div>;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f7fb_0%,#eef3f8_100%)]">
      <Header isLogged={!!currentUser} onAuthAction={handleAuthAction} />
      <Outlet />
    </div>
  );
}
