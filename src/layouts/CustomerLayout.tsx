import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Header } from "@/components/ui/header";
import { useAuthContext } from "@/features/auth/context/AuthContext";

export function CustomerLayout() {
  const navigate = useNavigate();
  const { currentUser, isLoading, logout } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/login");
    }
  }, [isLoading, currentUser, navigate]);

  const handleAuthAction = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  if (isLoading) {
    return <div></div>;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f7fb_0%,#eef3f8_100%)]">
      <Header
        isLogged={!!currentUser}
        onAuthAction={() => {
          void handleAuthAction();
        }}
      />
      <Outlet />
    </div>
  );
}
