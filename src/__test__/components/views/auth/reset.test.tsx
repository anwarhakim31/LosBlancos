import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordView from "@/components/views/auth/ResetPassword"; // Import komponen yang ingin di-test
import { authService } from "@/services/auth/method";

// Mock `authService.resetPassword`
jest.mock("@/services/auth/method", () => ({
  authService: {
    resetPassword: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn().mockReturnValue("/dashboard"),
  })),
}));

describe("ResetPasswordView", () => {
  it("should render the form with password fields", () => {
    const { container } = render(<ResetPasswordView setSuccess={() => {}} />);

    expect(container).toBeInTheDocument();

    expect(
      container.querySelector("input[name='password']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("input[name='confirmPassword']")
    ).toBeInTheDocument();
  });

  it("should show error message when password is not provided", async () => {
    render(<ResetPasswordView setSuccess={jest.fn()} />);

    fireEvent.click(screen.getByText("Kirim"));

    expect(
      await screen.findByText("Password tidak boleh kosong")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Konfirmasi Password tidak boleh kosong")
    ).toBeInTheDocument();
  });

  it("should show error message when passwords do not match", async () => {
    render(<ResetPasswordView setSuccess={jest.fn()} />);

    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getByLabelText("Konfirmasi Password"), {
      target: { value: "differentPassword" },
    });

    fireEvent.click(screen.getByText("Kirim"));

    expect(await screen.findByText("Password tidak sama")).toBeInTheDocument();
  });

  it("should call resetPassword service when form is valid", async () => {
    render(<ResetPasswordView setSuccess={jest.fn()} />);

    (authService.resetPassword as jest.Mock).mockResolvedValueOnce({
      status: 200,
    });

    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getByLabelText("Konfirmasi Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Kirim"));

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledTimes(1);
    });
  });

  it("should set success when password reset is successful", async () => {
    const setSuccessMock = jest.fn();
    render(<ResetPasswordView setSuccess={setSuccessMock} />);

    (authService.resetPassword as jest.Mock).mockResolvedValueOnce({
      status: 200,
    });

    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getByLabelText("Konfirmasi Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Kirim"));

    await waitFor(() => {
      expect(setSuccessMock).toHaveBeenCalledWith(true);
    });
  });
});
