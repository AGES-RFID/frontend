import { Outlet } from "react-router";

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f7fb_0%,#eef3f8_100%)]">
      <Outlet />
    </div>
  );
}
