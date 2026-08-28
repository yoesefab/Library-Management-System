import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { authApi } from "../api/auth-api";
import type { UserProfile } from "../types/api";

interface AuthValue {
  user: UserProfile | null;
  isRestoring: boolean;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const session = useQuery({
    queryKey: ["session"],
    queryFn: ({ signal }) => authApi.me(signal),
    retry: false,
  });
  const clearSession = useCallback(() => {
    queryClient.setQueryData(["session"], null);
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== "session",
    });
  }, [queryClient]);

  useEffect(() => {
    window.addEventListener("maarif:session-expired", clearSession);
    return () =>
      window.removeEventListener("maarif:session-expired", clearSession);
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        user: session.data ?? null,
        isRestoring: session.isPending,
        login: async (credentials) => {
          const user = await authApi.login(credentials);
          queryClient.setQueryData(["session"], user);
          return user;
        },
        logout: async () => {
          try {
            await authApi.logout();
          } finally {
            clearSession();
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return value;
}
