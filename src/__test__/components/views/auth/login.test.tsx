import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginView from "@/components/views/auth/Login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mocking external dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn().mockReturnValue("/dashboard"), // Mock callbackUrl
  })),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

describe("LoginView Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    render(<LoginView />);

    // Check if form elements are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /masuk/i })).toBeInTheDocument();
    expect(screen.getByText(/lupa password\?/i)).toBeInTheDocument();
  });

  it("shows error messages when form is submitted empty", async () => {
    render(<LoginView />);

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/email tidak boleh kosong/i)).toBeInTheDocument();
      expect(
        screen.getByText(/password tidak boleh kosong/i)
      ).toBeInTheDocument();
    });
  });

  it("submits the form successfully with valid data", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<LoginView />);

    // Fill out the form
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /masuk/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@example.com",
        password: "password123",
        callbackUrl: "/dashboard",
      });
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error message when login fails", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: false });

    render(<LoginView />);

    // Fill out the form
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/email dan password salah/i)).toBeInTheDocument();
    });
  });

  it("toggles the password visibility", () => {
    render(<LoginView />);

    const passwordInput = screen.getByLabelText(/password/i);
    const showPasswordButton = screen.getByLabelText(/toggle visibility/i);

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute("type", "password");

    // Toggle to show password
    fireEvent.click(showPasswordButton, () => {
      expect(passwordInput).toHaveAttribute("type", "text");
    });

    // Toggle back to hide password
    fireEvent.click(showPasswordButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
