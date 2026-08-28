import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (count, error) =>
        !(
          error instanceof Error &&
          "status" in error &&
          (error.status === 401 || error.status === 403)
        ) && count < 2,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
});
