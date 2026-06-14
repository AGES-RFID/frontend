import { Outlet, useLocation } from "react-router";
import { SidebarDrawer } from "../../components/ui/sidebar/sidebarDrawer";

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen bg-gray-50">
      <SidebarDrawer />
      <main key={location.pathname} className="admin-page-enter flex-1">
        <Outlet />
      </main>
    </div>
  );
}
