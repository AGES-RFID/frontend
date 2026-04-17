import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { userService } from "../UserService";
import type { UserListDto } from "../dtos";

type UseUsersOptions = Omit<
  UseQueryOptions<UserListDto, Error>,
  "queryKey" | "queryFn"
>;

export function useUsers(options?: UseUsersOptions) {
  return useQuery<UserListDto, Error>({
    queryFn: () => userService.listUsers(),
    queryKey: ["users"],
    ...options,
  });
}
