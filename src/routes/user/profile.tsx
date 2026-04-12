import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";

export function Profile() {
  const navigate = useNavigate();

  const handleAuthAction = () => {
    navigate("/user/new");
  };
  return (
    <>
      <Header onAuthAction={handleAuthAction} />
    </>
  );
}
