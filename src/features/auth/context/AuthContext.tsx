import { createContext, type ReactNode, useContext } from "react";
import type { UserDto } from "@/features/users/dtos";
import { useMe } from "../hooks";

type AuthContext = {
  currentUser?: UserDto;
  isLoading: boolean;
};

const authContext = createContext<null | AuthContext>(null);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const currentUser = useMe();

  return (
    <authContext.Provider
      value={{
        isLoading: currentUser.isLoading || currentUser.isFetching,
        currentUser: currentUser.data ?? undefined,
      }}
    >
      {children}
    </authContext.Provider>
  );
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
