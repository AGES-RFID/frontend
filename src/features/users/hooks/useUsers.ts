import { useQuery } from "@tanstack/react-query";
import { userService } from "../UserService";

export function useUsers() {
  return useQuery({
    queryFn: userService.listUsers,
    queryKey: ["users"],
  });
}
