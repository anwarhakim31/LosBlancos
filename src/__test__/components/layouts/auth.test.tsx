import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { usePathname, useSearchParams } from "next/navigation";
import AuthLayouts from "@/components/layouts/AuthLayout";

import { signIn } from "next-auth/react";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

describe("AuthLayouts Component", () => {
  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((key) => {
        if (key === "callbackUrl") return "/";
        return null;
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login view when pathname is '/login'", () => {
    (usePathname as jest.Mock).mockReturnValue("/login");

    render(<AuthLayouts />);

    expect(screen.getByText("Belum punya akun?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Masuk" })).toBeInTheDocument();
  });
  it("should call signIn when Google button is clicked", () => {
    (usePathname as jest.Mock).mockReturnValue("/login");
    render(<AuthLayouts />);

    const button = screen.getByRole("button", { name: "Masuk" });
    fireEvent.click(button);

    waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("google", {
        callbackUrl: "/",
      });
    });
  });

  it("renders the register view when pathname is '/register'", () => {
    (usePathname as jest.Mock).mockReturnValue("/register");

    render(<AuthLayouts />);

    expect(screen.getByText("Sudah punya akun?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Daftar" })).toBeInTheDocument();
  });

  it("renders the register view when pathname is '/register'", () => {
    (usePathname as jest.Mock).mockReturnValue("/register");

    render(<AuthLayouts />);

    const button = screen.getByRole("button", { name: "Daftar" });
    fireEvent.click(button);

    waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        callbackUrl: "/register",
      });
    });
  });
});
