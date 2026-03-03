# Spec for Protected Routes

branch: claude/feature/protected-routes

## Summary

Implement route protection for the dashboard area (`/heists`, `/heists/create`, `/heists/[id]`) so that only authenticated users can access these routes. Unauthenticated users should be automatically redirected to the login page. The protection should work both when navigating within the app and when directly accessing URLs (e.g., pasting a URL into the browser). Login, signup, and logout flows should continue to work as currently implemented. The protection uses the existing `useUser()` hook from `AuthContext` to check authentication state.

## Functional Requirements

- Protect all routes under `app/(dashboard)/` from unauthenticated access
- Unauthenticated users accessing protected routes should be redirected to `/login`
- Users should see a loading state while authentication state is being determined
- Authentication state check should work on direct URL access (URL copy-paste, browser refresh, direct navigation)
- Login and signup pages remain publicly accessible without authentication
- Logout functionality clears auth session (already implemented)
- Once redirected to login, users can successfully log in and be redirected back to `/heists`
- The splash page (`/`) should redirect authenticated users to `/heists` and unauthenticated users to `/login`

## Possible Edge Cases

- User has a valid Firebase session but AuthContext loading state is true (show loading screen)
- User session expires while on a protected route (redirect to login)
- User directly pastes protected route URL (e.g., `/heists/create`) into browser address bar
- User opens a deep link to `/heists/[id]` without authentication
- Race condition between route navigation and auth state update
- User logs out from one tab while another tab has the protected page open
- Browser back button after logout (should not return to protected content)
- Multiple redirects (protected route → login → signup back) should work correctly

## Acceptance Criteria

- All routes under `/heists`, `/heists/create`, `/heists/[id]` are protected
- Unauthenticated users are redirected to `/login` when accessing protected routes
- A loading/skeleton state displays while auth state is being checked
- Direct URL access (copy-paste) triggers proper auth check before rendering page
- Splash page redirects authenticated users to `/heists`
- Splash page redirects unauthenticated users to `/login`
- Protected routes do not render protected content to unauthenticated users
- After successful login, users can access protected routes
- After logout, users cannot access protected routes (are redirected to login)
- All existing tests continue to pass

## Open Questions

- Should the loading state be a skeleton/spinner or a minimal placeholder? user should see appropriate loading indicator
- Should protected routes redirect immediately or show content briefly then redirect? redirect immediately to prevent flashing content
- Should deep links preserve the intended destination and redirect back after login? defer to post-mvp (always go to /heists after login)
- Should session expiration have special handling (auto-logout message) or just redirect silently? redirect silently for mvp

## Testing Guidelines

Create test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases:

- Unauthenticated user accessing `/heists` is redirected to `/login`
- Unauthenticated user accessing `/heists/create` is redirected to `/login`
- Unauthenticated user accessing `/heists/[id]` is redirected to `/login`
- Loading state displays while auth is being determined
- Authenticated user can access protected routes
- Splash page redirects authenticated users to `/heists`
- Splash page redirects unauthenticated users to `/login`
- User is redirected to login after logout while on protected route
- Direct URL access (simulated) triggers auth check

## Checking Documentation

Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
