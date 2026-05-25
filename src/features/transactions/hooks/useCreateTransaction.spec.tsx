import { describe, expect, it, spyOn, afterEach } from "bun:test";
import { renderHook, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreateTransaction } from "./useCreateTransaction";
import { transactionService } from "../TransactionService";
import type { ReactNode } from "react";
import type { TransactionDto } from "../dtos";

afterEach(() => {
  cleanup();
});

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

describe("useCreateTransaction", () => {
  it("should create a transaction successfully and invalidate queries", async () => {
    const mockCreatedTransaction: TransactionDto = {
      transactionId: "new-tx-id",
      amount: 15,
      transactionType: "deposit",
      userId: "1",
      description: "Credit purchase",
      createdAt: new Date().toISOString(),
    };

    const createSpy = spyOn(
      transactionService,
      "createTransaction",
    ).mockResolvedValueOnce(mockCreatedTransaction);
    const invalidateSpy = spyOn(
      queryClient,
      "invalidateQueries",
    ).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useCreateTransaction(), { wrapper });

    result.current.mutate({
      amount: 15,
      description: "Credit purchase",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCreatedTransaction);
    expect(createSpy).toHaveBeenCalledWith({
      amount: 15,
      description: "Credit purchase",
    });
    expect(invalidateSpy).toHaveBeenCalled();
  });
});
