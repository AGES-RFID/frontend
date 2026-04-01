import { useQuery } from "@tanstack/react-query";
import { userService } from "../UserService";

export function useGetUser(userId: string) {
  return useQuery({
    queryFn: () => userService.getUserById(userId),
    queryKey: ["users", userId],
    enabled: !!userId,
  });
}
