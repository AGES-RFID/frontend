import { describe, expect, it, mock, spyOn } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { Payment } from "./payment";
import { afterEach, afterAll } from "bun:test";

afterEach(() => {
  cleanup();
});

afterAll(() => {
  mock.restore();
});

// Mock the hooks used in Payment
mock.module("@/features/auth/hooks/useMe", () => ({
  useMe: () => ({
    isLoading: false,
    isError: false,
    data: {
      userId: "1",
      name: "Eduardo",
      balance: 150,
    },
    refetch: mock(),
  }),
}));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { transactionService } from "@/features/transactions/TransactionService";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("Payment Route", () => {
  it("should render the Payment page successfully", () => {
    spyOn(transactionService, "myTransactions").mockResolvedValueOnce([
      {
        transactionId: "1",
        transactionType: "deposit",
        amount: 50,
        createdAt: new Date().toISOString(),
        userId: "1",
        description: "Test",
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <Payment />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Pagamentos")).toBeInTheDocument();
    expect(screen.getByText("Seu saldo:")).toBeInTheDocument();
    expect(screen.getByText("Tabela de Preços")).toBeInTheDocument();
    expect(screen.getByText("Histórico de Movimentações")).toBeInTheDocument();
  });
});
