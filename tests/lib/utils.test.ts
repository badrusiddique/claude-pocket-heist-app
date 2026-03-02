import { describe, it, expect } from "vitest";
import { extractDisplayName } from "@/lib/utils";

describe("extractDisplayName", () => {
  it("handles dot-separated email prefix", () => {
    expect(extractDisplayName("john.smith@example.com")).toBe("Js");
    expect(extractDisplayName("alice.bob@example.com")).toBe("Ab");
  });

  it("handles uppercase dot-separated prefix", () => {
    expect(extractDisplayName("ALICE.bob@example.com")).toBe("Ab");
  });

  it("handles underscore-separated email prefix", () => {
    expect(extractDisplayName("john_smith@example.com")).toBe("Js");
  });

  it("handles no-separator prefix with first 2 chars", () => {
    expect(extractDisplayName("jsmith@example.com")).toBe("Js");
    expect(extractDisplayName("alice@example.com")).toBe("Al");
  });

  it("handles single-character prefix", () => {
    expect(extractDisplayName("j@example.com")).toBe("J");
    expect(extractDisplayName("a@example.com")).toBe("A");
  });

  it("handles uppercase no-separator prefix", () => {
    expect(extractDisplayName("JOHN@example.com")).toBe("Jo");
  });

  it("handles trailing dot by falling back to no-separator logic", () => {
    expect(extractDisplayName("john.@example.com")).toBe("Jo");
  });

  it("prioritizes dot over underscore if both present", () => {
    expect(extractDisplayName("john.s_mith@example.com")).toBe("Js");
  });
});
