import LoginPage from "@/app/(auth)/login/page";
import { render } from "@testing-library/react";

jest.mock("next/navigation", () => {
  return {
    useRouter: jest.fn(),
    useSearchParams: jest.fn(() => ({
      get: jest.fn().mockReturnValue("/dashboard"),
    })),
    usePathname: jest.fn(),
  };
});

describe("Login Page", () => {
  it("should render the login page", () => {
    render(<LoginPage />);

    expect(true).toBe(true);
  });
});
