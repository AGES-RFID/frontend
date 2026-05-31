import { describe, expect, it, mock, spyOn, beforeEach } from "bun:test";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Payment } from "./payment";
import { afterEach, afterAll } from "bun:test";
import * as useMeHook from "@/features/auth/hooks/useMe";
import * as useMyTransactionsHook from "@/features/transactions/hooks/useMyTransactions";
import * as useCreateTransactionHook from "@/features/transactions/hooks/useCreateTransaction";
import * as usePricingHook from "@/features/parking-prices/hooks/usePricing";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";

afterEach(() => {
  cleanup();
});

afterAll(() => {
  mock.restore();
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const useMeResult = (result: Partial<ReturnType<typeof useMeHook.useMe>>) =>
  result as ReturnType<typeof useMeHook.useMe>;

const useMyTransactionsResult = (
  result: Partial<ReturnType<typeof useMyTransactionsHook.useMyTransactions>>,
) => result as ReturnType<typeof useMyTransactionsHook.useMyTransactions>;

const useCreateTransactionResult = (
  result: Partial<
    ReturnType<typeof useCreateTransactionHook.useCreateTransaction>
  >,
) => result as ReturnType<typeof useCreateTransactionHook.useCreateTransaction>;

const usePricingResult = (
  result: Partial<ReturnType<typeof usePricingHook.usePricing>>,
) => result as ReturnType<typeof usePricingHook.usePricing>;

const mockUser = {
  userId: "1",
  name: "Eduardo",
  email: "eduardo@example.com",
  role: "customer",
  balance: 150,
  vehicles: [],
} satisfies NonNullable<ReturnType<typeof useMeHook.useMe>["data"]>;

describe("Payment Route", () => {
  beforeEach(() => {
    spyOn(usePricingHook, "usePricing").mockReturnValue(
      usePricingResult({
        isLoading: false,
        isError: false,
        data: {
          parkingPriceId: "550e8400-e29b-41d4-a716-446655440000",
          toleranceMinutes: 15,
          basePrice: 10,
          hourlyRate: 5,
          thresholdMinutes: 180,
        },
        refetch: mock(),
      }),
    );
  });

  it("should render loading state when user data is loading", () => {
    spyOn(useMeHook, "useMe").mockReturnValue(
      useMeResult({
        isLoading: true,
        isError: false,
        data: undefined,
        refetch: mock(),
      }),
    );

    spyOn(useMyTransactionsHook, "useMyTransactions").mockReturnValue(
      useMyTransactionsResult({
        isLoading: false,
        isError: false,
        data: [],
        refetch: mock(),
      }),
    );

    spyOn(useCreateTransactionHook, "useCreateTransaction").mockReturnValue(
      useCreateTransactionResult({
        mutate: mock(),
      }),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Payment />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("should render error state when user data fetching fails", () => {
    spyOn(useMeHook, "useMe").mockReturnValue(
      useMeResult({
        isLoading: false,
        isError: true,
        data: undefined,
        refetch: mock(),
      }),
    );

    spyOn(useMyTransactionsHook, "useMyTransactions").mockReturnValue(
      useMyTransactionsResult({
        isLoading: false,
        isError: false,
        data: [],
        refetch: mock(),
      }),
    );

    spyOn(useCreateTransactionHook, "useCreateTransaction").mockReturnValue(
      useCreateTransactionResult({
        mutate: mock(),
      }),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Payment />
      </QueryClientProvider>,
    );

    expect(
      screen.getByText("Ocorreu um erro ao carregar seus dados."),
    ).toBeInTheDocument();
  });

  it("should render loading text when transactions are loading", () => {
    spyOn(useMeHook, "useMe").mockReturnValue(
      useMeResult({
        isLoading: false,
        isError: false,
        data: mockUser,
        refetch: mock(),
      }),
    );

    spyOn(useMyTransactionsHook, "useMyTransactions").mockReturnValue(
      useMyTransactionsResult({
        isLoading: true,
        isError: false,
        data: undefined,
        refetch: mock(),
      }),
    );

    spyOn(useCreateTransactionHook, "useCreateTransaction").mockReturnValue(
      useCreateTransactionResult({
        mutate: mock(),
      }),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Payment />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Carregando histórico...")).toBeInTheDocument();
  });

  it("should render error text when transactions load fails", () => {
    spyOn(useMeHook, "useMe").mockReturnValue(
      useMeResult({
        isLoading: false,
        isError: false,
        data: mockUser,
        refetch: mock(),
      }),
    );

    spyOn(useMyTransactionsHook, "useMyTransactions").mockReturnValue(
      useMyTransactionsResult({
        isLoading: false,
        isError: true,
        data: undefined,
        refetch: mock(),
      }),
    );

    spyOn(useCreateTransactionHook, "useCreateTransaction").mockReturnValue(
      useCreateTransactionResult({
        mutate: mock(),
      }),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Payment />
      </QueryClientProvider>,
    );

    expect(
      screen.getByText("Ocorreu um erro ao carregar as movimentações."),
    ).toBeInTheDocument();
  });

  it("should render empty text when user has no transactions", () => {
    spyOn(useMeHook, "useMe").mockReturnValue(
      useMeResult({
        isLoading: false,
        isError: false,
        data: mockUser,
        refetch: mock(),
      }),
    );

    spyOn(useMyTransactionsHook, "useMyTransactions").mockReturnValue(
      useMyTransactionsResult({
        isLoading: false,
        isError: false,
        isSuccess: true,
        data: [],
        refetch: mock(),
      }),
    );

    spyOn(useCreateTransactionHook, "useCreateTransaction").mockReturnValue(
      useCreateTransactionResult({
        mutate: mock(),
      }),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Payment />
      </QueryClientProvider>,
    );

    expect(
      screen.getByText("Nenhuma movimentação encontrada."),
    ).toBeInTheDocument();
  });

  it("should render transaction cards for deposit and withdrawal", () => {
    spyOn(useMeHook, "useMe").mockReturnValue(
      useMeResult({
        isLoading: false,
        isError: false,
        data: mockUser,
        refetch: mock(),
      }),
    );

    spyOn(useMyTransactionsHook, "useMyTransactions").mockReturnValue(
      useMyTransactionsResult({
        isLoading: false,
        isError: false,
        isSuccess: true,
        data: [
          {
            transactionId: "t1",
            transactionType: "deposit",
            amount: 50,
            createdAt: new Date().toISOString(),
            userId: "1",
            description: "Depósito PIX",
          },
          {
            transactionId: "t2",
            transactionType: "withdrawal",
            amount: 15.5,
            createdAt: new Date().toISOString(),
            userId: "1",
            description: "Saída de veículo com placa ABC1234",
          },
        ],
        refetch: mock(),
      }),
    );

    spyOn(useCreateTransactionHook, "useCreateTransaction").mockReturnValue(
      useCreateTransactionResult({
        mutate: mock(),
      }),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Payment />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Pagamentos")).toBeInTheDocument();

    const transactionCards = screen.getAllByTestId("transaction-card");
    expect(transactionCards).toHaveLength(2);

    expect(screen.getByText(/\+R\$\s*50,00/)).toBeInTheDocument();
    expect(screen.getByText(/-R\$\s*15,50/)).toBeInTheDocument();
    expect(screen.getByText("ABC1234")).toBeInTheDocument();
  });

  it("should open credit modal, add balance, and trigger onSuccess/onError callbacks", async () => {
    const refetchMeMock = mock();
    const refetchTransactionsMock = mock();

    spyOn(useMeHook, "useMe").mockReturnValue(
      useMeResult({
        isLoading: false,
        isError: false,
        data: mockUser,
        refetch: refetchMeMock,
      }),
    );

    spyOn(useMyTransactionsHook, "useMyTransactions").mockReturnValue(
      useMyTransactionsResult({
        isLoading: false,
        isError: false,
        isSuccess: true,
        data: [],
        refetch: refetchTransactionsMock,
      }),
    );

    type CreateTransactionMutate = ReturnType<
      typeof useCreateTransactionHook.useCreateTransaction
    >["mutate"];
    type CreateTransactionPayload = Parameters<CreateTransactionMutate>[0];
    type CreateTransactionOptions = Parameters<CreateTransactionMutate>[1];

    let mutateOptions: CreateTransactionOptions;
    const mutateMock = mock(
      (
        _payload: CreateTransactionPayload,
        options?: CreateTransactionOptions,
      ) => {
        mutateOptions = options;
      },
    );

    spyOn(useCreateTransactionHook, "useCreateTransaction").mockReturnValue(
      useCreateTransactionResult({
        mutate: mutateMock,
      }),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Payment />
      </QueryClientProvider>,
    );

    const addBalanceBtn = screen.getByRole("button", {
      name: /Adicionar saldo/i,
    });
    fireEvent.click(addBalanceBtn);

    const confirmBtn = await screen.findByRole("button", {
      name: /Confirmar/i,
    });
    expect(confirmBtn).toBeDisabled();

    const suggestedBtn = screen.getByRole("button", {
      name: /\+\s*R\$\s*10,00/i,
    });
    fireEvent.click(suggestedBtn);

    expect(confirmBtn).not.toBeDisabled();
    fireEvent.click(confirmBtn);

    expect(mutateMock).toHaveBeenCalled();
    const callArgs = mutateMock.mock.calls[0];
    expect(callArgs).toBeDefined();
    if (!callArgs) return;
    expect(callArgs[0]).toEqual({
      amount: 10,
      description: "Crédito adicionado pelo usuário",
    });

    const toastSuccessSpy = spyOn(toast, "success");
    const onSuccess = mutateOptions?.onSuccess as (() => void) | undefined;
    onSuccess?.();
    expect(toastSuccessSpy).toHaveBeenCalled();
    expect(refetchMeMock).toHaveBeenCalled();
    expect(refetchTransactionsMock).toHaveBeenCalled();

    const toastErrorSpy = spyOn(toast, "error");
    const onError = mutateOptions?.onError as (() => void) | undefined;
    onError?.();
    expect(toastErrorSpy).toHaveBeenCalled();
  });
});
