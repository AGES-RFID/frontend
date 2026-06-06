import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { authService } from "../AuthService";
import { useMe } from "../hooks";
import type { UserDto } from "../../users/dtos";

type AuthContext = {
  currentUser?: UserDto;
  isLoading: boolean;
  logout: () => Promise<void>;
};

const authContext = createContext<null | AuthContext>(null);

type AuthContextProviderProps = Readonly<{
  children: ReactNode;
}>;

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const currentUser = useMe();
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    authService.logout();
    await queryClient.resetQueries({ queryKey: ["me"] });
  }, [queryClient]);

  const value = useMemo(
    () => ({
      isLoading: currentUser.isLoading,
      currentUser: currentUser.data ?? undefined,
      logout,
    }),
    [currentUser.isLoading, currentUser.data, logout],
  );

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

export function useAuthContext(): AuthContext {
  const context = useContext(authContext);

  if (context === null) {
    throw new Error(
      "useAuthContext must be called within an AuthContextProvider",
    );
  }

  return context;
}
