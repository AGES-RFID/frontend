import { afterEach, describe, expect, it, mock } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { TagAddModal } from "./TagAddModal";

describe("TagAddModal component", () => {
  afterEach(cleanup);

  it("should not render content when isOpen is false", () => {
    render(<TagAddModal isOpen={false} onClose={mock()} />);
    expect(screen.queryByText("Aproxime as etiquetas do leitor")).toBeNull();
  });

  it("should render the subtitle when isOpen is true", () => {
    render(<TagAddModal isOpen={true} onClose={mock()} />);
    expect(screen.getByText("Aproxime as etiquetas do leitor")).toBeDefined();
  });

  it("should render Cancelar and Confirmar buttons", () => {
    render(<TagAddModal isOpen={true} onClose={mock()} />);
    expect(screen.getByText("Cancelar")).toBeDefined();
    expect(screen.getByText("Confirmar")).toBeDefined();
  });

  it("should call onClose when Cancelar is clicked", () => {
    const onClose = mock();
    render(<TagAddModal isOpen={true} onClose={onClose} />);
    screen.getByText("Cancelar").click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when Confirmar is clicked", () => {
    const onClose = mock();
    render(<TagAddModal isOpen={true} onClose={onClose} />);
    screen.getByText("Confirmar").click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
