import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import type { TableAction, TableColumn } from "@/components/ui/table/types";
import type { UserDto, UserListDto } from "../dtos";

interface UsersTableProps {
  users: UserListDto;
  loading: boolean;
  onEdit: (user: UserDto) => void;
  onDelete: (user: UserDto) => void;
  onCreateUser: () => void;
  onNavigateToRegister?: () => void;
}

export function UsersTable({
  users,
  loading,
  onEdit,
  onDelete,
  onCreateUser,
  onNavigateToRegister,
}: UsersTableProps) {
  const columns: TableColumn<UserDto>[] = [
    {
      key: "role",
      title: "Tipo",
      render: (col) => (
        <span className={col === "admin" ? "bg-blue" : "bg-fuscia"}>{col}</span>
      ),
    },
    { key: "name", title: "Nome" },
    { key: "email", title: "Email" },
  ];

  const actions: TableAction<UserDto>[] = [
    {
      key: "edit",
      label: "Editar",
      icon: <Edit size={18} />,
      onClick: onEdit,
      className:
        "text-dark-blue hover:text-blue cursor-pointer transition-colors",
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <Trash2 size={18} />,
      onClick: onDelete,
      className:
        "text-red hover:text-light-red cursor-pointer transition-colors",
    },
  ];

  return (
    <Table
      data={users}
      columns={columns}
      actions={actions}
      loading={loading}
      searchPlaceholder="Pesquisar por ID, tipo, nome ou email"
      emptyMessage="Nenhum usuário cadastrado ainda."
      searchNotFoundMessage="Nenhum usuário encontrado para esta busca."
      searchBarComponent={
        <Button
          onClick={onNavigateToRegister || onCreateUser}
          variant="primary"
          size="md"
        >
          Criar novo usuário
        </Button>
      }
    />
  );
}
