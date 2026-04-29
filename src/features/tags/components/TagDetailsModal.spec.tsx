import { afterEach, describe, expect, it, mock } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import type { TagListItemDto } from "../dtos";
import { TagDetailsModal } from "./TagDetailsModal";

const mockTag: TagListItemDto = {
  id: "tag-001",
  userName: "John Doe",
  plate: "ABC-1234",
  status: "AVAILABLE",
};

describe("TagDetailsModal component", () => {
  afterEach(cleanup);

  it("should not render content when tag is null", () => {
    render(<TagDetailsModal isOpen={true} onClose={mock()} tag={null} />);
    expect(screen.queryByText("tag-001")).toBeNull();
  });

  it("should render the tag id", () => {
    render(<TagDetailsModal isOpen={true} onClose={mock()} tag={mockTag} />);
    expect(screen.getByText("tag-001")).toBeDefined();
  });

  it("should render the tag owner name", () => {
    render(<TagDetailsModal isOpen={true} onClose={mock()} tag={mockTag} />);
    expect(screen.getByText("John Doe")).toBeDefined();
  });

  it("should render the tag plate", () => {
    render(<TagDetailsModal isOpen={true} onClose={mock()} tag={mockTag} />);
    expect(screen.getByText("ABC-1234")).toBeDefined();
  });

  it("should render '—' when userName is null", () => {
    const tagWithoutUser = { ...mockTag, userName: null };
    render(
      <TagDetailsModal isOpen={true} onClose={mock()} tag={tagWithoutUser} />,
    );
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("should render '—' when plate is null", () => {
    const tagWithoutPlate = { ...mockTag, plate: null };
    render(
      <TagDetailsModal isOpen={true} onClose={mock()} tag={tagWithoutPlate} />,
    );
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("should call onClose when the close button is clicked", () => {
    const onClose = mock();
    render(<TagDetailsModal isOpen={true} onClose={onClose} tag={mockTag} />);
    screen.getByText("Fechar").click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not render content when isOpen is false", () => {
    render(<TagDetailsModal isOpen={false} onClose={mock()} tag={mockTag} />);
    expect(screen.queryByText("tag-001")).toBeNull();
  });
});
