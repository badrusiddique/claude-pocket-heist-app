# Plan: Navbar Logout Button

## Context

The Navbar is currently a pure server component with no auth awareness. This plan adds a logout button that is conditionally visible based on auth state (`useUser()` from `AuthContext`), calls Firebase's `signOut`, and redirects to `/login`. The button should match the existing "Create Heist" `.btn` styling and include a loading/disabled state during the logout operation.

---

## Files to Modify

| File | Change |
|---|---|
| `components/Navbar/Navbar.tsx` | Convert to client component, add `useUser` check, logout handler, logout button |
| `tests/components/Navbar.test.tsx` | Add 4 mock blocks, update existing tests, add 5 new tests |

No new files or CSS changes needed — the global `.btn` class covers the logout button style.

---

## Implementation Steps

### 1. Modify `components/Navbar/Navbar.tsx`

**Convert to client component:**
- Add `"use client"` directive at the top

**New imports:**
```
useState from "react"
useRouter from "next/navigation"
signOut from "firebase/auth"
auth from "@/lib/firebase"
useUser from "@/context/AuthContext"
```

**New hook calls inside component:**
```tsx
const { user } = useUser();
const router = useRouter();
const [loading, setLoading] = useState(false);
```

**New logout handler:**
```tsx
async function handleLogout() {
  setLoading(true);
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    setLoading(false);
  }
}
```

**Update JSX — add logout button inside the existing `<ul>` alongside Create Heist:**
```tsx
{user && (
  <li>
    <button className="btn" onClick={handleLogout} disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </button>
  </li>
)}
```

The button sits next to the Create Heist link in the existing `<ul>` (already flex, right side of nav).

---

### 2. Update `tests/components/Navbar.test.tsx`

**Add mock blocks at the top (before describe):**
```ts
const mockPush = vi.fn();

vi.mock("@/context/AuthContext", () => ({ useUser: vi.fn() }));
vi.mock("@/lib/firebase", () => ({ auth: {} }));
vi.mock("firebase/auth", () => ({ signOut: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));
```

**Add `beforeEach` setup** to default `useUser` to logged-out state so existing tests still pass:
```ts
beforeEach(() => {
  vi.mocked(useUser).mockReturnValue({ user: null, loading: false });
  mockPush.mockClear();
  vi.clearAllMocks();
});
```

**Existing 2 tests** — no changes needed (they render Navbar with no user, heading and Create Heist still present).

**New tests (5):**
- `"hides logout button when user is not authenticated"` — render with `user: null`, expect no logout button
- `"shows logout button when user is authenticated"` — render with `user: { uid, email, name }`, expect logout button
- `"calls signOut when logout button is clicked"` — mock `signOut` resolved, click button, verify call
- `"redirects to /login after successful logout"` — verify `mockPush("/login")` called
- `"disables logout button while logging out"` — mock `signOut` never resolves, click button, verify button is disabled with "Logging out..." text

---

## Key Decisions

- **`"use client"` on Navbar** — required for `useState`, `useRouter`, and `useUser` (which uses `useContext`)
- **`useUser()` provides auth gate** — `user !== null` determines button visibility; no prop drilling needed
- **`signOut` imported from `firebase/auth`** — consistent with existing `AuthForm.tsx` pattern; `auth` imported from `@/lib/firebase`
- **Loading state is local to Navbar** — after `signOut` succeeds, `onAuthStateChanged` in `AuthContext` fires automatically, setting `user` to null; the loading state just disables the button during the async call
- **No new CSS** — reuse global `.btn` class, matching the existing Create Heist button

---

## Implementation Order

```
1. Navbar.tsx        ← convert to client, add logout logic
2. Navbar.test.tsx   ← update mocks, add new tests
```

---

## Verification

1. `npm test -- --run` — all tests pass (37 existing + 5 new Navbar tests = 42 total)
2. `npm run lint` — no TypeScript or ESLint errors
3. `npm run dev` — logout button appears when signed in, hides when signed out, redirects to `/login`
