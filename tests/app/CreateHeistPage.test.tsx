import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CreateHeistPage from "@/app/(dashboard)/heists/create/page";

// Mock Firebase
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  Timestamp: {
    fromDate: vi.fn((d: Date) => ({
      toDate: () => d,
      seconds: Math.floor(d.getTime() / 1000),
    })),
  },
}));

vi.mock("@/lib/firebase", () => ({ db: {} }));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock AuthContext
vi.mock("@/context/AuthContext", () => ({
  useUser: () => ({ user: { uid: "user-123" }, loading: false }),
}));

import { addDoc } from "firebase/firestore";

describe("CreateHeistPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a title input", () => {
    render(<CreateHeistPage />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it("renders a description input", () => {
    render(<CreateHeistPage />);
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("renders an expiry date input", () => {
    render(<CreateHeistPage />);
    expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
  });

  it("shows error when submitted without expiresAt", async () => {
    render(<CreateHeistPage />);
    await userEvent.type(screen.getByLabelText(/title/i), "Bank Job");
    await userEvent.click(
      screen.getByRole("button", { name: /create heist/i }),
    );
    expect(
      await screen.findByText("Expiry date is required"),
    ).toBeInTheDocument();
    expect(addDoc).not.toHaveBeenCalled();
  });

  it("shows error when expiresAt is in the past", async () => {
    render(<CreateHeistPage />);
    await userEvent.type(screen.getByLabelText(/title/i), "Bank Job");
    fireEvent.change(screen.getByLabelText(/expiry date/i), {
      target: { value: "2020-01-01T10:00" },
    });
    await userEvent.click(
      screen.getByRole("button", { name: /create heist/i }),
    );
    expect(
      await screen.findByText("Expiry must be in the future"),
    ).toBeInTheDocument();
    expect(addDoc).not.toHaveBeenCalled();
  });

  it("calls addDoc with Timestamp when form is valid", async () => {
    vi.mocked(addDoc).mockResolvedValueOnce({ id: "new-heist" } as any);
    const futureDate = new Date(Date.now() + 3600 * 1000);
    const futureDateLocal = futureDate.toISOString().slice(0, 16);

    render(<CreateHeistPage />);
    await userEvent.type(screen.getByLabelText(/title/i), "Bank Job");
    await userEvent.type(
      screen.getByLabelText(/description/i),
      "Rob the vault",
    );
    fireEvent.change(screen.getByLabelText(/expiry date/i), {
      target: { value: futureDateLocal },
    });
    await userEvent.click(
      screen.getByRole("button", { name: /create heist/i }),
    );

    await waitFor(() => expect(addDoc).toHaveBeenCalledOnce());
    const callArg = vi.mocked(addDoc).mock.calls[0][1];
    expect(callArg).toMatchObject({
      title: "Bank Job",
      description: "Rob the vault",
      createdBy: "user-123",
    });
    expect(callArg.expiresAt).toBeDefined();
    expect(callArg.createdAt).toBeDefined();
  });

  it("redirects to /heists after successful submission", async () => {
    vi.mocked(addDoc).mockResolvedValueOnce({ id: "new-heist" } as any);
    const futureDate = new Date(Date.now() + 3600 * 1000);
    const futureDateLocal = futureDate.toISOString().slice(0, 16);

    render(<CreateHeistPage />);
    await userEvent.type(screen.getByLabelText(/title/i), "Bank Job");
    fireEvent.change(screen.getByLabelText(/expiry date/i), {
      target: { value: futureDateLocal },
    });
    await userEvent.click(
      screen.getByRole("button", { name: /create heist/i }),
    );

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/heists"));
  });
});
