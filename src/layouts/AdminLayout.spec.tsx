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
import * as toastModule from "@/components/ui/toast";
import * as authContextModule from "@/features/auth/context/AuthContext";
import type { UserDto } from "@/features/users/dtos";

const useAuthContextSpy = spyOn(authContextModule, "useAuthContext");
const toastErrorSpy = spyOn(toastModule.toast, "error");

const { AdminLayout } = await import("./AdminLayout");

function renderAdminLayout(initialEntry = "/admin") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<div>Home page</div>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div>Admin page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminLayout", () => {
  beforeEach(() => {
    useAuthContextSpy.mockReset();
    toastErrorSpy.mockReset();
  });

  afterEach(cleanup);

  afterAll(() => {
    useAuthContextSpy.mockRestore();
    toastErrorSpy.mockRestore();
  });

  it("renders admin content when user is admin", () => {
    useAuthContextSpy.mockReturnValue({
      isLoading: false,
      currentUser: { role: "admin" } as UserDto,
    });

    renderAdminLayout();

    expect(screen.getByText("Admin page")).toBeInTheDocument();
    expect(toastErrorSpy).not.toHaveBeenCalled();
  });

  it("does not redirect while loading", () => {
    useAuthContextSpy.mockReturnValue({
      isLoading: true,
      currentUser: undefined,
    });

    renderAdminLayout();

    expect(screen.queryByText("Home page")).not.toBeInTheDocument();
    expect(toastErrorSpy).not.toHaveBeenCalled();
  });

  it("shows toast and redirects when currentUser is undefined", async () => {
    useAuthContextSpy.mockReturnValue({
      isLoading: false,
      currentUser: undefined,
    });

    renderAdminLayout();

    await waitFor(() => {
      expect(screen.getByText("Home page")).toBeInTheDocument();
    });

    expect(toastErrorSpy).toHaveBeenCalledWith(
      "Você não tem permissão para acessar essa página.",
    );
  });
});
