import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  spyOn,
} from "bun:test";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import * as authContextModule from "@/features/auth/context/AuthContext";
import type { UserDto } from "@/features/users/dtos";

const useAuthContextSpy = spyOn(authContextModule, "useAuthContext");

const { CustomerLayout } = await import("./CustomerLayout");

function renderCustomerLayout(initialEntry = "/") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<div>Customer page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("CustomerLayout", () => {
  beforeEach(() => {
    useAuthContextSpy.mockReset();
  });

  afterEach(cleanup);

  afterAll(() => {
    useAuthContextSpy.mockRestore();
  });

  it("renders customer content when user is authenticated", () => {
    useAuthContextSpy.mockReturnValue({
      isLoading: false,
      currentUser: { role: "customer" } as UserDto,
    });

    renderCustomerLayout();

    expect(screen.getByText("Customer page")).toBeInTheDocument();
  });

  it("does not redirect while loading", () => {
    useAuthContextSpy.mockReturnValue({
      isLoading: true,
      currentUser: undefined,
    });

    renderCustomerLayout();

    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });

  it("redirects to login when user is not authenticated", async () => {
    useAuthContextSpy.mockReturnValue({
      isLoading: false,
      currentUser: undefined,
    });

    renderCustomerLayout();

    await waitFor(() => {
      expect(screen.getByText("Login page")).toBeInTheDocument();
    });
  });
});
