import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import HeistCard from "@/components/HeistCard/HeistCard";
import type { Heist } from "@/lib/types";

vi.mock("@/components/CountdownTimer/CountdownTimer", () => ({
  default: ({ expiresAt }: { expiresAt: Date }) => (
    <span data-testid="countdown-timer">{expiresAt.toISOString()}</span>
  ),
}));

function makeHeist(overrides: Partial<Heist> = {}): Heist {
  return {
    id: "heist-1",
    title: "Bank Job",
    description: "Rob the vault",
    createdBy: "user-123",
    createdAt: new Date("2026-04-01T10:00:00Z"),
    expiresAt: new Date("2026-04-10T10:00:00Z"),
    ...overrides,
  };
}

describe("HeistCard", () => {
  it("renders the heist title", () => {
    render(<HeistCard heist={makeHeist()} />);
    expect(screen.getByText("Bank Job")).toBeInTheDocument();
  });

  it("renders a CountdownTimer", () => {
    render(<HeistCard heist={makeHeist()} />);
    expect(screen.getByTestId("countdown-timer")).toBeInTheDocument();
  });

  it("passes the heist expiresAt to CountdownTimer", () => {
    const expiresAt = new Date("2026-04-15T12:00:00Z");
    render(<HeistCard heist={makeHeist({ expiresAt })} />);
    expect(screen.getByTestId("countdown-timer").textContent).toBe(
      expiresAt.toISOString(),
    );
  });

  it("renders the heist description", () => {
    render(<HeistCard heist={makeHeist()} />);
    expect(screen.getByText("Rob the vault")).toBeInTheDocument();
  });
});
