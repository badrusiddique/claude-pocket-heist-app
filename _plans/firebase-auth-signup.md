# Plan: Firebase Auth Signup Integration

## Context

The signup form currently has a stub `handleSubmit` that only calls `console.log`. This plan wires it up to Firebase Auth (`createUserWithEmailAndPassword`), derives a display name from the email, sets it on the Firebase user profile, creates a Firestore user document, and redirects to `/heists` on success. Firestore is not yet initialized — that needs to be added as a prerequisite.

---

## Files to Create

| File | Purpose |
|---|---|
| `lib/utils.ts` | Pure `extractDisplayName(email)` utility |
| `tests/lib/utils.test.ts` | Unit tests for extractDisplayName |

## Files to Modify

| File | Change |
|---|---|
| `lib/firebase.ts` | Add `getFirestore` import + export `db` |
| `components/AuthForm/AuthForm.tsx` | Wire up signup: Firebase Auth, Firestore write, redirect, loading/error state |
| `components/AuthForm/AuthForm.module.css` | Add `.errorMessage` style |
| `tests/components/AuthForm.test.tsx` | Add 4 mock blocks, replace console.log test, add 8 new tests |

---

## Implementation Steps

### 1. Extend `lib/firebase.ts`

Add to existing file:
- Import `getFirestore` from `firebase/firestore`
- Export `db = getFirestore(app)` (reuses the already-guarded `app` singleton)

### 2. Create `lib/utils.ts`

Export one pure function: `extractDisplayName(email: string): string`

**Logic:**
- Extract prefix (before `@`)
- If prefix has `.` or `_`: take first char of each segment — first char uppercase, second char lowercase → `"Js"` from `"john.smith"`
- If no separator: take first 2 chars, first letter uppercase → `"Js"` from `"jsmith"`
- If only 1 char: return that char uppercase → `"J"` from `"j"`
- If second segment is empty (e.g., `"john."`): fall back to no-separator logic on full prefix

### 3. Create `tests/lib/utils.test.ts`

Pure unit tests (no React, no mocks):
- `"john.smith@..."` → `"Js"` (dot-separated)
- `"john_smith@..."` → `"Js"` (underscore-separated)
- `"jsmith@..."` → `"Js"` (no separator, 2 chars)
- `"j@..."` → `"J"` (single char)
- `"JOHN@..."` → `"Jo"` (uppercase input)
- `"john.@..."` → `"Jo"` (trailing dot fallback)

### 4. Modify `components/AuthForm/AuthForm.tsx`

**New imports:**
```
useRouter from "next/navigation"
createUserWithEmailAndPassword, updateProfile from "firebase/auth"
doc, setDoc from "firebase/firestore"
auth, db from "@/lib/firebase"
extractDisplayName from "@/lib/utils"
```

**New state:** `loading: boolean`, `error: string | null`

**New hook:** `const router = useRouter()`

**Replace `handleSubmit` stub:**
- Guard: if `mode !== "signup"` return early (login not in scope)
- `setLoading(true)`, `setError(null)`
- `createUserWithEmailAndPassword(auth, email, password)`
- `extractDisplayName(email)` → displayName
- `await updateProfile(firebaseUser, { displayName })`
- Inner try/catch: `await setDoc(doc(db, "users", uid), { uid, email, displayName })` — if fails, log error but continue
- `router.push("/heists")`
- On outer error: `setError(message)`
- `finally`: `setLoading(false)`

**Submit button:** `disabled={loading}`, label changes to `"Signing up..."` during load

**Error display:** `{error && <p role="alert" className={styles.errorMessage}>{error}</p>}`

### 5. Add `.errorMessage` to `AuthForm.module.css`

```css
.errorMessage {
  color: var(--color-error);
  @apply text-sm text-center;
}
```

### 6. Update `tests/components/AuthForm.test.tsx`

**Add 4 mock blocks at top of file:**
```
vi.mock("@/lib/firebase", () => ({ auth: {}, db: {} }))
vi.mock("firebase/auth", () => ({ createUserWithEmailAndPassword: vi.fn(), updateProfile: vi.fn() }))
vi.mock("firebase/firestore", () => ({ doc: vi.fn(), setDoc: vi.fn() }))
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }))
```

**Replace** `"logs form data to console on submit"` test with:
- `"calls createUserWithEmailAndPassword with correct credentials"`
- `"disables submit button while loading"`

**Add 6 more new tests:**
- `"calls updateProfile with derived displayName"` (e.g. "john.smith@..." → "Js")
- `"creates Firestore user document with correct fields"`
- `"redirects to /heists on successful signup"`
- `"displays error message when signup fails"`
- `"redirects even if Firestore write fails"` (Firestore failure is non-blocking)
- `"does not call createUserWithEmailAndPassword in login mode"`

---

## Key Decisions

- **`extractDisplayName` in `lib/utils.ts`** — pure function, independently testable, reusable
- **`db` exported from `lib/firebase.ts`** — single source of Firebase singletons, easy to mock
- **Firestore failure is non-blocking** — user is signed in via `onAuthStateChanged`, redirect proceeds
- **`updateProfile` is awaited before Firestore write** — prevents race with `onAuthStateChanged` firing before displayName is set
- **Login path returns early** — login Firebase wiring is out of scope for this spec

---

## Implementation Order

```
1. lib/firebase.ts      ← no dependencies
2. lib/utils.ts         ← no dependencies
3. tests/lib/utils.test.ts
4. AuthForm.tsx         ← depends on 1 + 2
5. AuthForm.module.css
6. AuthForm.test.tsx    ← depends on 4
```

---

## Verification

1. `npm test -- --run` — all tests pass (22 existing + new utils + new AuthForm tests)
2. `npm run lint` — no TypeScript or ESLint errors
3. `npm run dev` — signup form creates a user in Firebase Console + Firestore `users` collection
