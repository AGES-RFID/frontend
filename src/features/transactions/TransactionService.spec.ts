import { beforeEach, describe, expect, it, mock } from "bun:test";
import { type ApiClient, api } from "@/lib/api";
import { TransactionService } from "./TransactionService";
import { jsonResponse } from "/test/utils/makeResponse";

describe("TransactionService", () => {
  let fetchMock = mock();
  let apiMock: ApiClient;
  let service: TransactionService;

  beforeEach(() => {
    fetchMock = mock();
    apiMock = api.extend({ fetch: fetchMock });
    service = new TransactionService(apiMock);
  });

  it("should call the api route with correct method to fetch my transactions", async () => {
    fetchMock.mockImplementationOnce(async () => jsonResponse([]));

    await service.myTransactions();

    const [request] = fetchMock.mock.calls[0] ?? [];
    expect(request.url).toContain("/transactions/me");
    expect(request.method).toBe("GET");
  });

  it("should create a new transaction with correct payload", async () => {
    fetchMock.mockImplementationOnce(async () =>
      jsonResponse({
        transactionId: "123",
        userId: "1",
        transactionType: "deposit",
        description: "Test",
        amount: 10,
        createdAt: new Date().toISOString(),
      }),
    );

    await service.createTransaction({ amount: 10, description: "Test" });

    const [request] = fetchMock.mock.calls[0] ?? [];
    expect(request.url).toContain("/transactions");
    expect(request.method).toBe("POST");
  });
});
