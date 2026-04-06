import { render, screen, act } from "@testing-library/react";
import { vi } from "vitest";
import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";

describe("CountdownTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-06T10:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("displays 'Expired' immediately when expiresAt is in the past", () => {
    const past = new Date("2026-04-06T09:00:00.000Z");
    render(<CountdownTimer expiresAt={past} />);
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });

  it("does not start a setInterval when already expired", () => {
    const setIntervalSpy = vi.spyOn(global, "setInterval");
    const past = new Date("2026-04-06T09:00:00.000Z");
    render(<CountdownTimer expiresAt={past} />);
    expect(setIntervalSpy).not.toHaveBeenCalled();
  });

  it("displays seconds only when less than 60 seconds remain", () => {
    const future = new Date("2026-04-06T10:00:45.000Z");
    render(<CountdownTimer expiresAt={future} />);
    expect(screen.getByText("45s remaining")).toBeInTheDocument();
  });

  it("displays '1s remaining' when exactly 1 second remains", () => {
    const future = new Date("2026-04-06T10:00:01.000Z");
    render(<CountdownTimer expiresAt={future} />);
    expect(screen.getByText("1s remaining")).toBeInTheDocument();
  });

  it("displays minutes only when hours and days are zero and seconds are zero", () => {
    const future = new Date("2026-04-06T10:05:00.000Z");
    render(<CountdownTimer expiresAt={future} />);
    expect(screen.getByText("5m remaining")).toBeInTheDocument();
  });

  it("omits zero units between non-zero units", () => {
    const future = new Date("2026-04-06T13:00:22.000Z");
    render(<CountdownTimer expiresAt={future} />);
    expect(screen.getByText("3h 22s remaining")).toBeInTheDocument();
  });

  it("displays all four units when all are non-zero", () => {
    const future = new Date("2026-04-08T15:34:12.000Z");
    render(<CountdownTimer expiresAt={future} />);
    expect(screen.getByText("2d 5h 34m 12s remaining")).toBeInTheDocument();
  });

  it("displays '1d remaining' when exactly 86400 seconds remain", () => {
    const future = new Date("2026-04-07T10:00:00.000Z");
    render(<CountdownTimer expiresAt={future} />);
    expect(screen.getByText("1d remaining")).toBeInTheDocument();
  });

  it("updates the display every 1000ms", () => {
    const future = new Date("2026-04-06T10:01:05.000Z");
    render(<CountdownTimer expiresAt={future} />);
    expect(screen.getByText("1m 5s remaining")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("1m 4s remaining")).toBeInTheDocument();
  });

  it("transitions to 'Expired' when countdown reaches zero", () => {
    const future = new Date("2026-04-06T10:00:02.000Z");
    render(<CountdownTimer expiresAt={future} />);
    expect(screen.getByText("2s remaining")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });

  it("calls clearInterval on unmount", () => {
    const clearIntervalSpy = vi.spyOn(global, "clearInterval");
    const future = new Date("2026-04-06T11:00:00.000Z");
    const { unmount } = render(<CountdownTimer expiresAt={future} />);
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
