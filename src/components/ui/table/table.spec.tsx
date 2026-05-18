import { afterEach, describe, expect, it, mock } from "bun:test";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";

import { Table, type TableColumn } from ".";

type Person = {
  id: number;
  name: string;
  age: number;
  joinedAt: string;
  city?: string;
};

const baseData: Person[] = [
  { id: 1, name: "Carol", age: 30, joinedAt: "2024-01-10", city: "Recife" },
  { id: 2, name: "Alice", age: 25, joinedAt: "2023-05-01", city: "Salvador" },
  { id: 3, name: "Bob", age: 35, joinedAt: "2025-02-20", city: undefined },
];

const columns: TableColumn<Person>[] = [
  { key: "name", title: "Nome", sortable: true },
  { key: "age", title: "Idade", sortable: true },
  { key: "joinedAt", title: "Entrada", sortable: true },
  { key: "city", title: "Cidade" },
];

describe("Table", () => {
  afterEach(cleanup);

  it("renders searchable input by default and supports a custom search bar component", () => {
    render(
      <Table
        data={baseData}
        columns={columns}
        searchPlaceholder="Buscar pessoas"
        searchBarComponent={<button type="button">Filtro</button>}
      />,
    );

    expect(screen.getByPlaceholderText("Buscar pessoas")).toBeDefined();
    expect(screen.getByRole("button", { name: "Filtro" })).toBeDefined();
  });

  it("hides search UI when searchable is false", () => {
    render(<Table data={baseData} columns={columns} searchable={false} />);
    expect(screen.queryByPlaceholderText("Pesquisar...")).toBeNull();
  });

  it("renders custom column cells using render callback", () => {
    render(
      <Table
        data={baseData}
        columns={[
          {
            key: "name",
            title: "Nome",
            render: (value) => <strong>{String(value)}!</strong>,
          },
        ]}
      />,
    );

    expect(screen.getByText("Carol!")).toBeDefined();
  });

  it("filters rows and highlights matched text", () => {
    render(<Table data={baseData} columns={columns} />);

    fireEvent.change(screen.getByPlaceholderText("Pesquisar..."), {
      target: { value: "ali" },
    });

    expect(screen.getByText("Ali")).toBeDefined();
    expect(screen.queryByText("Carol")).toBeNull();
    expect(
      document.querySelectorAll('[class*="bg-light-blue/50"]').length,
    ).toBeGreaterThan(0);
  });

  it("renders empty message and search-not-found message", () => {
    const { rerender } = render(
      <Table<Person>
        data={[]}
        columns={columns}
        emptyMessage="Sem dados"
        searchNotFoundMessage="Sem resultados"
      />,
    );

    expect(screen.getByText("Sem dados")).toBeDefined();

    rerender(
      <Table
        data={baseData}
        columns={columns}
        emptyMessage="Sem dados"
        searchNotFoundMessage="Sem resultados"
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Pesquisar..."), {
      target: { value: "nao-existe" },
    });

    expect(screen.getByText("Sem resultados")).toBeDefined();
  });

  it("renders loading skeleton when loading=true", () => {
    const { container } = render(
      <Table
        data={baseData}
        columns={columns}
        loading
        paginationPageSize={2}
      />,
    );

    expect(container.querySelectorAll("tbody tr")).toHaveLength(5);
  });

  it("sorts data when clicking sortable headers and toggles indicators", () => {
    render(<Table data={baseData} columns={columns} searchable={false} />);

    const nameHeader = screen.getByRole("columnheader", { name: /nome/i });
    fireEvent.click(nameHeader);

    const rowsAfterAsc = screen.getAllByRole("row").slice(1);
    expect(
      within(rowsAfterAsc[0] as HTMLElement).getByText("Alice"),
    ).toBeDefined();
    expect(within(nameHeader).getByText("↑")).toBeDefined();

    fireEvent.click(nameHeader);

    const rowsAfterDesc = screen.getAllByRole("row").slice(1);
    expect(
      within(rowsAfterDesc[0] as HTMLElement).getByText("Carol"),
    ).toBeDefined();
    expect(within(nameHeader).getByText("↓")).toBeDefined();
  });

  it("supports row click and keyboard activation", () => {
    const onRowClick = mock();
    render(<Table data={baseData} columns={columns} onRowClick={onRowClick} />);

    const bodyRows = screen.getAllByRole("button");
    fireEvent.click(bodyRows[0] as HTMLElement);
    fireEvent.keyDown(bodyRows[1] as HTMLElement, { key: "Enter" });
    fireEvent.keyDown(bodyRows[1] as HTMLElement, { key: " " });

    expect(onRowClick).toHaveBeenCalledTimes(3);
  });

  it("renders actions, respects show callback and stops row click propagation", () => {
    const onRowClick = mock();
    const onActionClick = mock();

    render(
      <Table
        data={baseData}
        columns={columns}
        onRowClick={onRowClick}
        actions={[
          {
            key: "edit",
            label: "Editar",
            onClick: onActionClick,
            show: (item) => item.id !== 2,
          },
        ]}
      />,
    );

    const buttons = screen.getAllByRole("button", { name: "Editar" });
    expect(buttons).toHaveLength(2);

    fireEvent.click(buttons[0] as HTMLElement);

    expect(onActionClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it("supports pagination navigation and disabled states", () => {
    const manyRows: Person[] = [
      ...baseData,
      { id: 4, name: "Dani", age: 28, joinedAt: "2022-01-01", city: "Natal" },
      { id: 5, name: "Eva", age: 29, joinedAt: "2021-01-01", city: "Maceió" },
    ];

    render(<Table data={manyRows} columns={columns} paginationPageSize={2} />);

    expect(screen.getByText("1 / 3")).toBeDefined();
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Próxima" }));
    expect(screen.getByText("2 / 3")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Próxima" }));
    expect(screen.getByText("3 / 3")).toBeDefined();
    expect(screen.getByRole("button", { name: "Próxima" })).toBeDisabled();
  });

  it("does not render pagination when page size is invalid", () => {
    render(<Table data={baseData} columns={columns} paginationPageSize={0} />);

    expect(screen.queryByRole("button", { name: "Anterior" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Próxima" })).toBeNull();
  });

  it("clamps current page when data shrinks", () => {
    const manyRows: Person[] = [
      ...baseData,
      { id: 4, name: "Dani", age: 28, joinedAt: "2022-01-01", city: "Natal" },
    ];

    const { rerender } = render(
      <Table data={manyRows} columns={columns} paginationPageSize={2} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Próxima" }));
    expect(screen.getByText("2 / 2")).toBeDefined();

    rerender(
      <Table data={baseData} columns={columns} paginationPageSize={2} />,
    );

    expect(screen.getByText("2 / 2")).toBeDefined();
  });
});
