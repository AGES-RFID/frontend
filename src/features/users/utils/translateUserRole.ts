export function translateUseRole(role: string) {
  switch (role) {
    case "admin":
      return "Administrador";
    case "customer":
      return "Cliente";
    default:
      return role;
  }
}
