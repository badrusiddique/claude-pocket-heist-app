import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RouteGuard from "@/components/RouteGuard";
import { useUser } from "@/context/AuthContext";

const mockReplace = vi.fn();

vi.mock("@/context/AuthContext", () => ({ useUser: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

describe("RouteGuard", () => {
  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true });
    mockReplace.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading indicator while auth state is loading", () => {
    render(
      <RouteGuard>
        <div>Protected content</div>
      </RouteGuard>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("renders children when user is authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "u1", email: "test@example.com", name: "Ts" },
      loading: false,
    });

    render(
      <RouteGuard>
        <div>Protected content</div>
      </RouteGuard>,
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("redirects to /login when user is not authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <RouteGuard>
        <div>Protected content</div>
      </RouteGuard>,
    );

    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("does not render children when user is unauthenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <RouteGuard>
        <div>Protected content</div>
      </RouteGuard>,
    );

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("does not redirect while auth state is loading", () => {
    vi.mocked(useUser).mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <RouteGuard>
        <div>Protected content</div>
      </RouteGuard>,
    );

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
