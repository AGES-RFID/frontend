import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { UserListDto } from "../dtos";
import { userService } from "../UserService";

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
