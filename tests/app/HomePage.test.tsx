import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Home from "@/app/(public)/page";
import { useUser } from "@/context/AuthContext";

const mockReplace = vi.fn();

vi.mock("@/context/AuthContext", () => ({ useUser: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

describe("Home Page", () => {
  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true });
    mockReplace.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redirects to /heists when user is authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "u1", email: "test@example.com", name: "Ts" },
      loading: false,
    });

    render(<Home />);

    expect(mockReplace).toHaveBeenCalledWith("/heists");
  });

  it("redirects to /login when user is not authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: null,
      loading: false,
    });

    render(<Home />);

    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("does not redirect while auth state is loading", () => {
    vi.mocked(useUser).mockReturnValue({
      user: null,
      loading: true,
    });

    render(<Home />);

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
