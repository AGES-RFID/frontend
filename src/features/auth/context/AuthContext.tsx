import { createContext, type ReactNode, useContext, useMemo } from "react";
import type { UserDto } from "@/features/users/dtos";
import { useMe } from "../hooks";

type AuthContext = {
  currentUser?: UserDto;
  isLoading: boolean;
};

const authContext = createContext<null | AuthContext>(null);

type AuthContextProviderProps = Readonly<{
  children: ReactNode;
}>;

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const currentUser = useMe();

  const value = useMemo(
    () => ({
      isLoading: currentUser.isLoading,
      currentUser: currentUser.data ?? undefined,
    }),
    [currentUser.isLoading, currentUser.data],
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
