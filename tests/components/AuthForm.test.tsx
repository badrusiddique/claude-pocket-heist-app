import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import AuthForm from "@/components/AuthForm";

// Prevent real Firebase initialization
vi.mock("@/lib/firebase", () => ({
  auth: {},
  db: {},
}));

// Mock Firebase Auth functions
vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}));

// Mock Firebase Firestore functions
vi.mock("firebase/firestore", () => ({
  doc: vi.fn(() => ({})),
  setDoc: vi.fn(),
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("AuthForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the login heading in login mode", () => {
    render(<AuthForm mode="login" />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/log in/i);
  });

  it("renders the signup heading in signup mode", () => {
    render(<AuthForm mode="signup" />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/sign up/i);
  });

  it("renders the correct submit button label per mode", () => {
    const { unmount } = render(<AuthForm mode="login" />);
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    unmount();

    render(<AuthForm mode="signup" />);
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("accepts typed input in email and password fields", async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "secret123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("secret123");
  });

  it("renders navigation links to the other auth page", () => {
    const { unmount } = render(<AuthForm mode="login" />);
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/signup",
    );
    unmount();

    render(<AuthForm mode="signup" />);
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  describe("Signup flow", () => {
    it("calls createUserWithEmailAndPassword with correct credentials on signup submit", async () => {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const { updateProfile } = await import("firebase/auth");
      const { setDoc } = await import("firebase/firestore");

      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
        user: { uid: "u1", email: "test@example.com" },
      } as unknown);
      vi.mocked(updateProfile).mockResolvedValue(undefined);
      vi.mocked(setDoc).mockResolvedValue(undefined);

      const user = userEvent.setup();
      render(<AuthForm mode="signup" />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "secret123");
      await user.click(screen.getByRole("button", { name: /sign up/i }));

      await waitFor(() => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          expect.any(Object),
          "test@example.com",
          "secret123",
        );
      });
    });

    it("disables submit button while loading", async () => {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");

      vi.mocked(createUserWithEmailAndPassword).mockImplementation(
        () => new Promise(() => {}), // never resolves
      );

      const user = userEvent.setup();
      render(<AuthForm mode="signup" />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "secret123");
      await user.click(screen.getByRole("button", { name: /sign up/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /signing up/i }),
        ).toBeDisabled();
      });
    });

    it("calls updateProfile with derived displayName", async () => {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const { updateProfile } = await import("firebase/auth");
      const { setDoc } = await import("firebase/firestore");

      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
        user: { uid: "u1", email: "john.smith@example.com" },
      } as unknown);
      vi.mocked(updateProfile).mockResolvedValue(undefined);
      vi.mocked(setDoc).mockResolvedValue(undefined);

      const user = userEvent.setup();
      render(<AuthForm mode="signup" />);

      await user.type(
        screen.getByLabelText(/email/i),
        "john.smith@example.com",
      );
      await user.type(screen.getByLabelText("Password"), "secret123");
      await user.click(screen.getByRole("button", { name: /sign up/i }));

      await waitFor(() => {
        expect(updateProfile).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({ displayName: "Js" }),
        );
      });
    });

    it("creates Firestore user document with correct fields", async () => {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const { updateProfile } = await import("firebase/auth");
      const { setDoc } = await import("firebase/firestore");

      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
        user: { uid: "u1", email: "test@example.com" },
      } as unknown);
      vi.mocked(updateProfile).mockResolvedValue(undefined);
      vi.mocked(setDoc).mockResolvedValue(undefined);

      const user = userEvent.setup();
      render(<AuthForm mode="signup" />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "secret123");
      await user.click(screen.getByRole("button", { name: /sign up/i }));

      await waitFor(() => {
        expect(setDoc).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({
            uid: "u1",
            email: "test@example.com",
            displayName: expect.any(String),
          }),
        );
      });
    });

    it("redirects to /heists on successful signup", async () => {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const { updateProfile } = await import("firebase/auth");
      const { setDoc } = await import("firebase/firestore");

      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
        user: { uid: "u1", email: "test@example.com" },
      } as unknown);
      vi.mocked(updateProfile).mockResolvedValue(undefined);
      vi.mocked(setDoc).mockResolvedValue(undefined);

      const user = userEvent.setup();
      render(<AuthForm mode="signup" />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "secret123");
      await user.click(screen.getByRole("button", { name: /sign up/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/heists");
      });
    });

    it("displays error message when signup fails", async () => {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");

      const errorMessage = "Email already in use";
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(
        new Error(errorMessage),
      );

      const user = userEvent.setup();
      render(<AuthForm mode="signup" />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "secret123");
      await user.click(screen.getByRole("button", { name: /sign up/i }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(errorMessage);
      });
    });

    it("redirects even if Firestore write fails", async () => {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const { updateProfile } = await import("firebase/auth");
      const { setDoc } = await import("firebase/firestore");

      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
        user: { uid: "u1", email: "test@example.com" },
      } as unknown);
      vi.mocked(updateProfile).mockResolvedValue(undefined);
      vi.mocked(setDoc).mockRejectedValue(new Error("Firestore error"));

      const user = userEvent.setup();
      render(<AuthForm mode="signup" />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "secret123");
      await user.click(screen.getByRole("button", { name: /sign up/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/heists");
      });
    });

    it("does not call createUserWithEmailAndPassword in login mode", async () => {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");

      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "secret123");
      await user.click(screen.getByRole("button", { name: /login/i }));

      expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    });
  });
});
