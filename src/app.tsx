import { Router } from "./router";
import { ErrorBoundary } from "./components/errors/ErrorBoundary";

export function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}
