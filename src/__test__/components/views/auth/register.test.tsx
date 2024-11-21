import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import { authService } from "@/services/auth/method";
import RegisterView from "@/components/views/auth/Register";
import { useRouter } from "next/navigation";

// Mocking authService and next-auth signIn
jest.mock("@/services/auth/method", () => ({
  authService: {
    registerAccount: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

describe("RegisterView", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it("renders the RegisterView component", () => {
    render(<RegisterView />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nama lengkap/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /daftar/i })).toBeInTheDocument();
  });

  it("shows error messages when form is submitted empty", async () => {
    render(<RegisterView />);

    fireEvent.click(screen.getByRole("button", { name: /daftar/i }));

    await waitFor(() => {
      expect(screen.getByText(/email tidak boleh kosong/i)).toBeInTheDocument();
      expect(
        screen.getByText(/password tidak boleh kosong/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/nama lengkap tidak boleh kosong/i)
      ).toBeInTheDocument();
    });
  });

  it("submits the form successfully with valid data", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });
    (authService.registerAccount as jest.Mock).mockResolvedValueOnce({
      status: 201,
    });

    render(<RegisterView />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getByLabelText(/nama lengkap/i), {
      target: { value: "John Doe" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /daftar/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@example.com",
        password: "password123",
        callbackUrl: "/",
      });
    });
  });

  it("shows an error message when registration fails", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: false });
    (authService.registerAccount as jest.Mock).mockResolvedValueOnce({
      status: 400,
    });

    render(<RegisterView />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getByLabelText(/nama lengkap/i), {
      target: { value: "John Doe" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /daftar/i }));

    await waitFor(() => {
      expect(signIn).not.toHaveBeenCalled();
    });
  });

  it("toggles the password visibility", () => {
    render(<RegisterView />);

    const passwordInput = screen.getByLabelText(/password/i);
    const showPasswordButton = screen.getByLabelText(/toggle visibility/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(showPasswordButton, () => {
      expect(passwordInput).toHaveAttribute("type", "text");
    });

    fireEvent.click(showPasswordButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
