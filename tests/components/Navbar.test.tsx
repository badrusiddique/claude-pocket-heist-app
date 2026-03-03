import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/AuthContext";

const mockPush = vi.fn();

vi.mock("@/context/AuthContext", () => ({ useUser: vi.fn() }));
vi.mock("@/lib/firebase", () => ({ auth: {} }));
vi.mock("firebase/auth", () => ({ signOut: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("Navbar", () => {
  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false });
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the main heading", () => {
    render(<Navbar />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders the Create Heist link", () => {
    render(<Navbar />);

    const createLink = screen.getByRole("link", { name: /create heist/i });
    expect(createLink).toBeInTheDocument();
    expect(createLink).toHaveAttribute("href", "/heists/create");
  });

  it("hides logout button when user is not authenticated", () => {
    render(<Navbar />);

    const logoutButton = screen.queryByRole("button", { name: /logout/i });
    expect(logoutButton).not.toBeInTheDocument();
  });

  it("shows logout button when user is authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "u1", email: "test@example.com", name: "Ts" },
      loading: false,
    });

    render(<Navbar />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it("calls signOut when logout button is clicked", async () => {
    const { signOut } = await import("firebase/auth");

    vi.mocked(signOut).mockResolvedValue(undefined);
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "u1", email: "test@example.com", name: "Ts" },
      loading: false,
    });

    const user = userEvent.setup();
    render(<Navbar />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  it("redirects to /login after successful logout", async () => {
    const { signOut } = await import("firebase/auth");

    vi.mocked(signOut).mockResolvedValue(undefined);
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "u1", email: "test@example.com", name: "Ts" },
      loading: false,
    });

    const user = userEvent.setup();
    render(<Navbar />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("disables logout button while logging out", async () => {
    const { signOut } = await import("firebase/auth");

    vi.mocked(signOut).mockImplementation(
      () => new Promise(() => {}), // never resolves
    );
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "u1", email: "test@example.com", name: "Ts" },
      loading: false,
    });

    const user = userEvent.setup();
    render(<Navbar />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /logging out/i }),
      ).toBeDisabled();
    });
  });
});
