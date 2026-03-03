# Spec for Firebase Auth Login

branch: claude/feature/firebase-auth-login

## Summary

Implement a login form on the `/login` page that authenticates users with Firebase Auth using email and password credentials. On successful login, verify the credentials and redirect authenticated users to the `/heists` dashboard. Handle authentication errors gracefully by displaying user-facing error messages. Users should not be able to access the login form if already authenticated.

## Functional Requirements

- Accept email and password input from users via a form
- Validate email and password fields are not empty before submission
- Call Firebase Auth's `signInWithEmailAndPassword` with provided credentials
- On successful login, redirect to `/heists` (authenticated dashboard)
- Display appropriate error messages for failed login attempts
- Show loading state while login request is in progress (disabled submit button, "Logging in..." text)
- Provide a navigation link to the signup page for users without an account
- Clear any previous error messages when user starts typing
- Prevent form submission while a login request is pending

## Possible Edge Cases

- Invalid email format (Firebase validation)
- Incorrect password for valid email (user-facing error)
- Non-existent user account (Firebase returns "user not found" or generic auth error)
- Network failures during authentication
- User clicking login button multiple times quickly (prevent double submission)
- User navigating away during login (pending request continues)
- Email not verified (optional: could require verification, but defer if out of scope)
- Account locked after multiple failed login attempts (Firebase security feature)
- Session token expired while on login page

## Acceptance Criteria

- Login form renders on `/login` page with email and password fields
- Form submission calls Firebase's `signInWithEmailAndPassword`
- Successful login redirects to `/heists` page
- Submit button is disabled while login request is pending
- Loading state shows "Logging in..." text
- Error messages are displayed for failed login attempts
- Existing error messages clear when user starts typing in a field
- Password field has a show/hide toggle (consistent with signup form)
- Navigation link to signup page is visible and functional
- All TypeScript types are correct, no `any` types
- Form prevents double submission
- Existing tests still pass, new tests added for login logic

## Open Questions

- Should the form require email verification before allowing login? defer to post-mvp
- Should there be a "forgot password" link? defer to post-mvp
- What's the exact error message from Firebase for non-existent users? use Firebase's native error messages
- Should we pre-populate the email field if user came from signup with an error? no
- Should login remember the user for future sessions? Firebase Auth handles this automatically via SDK

## Testing Guidelines

Create test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases:

- Login form renders with email and password fields
- Email and password inputs accept typed values
- Form displays error message on login failure (invalid credentials)
- Form disables submit button while login is in progress
- Form redirects to `/heists` on successful login
- Show/hide password toggle works
- Navigation link to signup page is visible and has correct href
- Password visibility toggle is present
- Form clears error message when user starts typing
- Multiple login failures display error messages correctly

## Checking Documentation

Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
