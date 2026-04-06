import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useHeist } from "@/hooks/useHeist";

vi.mock("firebase/firestore", () => ({
  getDoc: vi.fn(),
  doc: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({ db: {} }));

import { getDoc } from "firebase/firestore";

function makeMockSnap(exists: boolean) {
  return {
    exists: () => exists,
    id: "heist-1",
    data: () =>
      exists
        ? {
            title: "Bank Job",
            description: "Rob the vault",
            createdBy: "user-123",
            createdAt: { toDate: () => new Date("2026-04-01T10:00:00Z") },
            expiresAt: { toDate: () => new Date("2026-04-10T10:00:00Z") },
          }
        : undefined,
  };
}

describe("useHeist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns loading: true before fetch resolves", () => {
    vi.mocked(getDoc).mockResolvedValueOnce(makeMockSnap(true) as any);
    const { result } = renderHook(() => useHeist("heist-1"));
    expect(result.current.loading).toBe(true);
  });

  it("returns loading: false after fetch resolves", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(makeMockSnap(true) as any);
    const { result } = renderHook(() => useHeist("heist-1"));
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("returns the heist when the document exists", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(makeMockSnap(true) as any);
    const { result } = renderHook(() => useHeist("heist-1"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.heist?.title).toBe("Bank Job");
    expect(result.current.heist?.id).toBe("heist-1");
  });

  it("converts expiresAt and createdAt from Timestamp to Date", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(makeMockSnap(true) as any);
    const { result } = renderHook(() => useHeist("heist-1"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.heist?.expiresAt).toBeInstanceOf(Date);
    expect(result.current.heist?.createdAt).toBeInstanceOf(Date);
  });

  it("returns error: 'Heist not found' when document does not exist", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(makeMockSnap(false) as any);
    const { result } = renderHook(() => useHeist("heist-1"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Heist not found");
    expect(result.current.heist).toBeNull();
  });

  it("returns error: 'Failed to load heist' when fetch throws", async () => {
    vi.mocked(getDoc).mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => useHeist("heist-1"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Failed to load heist");
  });
});
