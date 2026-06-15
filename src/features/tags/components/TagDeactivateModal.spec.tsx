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
import { cleanup, render, screen } from "@testing-library/react";
import { toast } from "@/components/ui/toast";
import * as tagHooks from "../hooks";
import type { TagListItemDto } from "../dtos";

const mutateMock = mock();
const useDeactivateTagSpy = spyOn(tagHooks, "useDeactivateTag");
const toastSuccessSpy = spyOn(toast, "success");
const toastErrorSpy = spyOn(toast, "error");

useDeactivateTagSpy.mockImplementation(
  () =>
    ({
      mutate: mutateMock,
      isPending: false,
    }) as never,
);

const { TagDeactivateModal } = await import("./TagDeactivateModal");

const mockTag: TagListItemDto = {
  tagId: "tag-001",
  tid: "E20034120130000000000001",
  epc: "300833B2DDD9014000000001",
  userName: "John Doe",
  plate: "ABC-1234",
  status: "IN_USE",
};

describe("TagDeactivateModal component", () => {
  afterEach(cleanup);

  beforeEach(() => {
    mutateMock.mockReset();
    toastSuccessSpy.mockReset();
    toastErrorSpy.mockReset();
  });

  afterAll(() => {
    useDeactivateTagSpy.mockRestore();
    toastSuccessSpy.mockRestore();
    toastErrorSpy.mockRestore();
  });

  it("should not render content when isOpen is false", () => {
    render(
      <TagDeactivateModal isOpen={false} onClose={mock()} tag={mockTag} />,
    );
    expect(screen.queryByText("Desativar")).toBeNull();
  });

  it("should render the confirmation modal when isOpen is true", () => {
    render(<TagDeactivateModal isOpen={true} onClose={mock()} tag={mockTag} />);
    expect(
      screen.getByText("Tem certeza que deseja desativar essa etiqueta?"),
    ).toBeDefined();
    expect(screen.getByText("Essa ação não pode ser desfeita.")).toBeDefined();
  });

  it("should render Cancelar and Desativar buttons", () => {
    render(<TagDeactivateModal isOpen={true} onClose={mock()} tag={mockTag} />);
    expect(screen.getByText("Cancelar")).toBeDefined();
    expect(screen.getByText("Desativar")).toBeDefined();
  });

  it("should call onClose when Cancelar is clicked", () => {
    const onClose = mock();
    render(
      <TagDeactivateModal isOpen={true} onClose={onClose} tag={mockTag} />,
    );
    screen.getByText("Cancelar").click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call mutate with the tag id when Desativar is clicked", () => {
    render(<TagDeactivateModal isOpen={true} onClose={mock()} tag={mockTag} />);
    screen.getByText("Desativar").click();
    expect(mutateMock).toHaveBeenCalledTimes(1);
    expect(mutateMock.mock.calls[0]?.[0]).toBe("tag-001");
  });

  it("should not call mutate when tag is null and Desativar is clicked", () => {
    render(<TagDeactivateModal isOpen={true} onClose={mock()} tag={null} />);
    screen.getByText("Desativar").click();
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("should call onClose after a successful deactivation", () => {
    const onClose = mock();
    mutateMock.mockImplementationOnce(
      (_id: string, callbacks: { onSuccess: () => void }) => {
        callbacks.onSuccess();
      },
    );
    render(
      <TagDeactivateModal isOpen={true} onClose={onClose} tag={mockTag} />,
    );
    screen.getByText("Desativar").click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose on a failed deactivation", () => {
    const onClose = mock();
    mutateMock.mockImplementationOnce(
      (_id: string, callbacks: { onError: () => void }) => {
        callbacks.onError();
      },
    );
    render(
      <TagDeactivateModal isOpen={true} onClose={onClose} tag={mockTag} />,
    );
    screen.getByText("Desativar").click();
    expect(onClose).not.toHaveBeenCalled();
  });
});
