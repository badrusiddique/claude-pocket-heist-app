# Plan: Authentication Forms

## Context

The `/login` and `/signup` pages are currently placeholder stubs with only a heading. This plan implements a shared `AuthForm` component to replace those stubs with functional forms featuring email/password inputs, a password visibility toggle, and a submit button. Forms log to console on submit. Pages link to each other for easy switching. No backend integration yet.

---

## Files to Create

### `components/AuthForm/AuthForm.tsx`
- Add `"use client"` directive (top of file — required for `useState`)
- Props: `{ mode: "login" | "signup" }`
- State:
  - `formData: { email: string; password: string }` — controlled inputs
  - `showPassword: boolean` — toggles password field type
- Form `onSubmit`: calls `e.preventDefault()`, then `console.log(formData)`
- Shared `onChange` handler using computed property key (`[e.target.name]`)
- JSX structure:
  1. `<form>` root with `onSubmit`
  2. `<h1 className="form-title italic">` — text based on `mode`
  3. Email field group: `<label>` + `<input type="email" name="email">`
  4. Password field group: `<label>` + wrapper div + `<input>` (type toggles) + toggle `<button type="button">` with `Eye`/`EyeOff` from `lucide-react` and a dynamic `aria-label` ("Show password" / "Hide password")
  5. `<button type="submit" className="btn">` — "Login" or "Sign Up"
  6. Navigation `<p>` with a `<Link>` (from `next/link`) pointing to the other page
- Import `Eye`, `EyeOff` from `lucide-react`
- Import `Link` from `next/link`

### `components/AuthForm/AuthForm.module.css`
- First line: `@reference "../../app/globals.css";`
- `.form` — `flex flex-col`, gap for field spacing, max-width ~400px, centered
- `.fieldGroup` — `flex flex-col` with small gap for label + input
- `.label` — body text color (`var(--color-body)`), small font size
- `.input` — full width, padding, dark background (`var(--color-lighter)`), white text, rounded, border with focus color (`var(--color-primary)`)
- `.passwordWrapper` — `position: relative` to contain the input + toggle button
- `.toggleButton` — absolutely positioned right side, transparent bg, icon inherits body color; hover turns `var(--color-primary)`
- `.navLink` — centered text, body color; inner link styled with primary color + underline

### `components/AuthForm/index.ts`
- Single line: `export { default } from "./AuthForm"`

---

## Files to Modify

### `app/(public)/login/page.tsx`
- Fix exported function name: `SignupPage` → `LoginPage`
- Import `AuthForm` from `@/components/AuthForm`
- Remove the `<h1>` heading (it moves into `AuthForm`)
- Render `<AuthForm mode="login" />` inside the existing `.center-content` / `.page-content` wrapper

### `app/(public)/signup/page.tsx`
- Import `AuthForm` from `@/components/AuthForm`
- Remove the `<h2>` heading (it moves into `AuthForm`)
- Render `<AuthForm mode="signup" />` inside the existing `.center-content` / `.page-content` wrapper

---

## File to Create (Tests)

### `tests/components/AuthForm.test.tsx`
- Import: `render`, `screen` from `@testing-library/react`
- Import: `userEvent` from `@testing-library/user-event`
- Import: `vi` from `vitest` (needed for `vi.spyOn`)
- Import: `AuthForm` from `@/components/AuthForm`
- Use `userEvent.setup()` for all interaction tests

**7 test cases:**

1. **Login mode heading** — render `mode="login"`, assert `<h1>` contains `/log in/i`
2. **Signup mode heading** — render `mode="signup"`, assert `<h1>` contains `/sign up/i`
3. **Submit button label** — "Login" in login mode, "Sign Up" in signup mode
4. **Password visibility toggle** — input starts as `type="password"`, click toggle button → `type="text"`, click again → back to `type="password"` (query button by `aria-label`)
5. **Typed input** — use `userEvent.type` on email and password fields, assert `toHaveValue`
6. **Console.log on submit** — spy on `console.log`, type values, click submit, assert spy called with `{ email, password }`, restore spy in `afterEach`
7. **Navigation links** — login mode has link `/signup`; signup mode has link `/login`

---

## Patterns to Follow

- CSS Module `@reference` pattern: `components/Navbar/Navbar.module.css:1`
- Barrel export: `components/Avatar/index.ts`
- Semantic test queries: `tests/components/Navbar.test.tsx`
- Global utility classes `.btn`, `.form-title`, `.page-content`, `.center-content`: `app/globals.css`

---

## Verification

1. Run `npm run dev` — visit `/login` and `/signup`, verify forms render with fields and styling
2. Type into fields, click show/hide password icon — verify toggle works
3. Submit the form — verify `console.log` output in browser devtools
4. Click the navigation link — verify switching between pages works
5. Run `npm test` — all 7 AuthForm tests should pass
