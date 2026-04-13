import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Header } from "@/components/ui/header";

export function CustomerLayout() {
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isLogged) {
      // Handle logout
      setIsLogged(false);
      navigate("/login");
    } else {
      // Handle login
      navigate("/login");
    }
  };

  return (
    <>
      <Header isLogged={isLogged} onAuthAction={handleAuthAction} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
