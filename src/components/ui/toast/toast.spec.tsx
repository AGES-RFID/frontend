import { afterEach, describe, expect, it } from "bun:test";
import { act, cleanup, render, screen } from "@testing-library/react";
import { ToastViewport, toast } from ".";

afterEach(() => {
  cleanup();
});

describe("toast", () => {
  describe("toast helper methods", () => {
    it("should push a success toast", () => {
      const id = toast.success("Operação bem-sucedida");
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("should push an error toast", () => {
      const id = toast.error("Ops, algo deu errado");
      expect(typeof id).toBe("string");
    });

    it("should push a warning toast", () => {
      const id = toast.warning("Atenção: verifique os dados");
      expect(typeof id).toBe("string");
    });

    it("should push an info toast", () => {
      const id = toast.info("Informação importante");
      expect(typeof id).toBe("string");
    });

    it("should push a toast with title via show()", () => {
      const id = toast.show({
        message: "Mensagem",
        title: "Título",
        variant: "success",
      });
      expect(typeof id).toBe("string");
    });

    it("should push a toast with custom duration", () => {
      const id = toast.show({ message: "Temporário", duration: 1000 });
      expect(typeof id).toBe("string");
    });

    it("should push a success toast with optional title", () => {
      const id = toast.success("Salvo com sucesso!", "Título");
      expect(typeof id).toBe("string");
    });
  });

  describe("ToastViewport", () => {
    it("should render without throwing", () => {
      expect(() => render(<ToastViewport />)).not.toThrow();
    });

    it("should render a success toast in the viewport", async () => {
      render(<ToastViewport />);
      await act(async () => {
        toast.success("MSG_SUCCESS_UNIQUE");
      });
      expect(screen.getByText("MSG_SUCCESS_UNIQUE")).toBeInTheDocument();
    });

    it("should render an error toast in the viewport", async () => {
      render(<ToastViewport />);
      await act(async () => {
        toast.error("MSG_ERROR_UNIQUE");
      });
      expect(screen.getByText("MSG_ERROR_UNIQUE")).toBeInTheDocument();
    });

    it("should render a warning toast in the viewport", async () => {
      render(<ToastViewport />);
      await act(async () => {
        toast.warning("MSG_WARNING_UNIQUE");
      });
      expect(screen.getByText("MSG_WARNING_UNIQUE")).toBeInTheDocument();
    });

    it("should render an info toast in the viewport", async () => {
      render(<ToastViewport />);
      await act(async () => {
        toast.info("MSG_INFO_UNIQUE");
      });
      expect(screen.getByText("MSG_INFO_UNIQUE")).toBeInTheDocument();
    });

    it("should render a toast with title and message", async () => {
      render(<ToastViewport />);
      await act(async () => {
        toast.show({
          title: "MSG_TITLE_UNIQUE",
          message: "MSG_BODY_UNIQUE",
          variant: "info",
        });
      });
      expect(screen.getByText("MSG_TITLE_UNIQUE")).toBeInTheDocument();
      expect(screen.getByText("MSG_BODY_UNIQUE")).toBeInTheDocument();
    });

    it("should render a success toast with title and message", async () => {
      render(<ToastViewport />);
      await act(async () => {
        toast.success("Salvo com sucesso!", "Título");
      });
      expect(screen.getByText("Título")).toBeInTheDocument();
      expect(screen.getByText("Salvo com sucesso!")).toBeInTheDocument();
    });

    it("should render close buttons for toasts", async () => {
      render(<ToastViewport />);
      await act(async () => {
        toast.error("MSG_CLOSE_UNIQUE");
      });
      const closeBtns = screen.getAllByRole("button", {
        name: "Fechar notificação",
      });
      expect(closeBtns.length).toBeGreaterThan(0);
    });

    it("should dismiss a toast when close button is clicked without throwing", async () => {
      render(<ToastViewport />);
      await act(async () => {
        toast.error("MSG_DISMISS_UNIQUE");
      });
      const closeBtns = screen.getAllByRole("button", {
        name: "Fechar notificação",
      });
      expect(() => closeBtns[0]?.click()).not.toThrow();
    });

    it("should unmount cleanly (useEffect cleanup)", () => {
      render(<ToastViewport />);
      act(() => toast.info("Toast para unmount"));
      cleanup();
      // cancelAnimationFrame + clearTimeout rodados sem erros
      expect(true).toBe(true);
    });
  });
});
