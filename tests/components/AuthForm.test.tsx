import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import AuthForm from "@/components/AuthForm";

describe("AuthForm", () => {
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

  it("logs form data to console on submit", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<AuthForm mode="login" />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(consoleSpy).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "secret123",
    });
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
});
