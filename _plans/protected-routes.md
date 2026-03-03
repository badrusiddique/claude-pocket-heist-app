# Plan: Protected Routes

## Context

The dashboard routes (`/heists`, `/heists/create`, `/heists/[id]`) are currently unprotected — any unauthenticated user can access them directly. The splash page at `/` has a comment stating it should redirect based on auth state but currently renders static content. This plan adds client-side route protection using the existing `useUser()` hook from `AuthContext`. No middleware is used; protection is handled via a dedicated `RouteGuard` component inserted into the dashboard layout.

---

## Files to Create

| File | Purpose |
|---|---|
| `components/RouteGuard/RouteGuard.tsx` | Client component that checks auth state, shows loading, redirects or renders children |
| `components/RouteGuard/index.ts` | Barrel export |
| `tests/components/RouteGuard.test.tsx` | Unit tests for all RouteGuard states |
| `tests/app/HomePage.test.tsx` | Tests for splash page auth redirect |

## Files to Modify

| File | Change |
|---|---|
| `app/(dashboard)/layout.tsx` | Wrap children with `<RouteGuard>` |
| `app/(public)/page.tsx` | Convert to client component, add auth redirect logic |

---

## Implementation Steps

### 1. Create `components/RouteGuard/RouteGuard.tsx`

**Directive:** `"use client"`

**Imports:** `useEffect` from `react`, `useRouter` from `next/navigation`, `useUser` from `@/context/AuthContext`

**Logic:**
- Call `const { user, loading } = useUser()` and `const router = useRouter()`
- `useEffect` with deps `[user, loading, router]`:
  - If `!loading && !user`: call `router.replace("/login")`
- Render logic:
  - `loading === true` → return a loading indicator (e.g., `<div>Loading...</div>`)
  - `!user` → return `null` (redirect is in progress, don't flash content)
  - Otherwise → return `<>{children}</>`

**Props:** `{ children: React.ReactNode }`

### 2. Create `components/RouteGuard/index.ts`

Standard barrel: `export { default } from "./RouteGuard"`

### 3. Modify `app/(dashboard)/layout.tsx`

- Add `import RouteGuard from "@/components/RouteGuard"`
- Wrap the existing JSX children with `<RouteGuard>`:
  ```
  <RouteGuard>
    <Navbar />
    <main>{children}</main>
  </RouteGuard>
  ```
- Layout itself stays as a server component — `RouteGuard` carries the `"use client"` boundary

### 4. Modify `app/(public)/page.tsx`

- Add `"use client"` directive
- Import `useEffect` from `react`, `useRouter` from `next/navigation`, `useUser` from `@/context/AuthContext`
- Add hooks: `const { user, loading } = useUser()` and `const router = useRouter()`
- `useEffect` with deps `[user, loading, router]`:
  - If `!loading && user`: call `router.replace("/heists")`
  - If `!loading && !user`: call `router.replace("/login")`
- While loading: render the existing static content (briefly visible while auth resolves)

### 5. Create `tests/components/RouteGuard.test.tsx`

**Mock blocks:**
```ts
vi.mock("@/context/AuthContext", () => ({ useUser: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));
```

**`beforeEach`:** `vi.mocked(useUser).mockReturnValue({ user: null, loading: true })`

**Tests (5):**
- `"shows loading indicator while auth state is loading"` — `{ loading: true }`, expect loading element
- `"renders children when user is authenticated"` — `{ user: mockUser, loading: false }`, expect children visible
- `"redirects to /login when user is not authenticated"` — `{ user: null, loading: false }`, expect `mockReplace("/login")` called
- `"does not render children when user is unauthenticated"` — `{ user: null, loading: false }`, expect children not in DOM
- `"does not redirect while auth state is loading"` — `{ loading: true }`, expect `mockReplace` not called

### 6. Create `tests/app/HomePage.test.tsx`

**Mock blocks:**
```ts
vi.mock("@/context/AuthContext", () => ({ useUser: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));
```

**Tests (3):**
- `"redirects to /heists when user is authenticated"` — `{ user: mockUser, loading: false }`, expect `mockReplace("/heists")`
- `"redirects to /login when user is not authenticated"` — `{ user: null, loading: false }`, expect `mockReplace("/login")`
- `"does not redirect while auth state is loading"` — `{ loading: true }`, expect `mockReplace` not called

---

## Key Decisions

- **`RouteGuard` component over middleware** — keeps protection client-side, consistent with existing `useUser()` hook pattern; no new infrastructure required
- **Server component layout stays as server component** — `RouteGuard` introduces the `"use client"` boundary; Navbar and page content stay server-renderable
- **`router.replace` not `router.push`** — prevents back-button navigation returning to protected content after redirect
- **`null` rendered while redirecting** — prevents content flash; the redirect fires immediately in `useEffect` after auth resolves
- **Splash page uses same `useEffect` + `replace` pattern** — consistent with RouteGuard approach

---

## Implementation Order

```
1. RouteGuard.tsx + index.ts   ← no dependencies
2. (dashboard)/layout.tsx       ← depends on RouteGuard
3. (public)/page.tsx            ← standalone, uses useUser directly
4. RouteGuard.test.tsx          ← depends on RouteGuard
5. HomePage.test.tsx            ← depends on modified page.tsx
```

---

## Verification

1. `npm test -- --run` — all tests pass (47 existing + 5 RouteGuard + 3 HomePage = 55 total)
2. `npm run lint` — no TypeScript or ESLint errors in modified files
3. `npm run dev` — visiting `/heists` while logged out redirects to `/login`; splash page redirects based on auth state
