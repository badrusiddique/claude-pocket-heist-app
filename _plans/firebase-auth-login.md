# Plan: Firebase Auth Login Integration

## Context

The `AuthForm` component already has a fully-built login UI (email, password, show/hide toggle, error display, loading state) and a working signup flow. The login submit handler currently bails out immediately with a `// TODO: implement login` early-return stub. This plan replaces that stub with `signInWithEmailAndPassword`, mirrors the signup error/loading lifecycle, and adds a "Login flow" test block that matches the existing "Signup flow" tests.

---

## Files to Modify

| File | Change |
|---|---|
| `components/AuthForm/AuthForm.tsx` | Add `signInWithEmailAndPassword` import, replace stub with login logic |
| `tests/components/AuthForm.test.tsx` | Add `signInWithEmailAndPassword` to firebase/auth mock, add 5 new Login flow tests |

No new files. No CSS changes. No changes to login page, AuthContext, or lib/firebase.

---

## Implementation Steps

### 1. Modify `components/AuthForm/AuthForm.tsx`

**Add to the existing `firebase/auth` import line:**
```
signInWithEmailAndPassword
```
(alongside the existing `createUserWithEmailAndPassword, updateProfile`)

**Replace the stub** (lines 27-30):
```
if (mode !== "signup") {
  // TODO: implement login
  return;
}
```

**With login branch + remaining signup guard:**
```
if (mode === "login") {
  setLoading(true);
  setError(null);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/heists");
  } catch (authError) {
    const message = authError instanceof Error ? authError.message : "Login failed";
    setError(message);
  } finally {
    setLoading(false);
  }
  return;
}
```

The `setLoading`, `setError`, `router`, and `auth` references already exist in scope — no new state or hooks needed.

---

### 2. Update `tests/components/AuthForm.test.tsx`

**Update the existing `firebase/auth` mock** (add `signInWithEmailAndPassword`):
```ts
vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),   // add this
}));
```

**Add a new `describe("Login flow", ...)` block** with 5 tests:

- `"calls signInWithEmailAndPassword with correct credentials on login submit"` — mock resolves, submit form, verify call with `(auth, email, password)`
- `"disables submit button while logging in"` — mock never resolves, verify button is disabled and shows "Logging in..."
- `"redirects to /heists on successful login"` — mock resolves, verify `mockPush("/heists")`
- `"displays error message when login fails"` — mock rejects with an error, verify `role="alert"` shows the message
- `"does not call signInWithEmailAndPassword in signup mode"` — render in signup mode, submit, verify no call

---

## Key Decisions

- **Reuses all existing infrastructure** — `loading`, `error`, `setLoading`, `setError`, `router`, `auth` are already in scope; zero new state
- **Login is simpler than signup** — no display name extraction, no `updateProfile`, no Firestore write; login is a single Firebase call + redirect
- **Guard structure** — replace the `mode !== "signup"` bail-out with an explicit `mode === "login"` branch that returns after resolving; the signup logic below runs unchanged
- **Test pattern mirrors Signup flow** — same dynamic import + `vi.mocked().mockResolvedValue` approach already established in the test file

---

## Implementation Order

```
1. AuthForm.tsx        ← add import, replace stub
2. AuthForm.test.tsx   ← update mock, add Login flow describe block
```

---

## Verification

1. `npm test -- --run` — all tests pass (42 existing + 5 new Login flow tests = 47 total)
2. `npm run lint` — no TypeScript or ESLint errors in modified files
3. `npm run dev` — login form authenticates an existing Firebase user and redirects to `/heists`
