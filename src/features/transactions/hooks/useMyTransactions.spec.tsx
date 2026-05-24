import { describe, expect, it, spyOn } from "bun:test";
import { renderHook, waitFor, cleanup } from "@testing-library/react";
import { afterEach } from "bun:test";

afterEach(() => {
  cleanup();
});
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMyTransactions } from "./useMyTransactions";
import type { ReactNode } from "react";
import type { TransactionDto } from "../dtos";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

import { transactionService } from "../TransactionService";

describe("useMyTransactions", () => {
  it("should return my transactions on success", async () => {
    const mockData: TransactionDto[] = [
      {
        transactionId: "1",
        amount: 10,
        transactionType: "deposit",
        userId: "1",
        description: "test",
        createdAt: new Date().toISOString(),
      },
    ];
    spyOn(transactionService, "myTransactions").mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useMyTransactions(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});
