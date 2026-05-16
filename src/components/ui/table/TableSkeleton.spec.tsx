import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import { TableSkeleton } from "./TableSkeleton";

describe("TableSkeleton", () => {
  afterEach(cleanup);

  it("renders 5 loading rows and the configured number of columns", () => {
    const { container } = render(
      <table>
        <TableSkeleton columnsCount={3} actionsCount={0} />
      </table>,
    );

    expect(container.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(container.querySelectorAll("tbody tr:first-child td")).toHaveLength(
      3,
    );
  });

  it("renders action placeholders when actions are enabled", () => {
    const { container } = render(
      <table>
        <TableSkeleton columnsCount={2} actionsCount={2} />
      </table>,
    );

    expect(container.querySelectorAll("tbody tr:first-child td")).toHaveLength(
      3,
    );
    expect(
      container.querySelectorAll("tbody tr:first-child .w-8"),
    ).toHaveLength(2);
  });
});
