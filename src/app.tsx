import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./components/errors/ErrorBoundary";
import { ToastViewport } from "./components/ui/toast";
import { Router } from "./router";

export function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <ToastViewport />
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  );
}
