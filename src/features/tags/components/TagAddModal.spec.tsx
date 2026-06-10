import "@testing-library/jest-dom";
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { toast } from "@/components/ui/toast";
import * as tagHooks from "../hooks";

const createTagMock = mock();
const useCreateTagSpy = spyOn(tagHooks, "useCreateTag");
const toastSuccessSpy = spyOn(toast, "success");
const toastErrorSpy = spyOn(toast, "error");

useCreateTagSpy.mockImplementation(
  () =>
    ({
      mutateAsync: createTagMock,
      isPending: false,
    }) as never,
);

const { TagAddModal } = await import("./TagAddModal");

function renderModal(isOpen = true) {
  return render(<TagAddModal isOpen={isOpen} onClose={mock()} />);
}

function renderModalWithClose(onClose: () => void, isOpen = true) {
  return render(<TagAddModal isOpen={isOpen} onClose={onClose} />);
}

describe("TagAddModal component", () => {
  beforeEach(() => {
    createTagMock.mockClear();
    toastSuccessSpy.mockClear();
    toastErrorSpy.mockClear();
    useCreateTagSpy.mockImplementation(
      () =>
        ({
          mutateAsync: createTagMock,
          isPending: false,
        }) as never,
    );
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    useCreateTagSpy.mockRestore();
    toastSuccessSpy.mockRestore();
    toastErrorSpy.mockRestore();
  });

  it("should not render when isOpen is false", () => {
    renderModal(false);

    expect(
      screen.queryByText("Adicionar etiqueta RFID"),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("TID")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("EPC")).not.toBeInTheDocument();
  });

  it("should render the form fields and actions when open", () => {
    renderModal();

    expect(screen.getByLabelText("TID")).toBeInTheDocument();
    expect(screen.getByLabelText("EPC")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Confirmar" }),
    ).toBeInTheDocument();
  });

  it("should call onClose and clear inputs when Cancelar is clicked", () => {
    const onClose = mock();
    renderModalWithClose(onClose);

    const tidInput = screen.getByLabelText("TID") as HTMLInputElement;
    const epcInput = screen.getByLabelText("EPC") as HTMLInputElement;

    act(() => {
      fireEvent.change(tidInput, { target: { value: "TID-001" } });
      fireEvent.change(epcInput, { target: { value: "EPC-001" } });
      fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(tidInput).toHaveValue("");
    expect(epcInput).toHaveValue("");
  });

  it("should show an error when TID or EPC is empty", () => {
    renderModal();

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    });

    expect(toastErrorSpy).toHaveBeenCalledTimes(1);
    expect(toastErrorSpy).toHaveBeenCalledWith(
      "Preencha o TID e o EPC da etiqueta.",
    );
    expect(createTagMock).not.toHaveBeenCalled();
  });

  it("should submit the form successfully and close on success", async () => {
    createTagMock.mockImplementationOnce(async () => Promise.resolve());
    const onClose = mock();
    renderModalWithClose(onClose);

    fireEvent.change(screen.getByLabelText("TID"), {
      target: { value: "TID-001" },
    });
    fireEvent.change(screen.getByLabelText("EPC"), {
      target: { value: "EPC-001" },
    });

    await fireEvent.submit(
      screen.getByRole("button", { name: "Confirmar" }).closest("form")!,
    );

    await createTagMock.mock.results[0]?.value;

    expect(createTagMock).toHaveBeenCalledTimes(1);
    expect(createTagMock.mock.calls[0]?.[0]).toEqual({
      tid: "TID-001",
      epc: "EPC-001",
    });
    expect(toastSuccessSpy).toHaveBeenCalledWith(
      "Etiqueta adicionada com sucesso.",
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should show an error when submission fails", async () => {
    createTagMock.mockImplementationOnce(async () => {
      throw new Error("Failed");
    });
    renderModal();

    fireEvent.change(screen.getByLabelText("TID"), {
      target: { value: "TID-001" },
    });
    fireEvent.change(screen.getByLabelText("EPC"), {
      target: { value: "EPC-001" },
    });

    await fireEvent.submit(
      screen.getByRole("button", { name: "Confirmar" }).closest("form")!,
    );

    await createTagMock.mock.results[0]?.value.catch(() => undefined);

    expect(toastErrorSpy).toHaveBeenCalledTimes(1);
    expect(toastErrorSpy).toHaveBeenCalledWith(
      "Erro ao adicionar etiqueta. Verifique os campos e tente novamente.",
    );
  });

  it("should disable the submit button while the request is pending", () => {
    useCreateTagSpy.mockImplementationOnce(
      () =>
        ({
          mutateAsync: createTagMock,
          isPending: true,
        }) as never,
    );

    renderModal();

    expect(
      screen.getByRole("button", { name: "Confirmando..." }),
    ).toBeDisabled();
  });
});
