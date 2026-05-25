import "@testing-library/jest-dom";
import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import { TableSkeleton } from "./TableSkeleton";

describe("TableSkeleton", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders 5 skeleton rows", () => {
    const { container } = render(
      <table>
        <TableSkeleton columnsCount={3} actionsCount={0} />
      </table>,
    );

    const rows = container.querySelectorAll("tbody tr");

    expect(rows).toHaveLength(5);
  });

  it("renders the correct number of columns when there are no actions", () => {
    const { container } = render(
      <table>
        <TableSkeleton columnsCount={3} actionsCount={0} />
      </table>,
    );

    const firstRowCells = container.querySelectorAll("tbody tr:first-child td");

    expect(firstRowCells).toHaveLength(3);
  });

  it("does not render action column when actionsCount is zero", () => {
    const { container } = render(
      <table>
        <TableSkeleton columnsCount={2} actionsCount={0} />
      </table>,
    );

    const actionSkeletons = container.querySelectorAll(".w-8");

    expect(actionSkeletons).toHaveLength(0);
  });

  it("renders action column when actionsCount is greater than zero", () => {
    const { container } = render(
      <table>
        <TableSkeleton columnsCount={2} actionsCount={2} />
      </table>,
    );

    const firstRowCells = container.querySelectorAll("tbody tr:first-child td");
    const actionSkeletons = container.querySelectorAll(".w-8");

    expect(firstRowCells).toHaveLength(3);
    expect(actionSkeletons).toHaveLength(10);
  });

  it("removes bottom border from the last row", () => {
    const { container } = render(
      <table>
        <TableSkeleton columnsCount={2} actionsCount={1} />
      </table>,
    );

    const rows = container.querySelectorAll("tbody tr");
    const lastRow = rows[rows.length - 1];

    expect(lastRow).toHaveClass("border-b-0");
  });
});
