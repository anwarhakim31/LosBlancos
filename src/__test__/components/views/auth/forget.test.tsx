import ForgotView from "@/components/views/auth/ForgotPassword";
import { useRouter } from "next/navigation";
import { render, screen } from "@testing-library/react";

jest.mock("@/services/auth/method", () => ({
  authService: {
    forgetPassword: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ForgotView", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it("renders the ForgotView component", () => {
    render(<ForgotView setSuccess={() => {}} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /kirim/i })).toBeInTheDocument();
  });
});
