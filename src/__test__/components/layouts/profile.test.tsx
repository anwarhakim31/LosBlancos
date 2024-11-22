/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Provider } from "react-redux";
import ProfileMainLayout from "@/components/layouts/ProfileMainLayout";
import configureStore from "redux-mock-store";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/akun"),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: { user: { name: "John Doe" } },
  })),
  signOut: jest.fn(),
}));

const mockStore = configureStore([]);

describe("ProfileMainLayout", () => {
  let store: any;
  let mockRouter: any;

  beforeEach(() => {
    store = mockStore({
      cart: {
        items: [{ id: 1, name: "Product A" }],
      },
    });
    mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders user name and cart information correctly", () => {
    render(
      <Provider store={store}>
        <ProfileMainLayout>
          <div>Child Component</div>
        </ProfileMainLayout>
      </Provider>
    );

    expect(screen.getByText("Selamat Datang")).toBeInTheDocument();

    expect(screen.getByText("Pesan Sekarang")).toBeInTheDocument();
  });

  it("renders menu items and highlights the active one", () => {
    render(
      <Provider store={store}>
        <ProfileMainLayout>
          <div>Child Component</div>
        </ProfileMainLayout>
      </Provider>
    );

    const menuItems = screen.getAllByRole("button");
    expect(menuItems).toHaveLength(4);

    expect(menuItems[0]).toHaveTextContent("Akun Saya");
    expect(menuItems[0].classList.contains("active")).toBeTruthy();

    expect(menuItems[3]).toHaveTextContent("keluar");
  });

  it("navigates to the correct menu when a button is clicked", () => {
    render(
      <Provider store={store}>
        <ProfileMainLayout>
          <div>Child Component</div>
        </ProfileMainLayout>
      </Provider>
    );

    const menuItems = screen.getAllByRole("button");

    fireEvent.click(menuItems[1]);
    expect(mockRouter.push).toHaveBeenCalledWith("/alamat", { scroll: false });

    fireEvent.click(menuItems[2]);
    expect(mockRouter.push).toHaveBeenCalledWith("/pesanan", { scroll: false });
  });

  it("calls signOut when 'keluar' is clicked", () => {
    render(
      <Provider store={store}>
        <ProfileMainLayout>
          <div>Child Component</div>
        </ProfileMainLayout>
      </Provider>
    );

    const logoutButton = screen.getByText("keluar");
    fireEvent.click(logoutButton);

    expect(signOut).toHaveBeenCalledWith({
      callbackUrl: "/login",
    });
  });
});
