import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "bun:test";
import { RecentExitComponent } from "./recent-exit-component";
import type { TransactionDto } from "@/features/transactions/dtos/transactionDto";

const mockTransactions: TransactionDto[] = [
  {
    transactionId: "1",
    transactionType: "DEBIT" as any,
    description: "Placa Mercosul ABCD1234",
    amount: 15.0,
    createdAt: "2026-03-12T09:33:00",
  },
];

describe("RecentExitComponent", () => {
  it("deve renderizar a tabela com as formatações corretas de placa, data e moeda", () => {
    render(<RecentExitComponent transactions={mockTransactions} />);

    expect(screen.getByText("ABCD-1234")).toBeTruthy();

    expect(screen.getByText(/12\/03\/2026 às 09:33/i)).toBeTruthy();

    expect(screen.getByText(/R\$\s?15,00/i)).toBeTruthy();
  });

  it("deve tratar dados vazios ou corrompidos sem quebrar a tela", () => {
    const mockCorrompido = [
      {
        transactionId: "2",
        transactionType: "DEBIT" as any,
        description: "",
        amount: null as unknown as number,
        createdAt: "",
      },
    ];

    render(<RecentExitComponent transactions={mockCorrompido} />);

    const tracos = screen.getAllByText("-");
    expect(tracos.length).toBeGreaterThan(0);
  });

  it("deve renderizar a tabela corretamente quando a lista vier completamente vazia", () => {
    render(<RecentExitComponent transactions={[]} />);

    expect(screen.getByRole("table")).toBeTruthy();
  });
});
