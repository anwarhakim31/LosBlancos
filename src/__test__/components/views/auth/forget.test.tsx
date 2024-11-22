import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { authService } from "@/services/auth/method";

import ForgotView from "@/components/views/auth/ForgotPassword";

jest.mock("@/services/auth/method", () => ({
  authService: {
    forgotPassword: jest.fn(),
  },
}));

describe("ForgotView", () => {
  test("renders form with email input and button", () => {
    render(<ForgotView setSuccess={jest.fn()} />);

    // Pastikan input email dan tombol kirim ada
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /kirim/i })).toBeInTheDocument();
  });

  test("shows error when invalid email is provided", async () => {
    render(<ForgotView setSuccess={jest.fn()} />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /kirim/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/pastikan alamat email anda benar/i)
      ).toBeInTheDocument();
    });
  });

  test("handles successful forgot password request", async () => {
    (authService.forgotPassword as jest.Mock).mockResolvedValueOnce({
      status: 200,
    });

    const setSuccessMock = jest.fn();
    render(<ForgotView setSuccess={setSuccessMock} />);

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /kirim/i }));

    await waitFor(() => {
      expect(setSuccessMock).toHaveBeenCalledWith(true);
    });
  });
});
