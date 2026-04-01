import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { CreateUserDto } from "../dtos";

type UserFormProps = {
  onSubmit: (user: CreateUserDto) => void;
  buttonText: string;
  initialValues?: Partial<CreateUserDto>;
};

export function UserForm({
  onSubmit,
  buttonText,
  initialValues,
}: UserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (initialValues) {
      if (initialValues.name) setName(initialValues.name);
      if (initialValues.email) setEmail(initialValues.email);
    }
  }, [initialValues]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ name, email });
      }}
      className="mx-auto flex max-w-md flex-col gap-4"
    >
      <Input
        name="name"
        placeholder="Nome..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        name="email"
        placeholder="Email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button type="submit">{buttonText}</Button>
    </form>
  );
}
