# Plan: User Auth State Hook (`useUser`)

## Context

The app has Firebase configured at the project level (email/password auth enabled, Firestore rules set), but the Firebase client SDK is not installed and there is no auth state management in the React app. This plan wires up a realtime Firebase Auth listener and exposes the current user globally via a `useUser` hook — returning `{ user, loading }` from any component. No sign-in/sign-out flow is in scope.

---

## New Files

| File | Purpose |
|---|---|
| `lib/firebase.ts` | Firebase app singleton init, exports `auth` instance |
| `lib/types.ts` | `User` and `UserContextValue` TypeScript interfaces |
| `context/AuthContext.tsx` | `AuthProvider` (client component) + `useUser` hook |
| `tests/context/AuthContext.test.tsx` | Tests for auth context and hook |
| `.env.local` | Local env vars (not committed) |
| `.env.local.example` | Documented env var keys (safe to commit) |

## Modified Files

| File | Change |
|---|---|
| `app/layout.tsx` | Wrap `{children}` in `<AuthProvider>` |
| `package.json` | `firebase` added via `npm install firebase` |

---

## Implementation Steps

### 1. Install Firebase SDK
```
npm install firebase
```

### 2. Create `.env.local` and `.env.local.example`
Six `NEXT_PUBLIC_FIREBASE_*` variables (API key, auth domain, project ID, storage bucket, messaging sender ID, app ID) — sourced from Firebase Console → Project Settings → Web app SDK config.

### 3. Create `lib/types.ts`
```ts
export interface User {
  uid: string
  email: string | null
  name: string | null
}

export interface UserContextValue {
  user: User | null
  loading: boolean
}
```

### 4. Create `lib/firebase.ts`
- Import `initializeApp`, `getApps` from `firebase/app` and `getAuth` from `firebase/auth`
- Use `getApps().length === 0` guard to prevent duplicate init on hot reload
- Export `auth` instance only

### 5. Create `context/AuthContext.tsx`
- Mark `"use client"` at top
- `createContext<UserContextValue>` with default `{ user: null, loading: true }`
- `AuthProvider` component: `useState` for `user` and `loading`, `useEffect` subscribes to `onAuthStateChanged(auth, ...)`, maps Firebase user to `{ uid, email, name: displayName }`, cleanup calls `unsubscribe()`
- Export `useUser()` hook that calls `useContext(AuthContext)`

### 6. Modify `app/layout.tsx`
- Import `AuthProvider` from `@/context/AuthContext`
- Wrap `{children}` inside `<body>` with `<AuthProvider>`
- Root layout stays a server component — Next.js allows server components to render client component children

---

## Key Decisions

- **`lib/types.ts` decouples the app from Firebase's `User` type** — components use app-defined `User` shape
- **`loading: true` as initial state** — Firebase's `onAuthStateChanged` fires asynchronously; until it fires, auth state is unknown
- **Provider in root layout** — sits above both `(public)` and `(dashboard)` route groups, so all pages can use `useUser`

---

## Tests (`tests/context/AuthContext.test.tsx`)

**Mock strategy:**
```ts
vi.mock("firebase/auth", () => ({ onAuthStateChanged: vi.fn() }))
vi.mock("@/lib/firebase", () => ({ auth: {} }))
```

**Test cases:**
1. `loading: true` before `onAuthStateChanged` fires (mock never calls callback)
2. Returns `user: null` when callback fires with `null`
3. Returns user object `{ uid, email, name }` when callback fires with a Firebase user
4. Multiple consumers inside one `AuthProvider` all receive same state
5. Auth state change propagates — use `act()` to flush updates
6. `unsubscribe()` is called on unmount (no memory leak)

---

## Verification

1. Run `npm run dev` — app loads without Firebase config errors
2. Open browser DevTools → Application → Firebase → confirm `onAuthStateChanged` listener active
3. Run `npm test -- --run` — all tests pass including new `AuthContext.test.tsx`
4. Run `npm run lint` — no TypeScript or ESLint errors


DO NOT spec any signin/login/lougout flow yet, just a realtime global listener to update user status 