import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AuthProvider, useUser } from "@/context/AuthContext";

// Mock firebase/auth
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
}));

// Mock @/lib/firebase to prevent real Firebase app initialization
vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

function TestConsumer() {
  const { user, loading } = useUser();
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user</div>;
  return <div>User: {user.email}</div>;
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns loading: true before onAuthStateChanged fires", async () => {
    const { onAuthStateChanged } = await import("firebase/auth");
    vi.mocked(onAuthStateChanged).mockImplementation(() => vi.fn());

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("returns user: null when not authenticated", async () => {
    const { onAuthStateChanged } = await import("firebase/auth");
    vi.mocked(onAuthStateChanged).mockImplementation((_, callback) => {
      callback(null);
      return vi.fn(); // unsubscribe stub
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByText("No user")).toBeInTheDocument();
  });

  it("returns user object when authenticated", async () => {
    const { onAuthStateChanged } = await import("firebase/auth");
    const mockFirebaseUser = {
      uid: "abc123",
      email: "test@example.com",
      displayName: "Test User",
    };
    vi.mocked(onAuthStateChanged).mockImplementation((_, callback) => {
      callback(mockFirebaseUser as unknown);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByText("User: test@example.com")).toBeInTheDocument();
  });

  it("multiple consumers receive the same auth state", async () => {
    const { onAuthStateChanged } = await import("firebase/auth");
    const mockFirebaseUser = {
      uid: "abc123",
      email: "test@example.com",
      displayName: "Test User",
    };
    vi.mocked(onAuthStateChanged).mockImplementation((_, callback) => {
      callback(mockFirebaseUser as unknown);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestConsumer />
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getAllByText("User: test@example.com")).toHaveLength(2);
  });

  it("auth state change triggers re-render in all consuming components", async () => {
    const { onAuthStateChanged } = await import("firebase/auth");
    let triggerChange: (user: unknown) => void = () => {};

    vi.mocked(onAuthStateChanged).mockImplementation((_, callback) => {
      triggerChange = callback;
      callback(null); // initial: logged out
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByText("No user")).toBeInTheDocument();

    await act(async () => {
      triggerChange({
        uid: "abc123",
        email: "test@example.com",
        displayName: "Test User",
      });
    });

    expect(screen.getByText("User: test@example.com")).toBeInTheDocument();
  });

  it("unsubscribes from onAuthStateChanged on unmount", async () => {
    const { onAuthStateChanged } = await import("firebase/auth");
    const unsubscribe = vi.fn();

    vi.mocked(onAuthStateChanged).mockImplementation((_, callback) => {
      callback(null);
      return unsubscribe;
    });

    const { unmount } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    unmount();

    expect(unsubscribe).toHaveBeenCalledOnce();
  });
});
