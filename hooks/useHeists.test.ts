import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useHeists } from "./useHeists";

vi.mock("firebase/firestore", () => ({
  getDocs: vi.fn(),
  collection: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({ db: {} }));

import { getDocs } from "firebase/firestore";

function makeMockDoc(overrides = {}) {
  return {
    id: "heist-1",
    data: () => ({
      title: "Bank Job",
      description: "Rob the vault",
      createdBy: "user-123",
      createdAt: { toDate: () => new Date("2026-04-01T10:00:00Z") },
      expiresAt: { toDate: () => new Date("2026-04-10T10:00:00Z") },
      ...overrides,
    }),
  };
}

describe("useHeists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns loading: true before fetch resolves", () => {
    vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as any);
    const { result } = renderHook(() => useHeists());
    expect(result.current.loading).toBe(true);
  });

  it("returns loading: false after fetch resolves", async () => {
    vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as any);
    const { result } = renderHook(() => useHeists());
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("returns fetched heists as an array of Heist objects", async () => {
    vi.mocked(getDocs).mockResolvedValueOnce({ docs: [makeMockDoc()] } as any);
    const { result } = renderHook(() => useHeists());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.heists).toHaveLength(1);
    expect(result.current.heists[0].title).toBe("Bank Job");
    expect(result.current.heists[0].id).toBe("heist-1");
  });

  it("converts createdAt and expiresAt from Timestamp to Date", async () => {
    vi.mocked(getDocs).mockResolvedValueOnce({ docs: [makeMockDoc()] } as any);
    const { result } = renderHook(() => useHeists());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.heists[0].expiresAt).toBeInstanceOf(Date);
    expect(result.current.heists[0].createdAt).toBeInstanceOf(Date);
  });

  it("returns error: 'Failed to load heists' when fetch throws", async () => {
    vi.mocked(getDocs).mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => useHeists());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Failed to load heists");
    expect(result.current.heists).toHaveLength(0);
  });

  it("returns empty array and no error when collection is empty", async () => {
    vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as any);
    const { result } = renderHook(() => useHeists());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.heists).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });
});
