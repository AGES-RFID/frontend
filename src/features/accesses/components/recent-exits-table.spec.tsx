import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import type { AccessDto } from "@/features/accesses/dtos";
import { RecentExitsTable } from "./recent-exits-table";

afterEach(() => {
  cleanup();
});

describe("RecentExitsTable", () => {
  it("should render plate, date and value", () => {
    const accesses: AccessDto[] = [
      {
        accessId: "1",
        tagId: "tag-1",
        type: "exit",
        timestamp: "2026-03-12T09:33:00",
        plate: "ABCD1234",
        value: 15,
      },
    ];

    render(<RecentExitsTable accesses={accesses} />);

    expect(screen.getAllByText("ABCD-1234")).toBeTruthy();
    expect(screen.getAllByText(/09:33/i)).toBeTruthy();
    expect(screen.getAllByText(/15,00/i)).toBeTruthy();
  });

  it("should render dash for nullable value", () => {
    const accesses: AccessDto[] = [
      {
        accessId: "1",
        tagId: "tag-1",
        type: "exit",
        timestamp: "2026-03-12T09:33:00",
        plate: "ABCD1234",
        value: null,
      },
    ];

    render(<RecentExitsTable accesses={accesses} />);

    expect(screen.getByText("ABCD-1234")).toBeTruthy();
    expect(screen.getByText("-")).toBeTruthy();
  });
});
