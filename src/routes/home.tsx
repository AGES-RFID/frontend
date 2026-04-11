import { Header } from "@/components/ui/header";
import { UserForm } from "@/features/users/components/UserForm";

export function Home() {
  return (
    <>
      <Header />
      <main className="p-4">
        <UserForm onSubmit={() => {}} buttonText="Salvar" />
      </main>
    </>
  );
}
