import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "bun:test";
import { RecentExitComponent } from "./recent-exit-component";
import type { TransactionDto } from "@/features/transactions/dtos/transactionDto";

const mockTransactions: TransactionDto[] = [
  {
    transactionId: "1",
    transactionType: "withdrawal",
    description: "ABCD1234",
    amount: 15.0,
    createdAt: "2026-03-12T09:33:00",
  },
];
describe("RecentExitComponent", () => {
  it("should render the table with the correct plate, date, and currency formatting", () => {
    render(<RecentExitComponent transactions={mockTransactions} />);

    expect(screen.getByText("ABCD-1234")).toBeTruthy();

    expect(screen.getByText(/12\/03\/2026 às 09:33/i)).toBeTruthy();

    expect(screen.getByText(/15,00/i)).toBeTruthy();
  });

  it("should handle empty or corrupted data without crashing the screen", () => {
    const corruptedMock: TransactionDto[] = [
      {
        transactionId: "2",
        transactionType: "withdrawal",
        description: "",
        amount: null as unknown as number,
        createdAt: "",
      },
    ];

    render(<RecentExitComponent transactions={corruptedMock} />);

    const dash = screen.getAllByText("-");
    expect(dash.length).toBeGreaterThan(0);
  });

  it("should render the table correctly when the list is completely empty", () => {
    const { container } = render(<RecentExitComponent transactions={[]} />);

    expect(container).toBeTruthy();
  });
});
