import { Outlet } from "react-router";
import { SidebarDrawer } from "@/components/ui/sidebar/sidebarDrawer";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
