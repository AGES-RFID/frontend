import { useQuery } from "@tanstack/react-query";
import { authService } from "../AuthService";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      return await authService.me();
    },
  });
}
