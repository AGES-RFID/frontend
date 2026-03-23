import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erro capturado:", error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600">
          <h1>Erro inesperado na interface.</h1>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white"
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
