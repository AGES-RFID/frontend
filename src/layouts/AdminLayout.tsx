import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { SidebarDrawer } from "@/components/ui/sidebar/sidebarDrawer";
import { toast } from "@/components/ui/toast";
import { useAuthContext } from "@/features/auth/context/AuthContext";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && currentUser?.role !== "admin") {
      toast.error("Você não tem permissão para acessar essa página.");
      navigate("/");
    }
  }, [isLoading, currentUser, navigate]);

  if (isLoading) {
    return <div></div>;
  }

  if (currentUser?.role !== "admin") return;

  return (
    <div className="flex min-h-screen">
      <SidebarDrawer />
      <main key={location.pathname} className="admin-page-enter flex-1">
        {isLoading ? (
          <p className="animate-pulse text-center text-xl">Carregando...</p>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
