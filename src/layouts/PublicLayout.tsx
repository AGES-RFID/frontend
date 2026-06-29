import { Outlet } from "react-router";
import { Header } from "@/components/ui/header";

export function PublicLayout() {
  return (
    <>
      <Header type="logo" />
      <Outlet />
    </>
  );
}
